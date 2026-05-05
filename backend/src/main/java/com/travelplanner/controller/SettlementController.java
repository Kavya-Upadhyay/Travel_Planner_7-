package com.travelplanner.controller;

import com.travelplanner.model.entity.User;
import com.travelplanner.service.AuthService;
import com.travelplanner.service.SettlementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/trips/{tripId}/settlements")
@RequiredArgsConstructor
public class SettlementController {

    private final SettlementService settlementService;
    private final AuthService authService;

    @PostMapping("/calculate")
    public ResponseEntity<List<SettlementService.SettlementDTO>> calculate(
            @PathVariable UUID tripId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        return ResponseEntity.ok(settlementService.calculateSettlements(tripId, userId));
    }

    @GetMapping
    public ResponseEntity<List<SettlementService.SettlementDTO>> getAll(
            @PathVariable UUID tripId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        return ResponseEntity.ok(settlementService.getSettlements(tripId, userId));
    }

    @PostMapping("/{settlementId}/complete")
    public ResponseEntity<SettlementService.SettlementDTO> markComplete(
            @PathVariable UUID tripId,
            @PathVariable UUID settlementId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        return ResponseEntity.ok(settlementService.markCompleted(tripId, settlementId, userId));
    }

    private UUID getAuthUserId(UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return user.getId();
    }
}
