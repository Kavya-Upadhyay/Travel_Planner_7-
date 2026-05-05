package com.travelplanner.repository;

import com.travelplanner.model.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TripRepository extends JpaRepository<Trip, UUID> {
    Optional<Trip> findByInviteCode(String inviteCode);

    @Query("SELECT t FROM Trip t JOIN t.members m WHERE m.user.id = :userId ORDER BY t.updatedAt DESC")
    List<Trip> findAllByMemberUserId(@Param("userId") UUID userId);
}
