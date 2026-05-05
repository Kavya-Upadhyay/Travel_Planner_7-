package com.travelplanner.controller;

import com.travelplanner.dto.expense.*;
import com.travelplanner.model.entity.User;
import com.travelplanner.service.AuthService;
import com.travelplanner.service.ExpenseService;
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
@RequestMapping("/api/trips/{tripId}/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;
    private final AuthService authService;

    @PostMapping
    public ResponseEntity<ExpenseDTO> create(
            @PathVariable UUID tripId,
            @Valid @RequestBody CreateExpenseRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(expenseService.createExpense(tripId, request, userId));
    }

    @GetMapping
    public ResponseEntity<List<ExpenseDTO>> getAll(
            @PathVariable UUID tripId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        return ResponseEntity.ok(expenseService.getTripExpenses(tripId, userId));
    }

    @GetMapping("/{expenseId}")
    public ResponseEntity<ExpenseDTO> getById(
            @PathVariable UUID tripId,
            @PathVariable UUID expenseId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        return ResponseEntity.ok(expenseService.getExpenseById(tripId, expenseId, userId));
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID tripId,
            @PathVariable UUID expenseId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        expenseService.deleteExpense(tripId, expenseId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary")
    public ResponseEntity<ExpenseSummaryDTO> getSummary(
            @PathVariable UUID tripId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        return ResponseEntity.ok(expenseService.getExpenseSummary(tripId, userId));
    }

    private UUID getAuthUserId(UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return user.getId();
    }
}
