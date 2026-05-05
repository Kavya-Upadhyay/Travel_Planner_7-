package com.travelplanner.repository;

import com.travelplanner.model.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VoteRepository extends JpaRepository<Vote, UUID> {
    List<Vote> findByPollId(UUID pollId);
    List<Vote> findByPollIdAndUserId(UUID pollId, UUID userId);
    boolean existsByPollIdAndOptionIdAndUserId(UUID pollId, UUID optionId, UUID userId);
    int countByOptionId(UUID optionId);
}
