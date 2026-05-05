package com.travelplanner.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
public class AuthResponse {
    private UUID id;
    private String email;
    private String fullName;
    private String avatarUrl;
    private String token;
    private String refreshToken;
}
