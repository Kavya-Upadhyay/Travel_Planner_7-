package com.travelplanner.dto.trip;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class JoinTripRequest {
    @NotBlank(message = "Invite code is required")
    private String inviteCode;
}
