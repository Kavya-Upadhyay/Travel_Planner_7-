package com.travelplanner.dto.activity;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class ReorderRequest {
    @NotNull
    private Integer dayNumber;

    @NotNull
    private List<UUID> activityIds;
}
