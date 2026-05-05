package com.travelplanner.controller;

import com.travelplanner.model.entity.User;
import com.travelplanner.service.AuthService;
import com.travelplanner.service.PollService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/trips/{tripId}/polls")
@RequiredArgsConstructor
public class PollController {

    private final PollService pollService;
    private final AuthService authService;

    @PostMapping
    public ResponseEntity<PollService.PollDTO> create(
            @PathVariable UUID tripId,
            @RequestBody PollService.CreatePollRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(pollService.createPoll(tripId, request, userId));
    }

    @GetMapping
    public ResponseEntity<List<PollService.PollDTO>> getAll(
            @PathVariable UUID tripId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        return ResponseEntity.ok(pollService.getTripPolls(tripId, userId));
    }

    @PostMapping("/{pollId}/vote")
    public ResponseEntity<PollService.PollDTO> vote(
            @PathVariable UUID tripId,
            @PathVariable UUID pollId,
            @RequestBody PollService.VoteRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        return ResponseEntity.ok(pollService.vote(tripId, pollId, request.getOptionId(), userId));
    }

    @PutMapping("/{pollId}/close")
    public ResponseEntity<PollService.PollDTO> close(
            @PathVariable UUID tripId,
            @PathVariable UUID pollId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        return ResponseEntity.ok(pollService.closePoll(tripId, pollId, userId));
    }

    private UUID getAuthUserId(UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return user.getId();
    }
}
