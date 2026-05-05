package com.travelplanner.dto.trip;

import com.travelplanner.model.entity.TripMember;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
public class TripMemberDTO {
    private UUID userId;
    private String fullName;
    private String email;
    private String avatarUrl;
    private TripMember.MemberRole role;
}
