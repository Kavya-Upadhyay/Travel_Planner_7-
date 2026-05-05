package com.travelplanner.dto.trip;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateTripRequest {
    @NotBlank(message = "Title is required")
    @Size(max = 200)
    private String title;

    private String description;

    @Size(max = 200)
    private String destination;

    private LocalDate startDate;
    private LocalDate endDate;
    private String coverImageUrl;
}
