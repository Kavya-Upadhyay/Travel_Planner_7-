package com.travelplanner.controller;

import com.travelplanner.dto.trip.*;
import com.travelplanner.model.entity.User;
import com.travelplanner.service.AuthService;
import com.travelplanner.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;
    private final AuthService authService;

    @PostMapping
    public ResponseEntity<TripDTO> createTrip(
            @Valid @RequestBody CreateTripRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        return ResponseEntity.status(HttpStatus.CREATED).body(tripService.createTrip(request, userId));
    }

    @GetMapping
    public ResponseEntity<List<TripDTO>> getMyTrips(@AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        return ResponseEntity.ok(tripService.getUserTrips(userId));
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<TripDTO> getTrip(
            @PathVariable UUID tripId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        return ResponseEntity.ok(tripService.getTripById(tripId, userId));
    }

    @PutMapping("/{tripId}")
    public ResponseEntity<TripDTO> updateTrip(
            @PathVariable UUID tripId,
            @Valid @RequestBody CreateTripRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        return ResponseEntity.ok(tripService.updateTrip(tripId, request, userId));
    }

    @DeleteMapping("/{tripId}")
    public ResponseEntity<Void> deleteTrip(
            @PathVariable UUID tripId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        tripService.deleteTrip(tripId, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/join")
    public ResponseEntity<TripDTO> joinTrip(
            @Valid @RequestBody JoinTripRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        return ResponseEntity.ok(tripService.joinTrip(request.getInviteCode(), userId));
    }

    @GetMapping("/{tripId}/members")
    public ResponseEntity<List<TripMemberDTO>> getMembers(
            @PathVariable UUID tripId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        return ResponseEntity.ok(tripService.getTripMembers(tripId, userId));
    }

    @DeleteMapping("/{tripId}/members/{targetUserId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable UUID tripId,
            @PathVariable UUID targetUserId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        tripService.removeMember(tripId, targetUserId, userId);
        return ResponseEntity.noContent().build();
    }

    private UUID getAuthUserId(UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return user.getId();
    }
}
