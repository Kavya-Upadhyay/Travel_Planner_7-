package com.travelplanner.service;

import com.travelplanner.dto.activity.ActivityDTO;
import com.travelplanner.dto.activity.CreateActivityRequest;
import com.travelplanner.dto.activity.ReorderRequest;
import com.travelplanner.exception.ResourceNotFoundException;
import com.travelplanner.model.entity.Activity;
import com.travelplanner.model.entity.Trip;
import com.travelplanner.model.entity.User;
import com.travelplanner.repository.ActivityRepository;
import com.travelplanner.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * ActivityService — manages itinerary items with day-based ordering
 * and support for real-time collaboration via version tracking.
 */
@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final TripService tripService;
    private final UserRepository userRepository;

    @Transactional
    public ActivityDTO createActivity(UUID tripId, CreateActivityRequest request, UUID userId) {
        tripService.verifyEditAccess(tripId, userId);
        Trip trip = tripService.findTripOrThrow(tripId);
        User user = userRepository.findById(userId).orElseThrow();

        // Auto-assign sort order (append to end of day)
        int nextOrder = activityRepository.countByTripIdAndDayNumber(tripId, request.getDayNumber()) + 1;

        Activity activity = Activity.builder()
                .trip(trip)
                .dayNumber(request.getDayNumber())
                .sortOrder(nextOrder)
                .title(request.getTitle())
                .description(request.getDescription())
                .type(request.getType() != null ? request.getType() : Activity.ActivityType.OTHER)
                .locationName(request.getLocationName())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .estimatedCost(request.getEstimatedCost())
                .currency(request.getCurrency())
                .notes(request.getNotes())
                .createdBy(user)
                .build();

        activity = activityRepository.save(activity);
        return mapToDTO(activity);
    }

    public List<ActivityDTO> getTripActivities(UUID tripId, UUID userId) {
        tripService.verifyMembership(tripId, userId);
        return activityRepository.findByTripIdOrderByDayNumberAscSortOrderAsc(tripId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    /**
     * Returns activities grouped by day number for timeline rendering.
     */
    public Map<Integer, List<ActivityDTO>> getTripActivitiesByDay(UUID tripId, UUID userId) {
        tripService.verifyMembership(tripId, userId);
        List<Activity> activities = activityRepository.findByTripIdOrderByDayNumberAscSortOrderAsc(tripId);
        return activities.stream()
                .map(this::mapToDTO)
                .collect(Collectors.groupingBy(ActivityDTO::getDayNumber, TreeMap::new, Collectors.toList()));
    }

    @Transactional
    public ActivityDTO updateActivity(UUID tripId, UUID activityId, CreateActivityRequest request, UUID userId) {
        tripService.verifyEditAccess(tripId, userId);
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));

        activity.setTitle(request.getTitle());
        activity.setDescription(request.getDescription());
        if (request.getType() != null) activity.setType(request.getType());
        activity.setLocationName(request.getLocationName());
        activity.setLatitude(request.getLatitude());
        activity.setLongitude(request.getLongitude());
        activity.setStartTime(request.getStartTime());
        activity.setEndTime(request.getEndTime());
        activity.setEstimatedCost(request.getEstimatedCost());
        activity.setCurrency(request.getCurrency());
        activity.setNotes(request.getNotes());

        if (request.getDayNumber() != null && !request.getDayNumber().equals(activity.getDayNumber())) {
            activity.setDayNumber(request.getDayNumber());
            activity.setSortOrder(
                activityRepository.countByTripIdAndDayNumber(tripId, request.getDayNumber()) + 1
            );
        }

        activity = activityRepository.save(activity);
        return mapToDTO(activity);
    }

    @Transactional
    public void deleteActivity(UUID tripId, UUID activityId, UUID userId) {
        tripService.verifyEditAccess(tripId, userId);
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));
        activityRepository.delete(activity);
    }

    @Transactional
    public List<ActivityDTO> reorderActivities(UUID tripId, ReorderRequest request, UUID userId) {
        tripService.verifyEditAccess(tripId, userId);

        List<UUID> ids = request.getActivityIds();
        for (int i = 0; i < ids.size(); i++) {
            Activity activity = activityRepository.findById(ids.get(i))
                    .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));
            activity.setSortOrder(i + 1);
            activity.setDayNumber(request.getDayNumber());
            activityRepository.save(activity);
        }

        return activityRepository.findByTripIdAndDayNumberOrderBySortOrderAsc(tripId, request.getDayNumber())
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private ActivityDTO mapToDTO(Activity a) {
        return ActivityDTO.builder()
                .id(a.getId())
                .tripId(a.getTrip().getId())
                .dayNumber(a.getDayNumber())
                .sortOrder(a.getSortOrder())
                .title(a.getTitle())
                .description(a.getDescription())
                .type(a.getType())
                .locationName(a.getLocationName())
                .latitude(a.getLatitude())
                .longitude(a.getLongitude())
                .startTime(a.getStartTime())
                .endTime(a.getEndTime())
                .estimatedCost(a.getEstimatedCost())
                .currency(a.getCurrency())
                .notes(a.getNotes())
                .version(a.getVersion())
                .createdById(a.getCreatedBy() != null ? a.getCreatedBy().getId() : null)
                .createdByName(a.getCreatedBy() != null ? a.getCreatedBy().getFullName() : null)
                .build();
    }
}
