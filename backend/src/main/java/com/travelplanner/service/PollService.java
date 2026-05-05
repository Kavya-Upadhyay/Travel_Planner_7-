package com.travelplanner.service;

import com.travelplanner.exception.BadRequestException;
import com.travelplanner.exception.ResourceNotFoundException;
import com.travelplanner.model.entity.*;
import com.travelplanner.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * PollService — manages polls, options, and votes for group decisions.
 */
@Service
@RequiredArgsConstructor
public class PollService {

    private final PollRepository pollRepository;
    private final VoteRepository voteRepository;
    private final TripService tripService;
    private final UserRepository userRepository;

    @Transactional
    public PollDTO createPoll(UUID tripId, CreatePollRequest request, UUID userId) {
        tripService.verifyEditAccess(tripId, userId);
        Trip trip = tripService.findTripOrThrow(tripId);
        User creator = userRepository.findById(userId).orElseThrow();

        Poll poll = Poll.builder()
                .trip(trip)
                .question(request.getQuestion())
                .pollType(request.getPollType() != null ? request.getPollType() : Poll.PollType.SINGLE)
                .deadline(request.getDeadline())
                .createdBy(creator)
                .build();

        // Add options
        List<PollOption> options = new ArrayList<>();
        for (int i = 0; i < request.getOptions().size(); i++) {
            PollOption option = PollOption.builder()
                    .poll(poll)
                    .optionText(request.getOptions().get(i))
                    .sortOrder(i + 1)
                    .build();
            options.add(option);
        }
        poll.setOptions(options);

        poll = pollRepository.save(poll);
        return mapToDTO(poll);
    }

    public List<PollDTO> getTripPolls(UUID tripId, UUID userId) {
        tripService.verifyMembership(tripId, userId);
        return pollRepository.findByTripIdOrderByCreatedAtDesc(tripId).stream()
                .map(this::mapToDTO).collect(Collectors.toList());
    }

    @Transactional
    public PollDTO vote(UUID tripId, UUID pollId, UUID optionId, UUID userId) {
        tripService.verifyEditAccess(tripId, userId);
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new ResourceNotFoundException("Poll not found"));

        if (poll.getStatus() == Poll.PollStatus.CLOSED) {
            throw new BadRequestException("Poll is closed");
        }
        if (poll.getDeadline() != null && LocalDateTime.now().isAfter(poll.getDeadline())) {
            throw new BadRequestException("Poll deadline has passed");
        }

        User user = userRepository.findById(userId).orElseThrow();
        PollOption option = poll.getOptions().stream()
                .filter(o -> o.getId().equals(optionId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Option not found"));

        // For SINGLE choice, remove existing votes first
        if (poll.getPollType() == Poll.PollType.SINGLE) {
            List<Vote> existingVotes = voteRepository.findByPollIdAndUserId(pollId, userId);
            voteRepository.deleteAll(existingVotes);
        }

        // Check for duplicate vote on same option
        if (voteRepository.existsByPollIdAndOptionIdAndUserId(pollId, optionId, userId)) {
            throw new BadRequestException("Already voted for this option");
        }

        Vote vote = Vote.builder()
                .poll(poll)
                .option(option)
                .user(user)
                .build();
        voteRepository.save(vote);

        return mapToDTO(poll);
    }

    @Transactional
    public PollDTO closePoll(UUID tripId, UUID pollId, UUID userId) {
        tripService.verifyAdminAccess(tripId, userId);
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new ResourceNotFoundException("Poll not found"));
        poll.setStatus(Poll.PollStatus.CLOSED);
        poll = pollRepository.save(poll);
        return mapToDTO(poll);
    }

    private PollDTO mapToDTO(Poll poll) {
        List<PollDTO.OptionResult> optionResults = poll.getOptions().stream()
                .map(option -> PollDTO.OptionResult.builder()
                        .id(option.getId())
                        .optionText(option.getOptionText())
                        .voteCount(voteRepository.countByOptionId(option.getId()))
                        .build())
                .collect(Collectors.toList());

        return PollDTO.builder()
                .id(poll.getId())
                .tripId(poll.getTrip().getId())
                .question(poll.getQuestion())
                .pollType(poll.getPollType())
                .deadline(poll.getDeadline())
                .status(poll.getStatus())
                .createdById(poll.getCreatedBy().getId())
                .createdByName(poll.getCreatedBy().getFullName())
                .options(optionResults)
                .totalVotes(optionResults.stream().mapToInt(PollDTO.OptionResult::getVoteCount).sum())
                .build();
    }

    // --- DTOs ---
    @lombok.Data
    @lombok.Builder
    @lombok.AllArgsConstructor
    public static class PollDTO {
        private UUID id;
        private UUID tripId;
        private String question;
        private Poll.PollType pollType;
        private LocalDateTime deadline;
        private Poll.PollStatus status;
        private UUID createdById;
        private String createdByName;
        private List<OptionResult> options;
        private int totalVotes;

        @lombok.Data
        @lombok.Builder
        @lombok.AllArgsConstructor
        public static class OptionResult {
            private UUID id;
            private String optionText;
            private int voteCount;
        }
    }

    @lombok.Data
    public static class CreatePollRequest {
        private String question;
        private Poll.PollType pollType;
        private LocalDateTime deadline;
        private List<String> options;
    }

    @lombok.Data
    public static class VoteRequest {
        private UUID optionId;
    }
}
