package com.travelplanner.repository;

import com.travelplanner.model.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, UUID> {
    List<Activity> findByTripIdOrderByDayNumberAscSortOrderAsc(UUID tripId);
    List<Activity> findByTripIdAndDayNumberOrderBySortOrderAsc(UUID tripId, Integer dayNumber);
    int countByTripIdAndDayNumber(UUID tripId, Integer dayNumber);
}
