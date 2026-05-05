package com.travelplanner.repository;

import com.travelplanner.model.entity.TripMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TripMemberRepository extends JpaRepository<TripMember, UUID> {
    List<TripMember> findByTripId(UUID tripId);
    Optional<TripMember> findByTripIdAndUserId(UUID tripId, UUID userId);
    boolean existsByTripIdAndUserId(UUID tripId, UUID userId);
}
