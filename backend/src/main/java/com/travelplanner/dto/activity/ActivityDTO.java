package com.travelplanner.dto.activity;

import com.travelplanner.model.entity.Activity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
public class ActivityDTO {
    private UUID id;
    private UUID tripId;
    private Integer dayNumber;
    private Integer sortOrder;
    private String title;
    private String description;
    private Activity.ActivityType type;
    private String locationName;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private LocalTime startTime;
    private LocalTime endTime;
    private BigDecimal estimatedCost;
    private String currency;
    private String notes;
    private Integer version;
    private UUID createdById;
    private String createdByName;
}
