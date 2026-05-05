package com.travelplanner.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

/**
 * UserDTO — public-facing user representation (no sensitive fields like password).
 */
@Data
@Builder
@AllArgsConstructor
public class UserDTO {
    private UUID id;
    private String email;
    private String fullName;
    private String avatarUrl;
    private String currencyPref;
}
