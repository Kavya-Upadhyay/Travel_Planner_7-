package com.travelplanner.service;

import com.travelplanner.dto.trip.*;
import com.travelplanner.exception.BadRequestException;
import com.travelplanner.exception.ResourceNotFoundException;
import com.travelplanner.exception.UnauthorizedException;
import com.travelplanner.model.entity.Trip;
import com.travelplanner.model.entity.TripMember;
import com.travelplanner.model.entity.User;
import com.travelplanner.repository.TripMemberRepository;
import com.travelplanner.repository.TripRepository;
import com.travelplanner.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * TripService — manages trip CRUD, invite codes, and member management.
 * Generates a unique 6-character alphanumeric invite code per trip.
 */
@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final TripMemberRepository tripMemberRepository;
    private final UserRepository userRepository;

    private static final String INVITE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    @Transactional
    public TripDTO createTrip(CreateTripRequest request, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Trip trip = Trip.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .destination(request.getDestination())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .coverImageUrl(request.getCoverImageUrl())
                .inviteCode(generateInviteCode())
                .createdBy(user)
                .build();

        trip = tripRepository.save(trip);

        // Add creator as OWNER
        TripMember ownerMember = TripMember.builder()
                .trip(trip)
                .user(user)
                .role(TripMember.MemberRole.OWNER)
                .build();
        tripMemberRepository.save(ownerMember);

        return mapToDTO(trip);
    }

    public List<TripDTO> getUserTrips(UUID userId) {
        return tripRepository.findAllByMemberUserId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public TripDTO getTripById(UUID tripId, UUID userId) {
        Trip trip = findTripOrThrow(tripId);
        verifyMembership(tripId, userId);
        return mapToDTO(trip);
    }

    @Transactional
    public TripDTO updateTrip(UUID tripId, CreateTripRequest request, UUID userId) {
        Trip trip = findTripOrThrow(tripId);
        verifyAdminAccess(tripId, userId);

        trip.setTitle(request.getTitle());
        trip.setDescription(request.getDescription());
        trip.setDestination(request.getDestination());
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        if (request.getCoverImageUrl() != null) {
            trip.setCoverImageUrl(request.getCoverImageUrl());
        }

        trip = tripRepository.save(trip);
        return mapToDTO(trip);
    }

    @Transactional
    public void deleteTrip(UUID tripId, UUID userId) {
        Trip trip = findTripOrThrow(tripId);
        // Only OWNER can delete
        TripMember member = tripMemberRepository.findByTripIdAndUserId(tripId, userId)
                .orElseThrow(() -> new UnauthorizedException("Not a member of this trip"));
        if (member.getRole() != TripMember.MemberRole.OWNER) {
            throw new UnauthorizedException("Only the trip owner can delete the trip");
        }
        tripRepository.delete(trip);
    }

    @Transactional
    public TripDTO joinTrip(String inviteCode, UUID userId) {
        Trip trip = tripRepository.findByInviteCode(inviteCode.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid invite code"));

        if (tripMemberRepository.existsByTripIdAndUserId(trip.getId(), userId)) {
            throw new BadRequestException("Already a member of this trip");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TripMember member = TripMember.builder()
                .trip(trip)
                .user(user)
                .role(TripMember.MemberRole.MEMBER)
                .build();
        tripMemberRepository.save(member);

        return mapToDTO(trip);
    }

    public List<TripMemberDTO> getTripMembers(UUID tripId, UUID userId) {
        verifyMembership(tripId, userId);
        return tripMemberRepository.findByTripId(tripId).stream()
                .map(this::mapMemberToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeMember(UUID tripId, UUID targetUserId, UUID requesterId) {
        verifyAdminAccess(tripId, requesterId);
        TripMember member = tripMemberRepository.findByTripIdAndUserId(tripId, targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        if (member.getRole() == TripMember.MemberRole.OWNER) {
            throw new BadRequestException("Cannot remove the trip owner");
        }
        tripMemberRepository.delete(member);
    }

    // --- Helper methods ---

    public Trip findTripOrThrow(UUID tripId) {
        return tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));
    }

    public void verifyMembership(UUID tripId, UUID userId) {
        if (!tripMemberRepository.existsByTripIdAndUserId(tripId, userId)) {
            throw new UnauthorizedException("Not a member of this trip");
        }
    }

    public void verifyAdminAccess(UUID tripId, UUID userId) {
        TripMember member = tripMemberRepository.findByTripIdAndUserId(tripId, userId)
                .orElseThrow(() -> new UnauthorizedException("Not a member of this trip"));
        if (member.getRole() != TripMember.MemberRole.OWNER &&
            member.getRole() != TripMember.MemberRole.ADMIN) {
            throw new UnauthorizedException("Insufficient permissions");
        }
    }

    public void verifyEditAccess(UUID tripId, UUID userId) {
        TripMember member = tripMemberRepository.findByTripIdAndUserId(tripId, userId)
                .orElseThrow(() -> new UnauthorizedException("Not a member of this trip"));
        if (member.getRole() == TripMember.MemberRole.VIEWER) {
            throw new UnauthorizedException("Viewers cannot edit");
        }
    }

    private String generateInviteCode() {
        StringBuilder sb = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            sb.append(INVITE_CHARS.charAt(RANDOM.nextInt(INVITE_CHARS.length())));
        }
        // Ensure uniqueness
        String code = sb.toString();
        if (tripRepository.findByInviteCode(code).isPresent()) {
            return generateInviteCode(); // Recursive retry (collision is rare with 36^6 space)
        }
        return code;
    }

    private TripDTO mapToDTO(Trip trip) {
        List<TripMember> members = tripMemberRepository.findByTripId(trip.getId());
        return TripDTO.builder()
                .id(trip.getId())
                .title(trip.getTitle())
                .description(trip.getDescription())
                .destination(trip.getDestination())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .coverImageUrl(trip.getCoverImageUrl())
                .inviteCode(trip.getInviteCode())
                .status(trip.getStatus())
                .createdById(trip.getCreatedBy().getId())
                .createdByName(trip.getCreatedBy().getFullName())
                .members(members.stream().map(this::mapMemberToDTO).collect(Collectors.toList()))
                .memberCount(members.size())
                .build();
    }

    private TripMemberDTO mapMemberToDTO(TripMember member) {
        return TripMemberDTO.builder()
                .userId(member.getUser().getId())
                .fullName(member.getUser().getFullName())
                .email(member.getUser().getEmail())
                .avatarUrl(member.getUser().getAvatarUrl())
                .role(member.getRole())
                .build();
    }
}
