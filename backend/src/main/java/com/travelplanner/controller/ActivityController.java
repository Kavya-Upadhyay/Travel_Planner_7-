package com.travelplanner.controller;

import com.travelplanner.dto.activity.ActivityDTO;
import com.travelplanner.dto.activity.CreateActivityRequest;
import com.travelplanner.dto.activity.ReorderRequest;
import com.travelplanner.model.entity.User;
import com.travelplanner.service.ActivityService;
import com.travelplanner.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/trips/{tripId}/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;
    private final AuthService authService;

    @PostMapping
    public ResponseEntity<ActivityDTO> create(
            @PathVariable UUID tripId,
            @Valid @RequestBody CreateActivityRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(activityService.createActivity(tripId, request, userId));
    }

    @GetMapping
    public ResponseEntity<List<ActivityDTO>> getAll(
            @PathVariable UUID tripId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        return ResponseEntity.ok(activityService.getTripActivities(tripId, userId));
    }

    @GetMapping("/by-day")
    public ResponseEntity<Map<Integer, List<ActivityDTO>>> getByDay(
            @PathVariable UUID tripId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        return ResponseEntity.ok(activityService.getTripActivitiesByDay(tripId, userId));
    }

    @PutMapping("/{activityId}")
    public ResponseEntity<ActivityDTO> update(
            @PathVariable UUID tripId,
            @PathVariable UUID activityId,
            @Valid @RequestBody CreateActivityRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        return ResponseEntity.ok(activityService.updateActivity(tripId, activityId, request, userId));
    }

    @DeleteMapping("/{activityId}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID tripId,
            @PathVariable UUID activityId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        activityService.deleteActivity(tripId, activityId, userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/reorder")
    public ResponseEntity<List<ActivityDTO>> reorder(
            @PathVariable UUID tripId,
            @Valid @RequestBody ReorderRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        return ResponseEntity.ok(activityService.reorderActivities(tripId, request, userId));
    }

    private UUID getAuthUserId(UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return user.getId();
    }
}
