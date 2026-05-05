package com.travelplanner.dto.activity;

import com.travelplanner.model.entity.Activity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalTime;

@Data
public class CreateActivityRequest {
    @NotNull(message = "Day number is required")
    private Integer dayNumber;

    @NotBlank(message = "Title is required")
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
}
