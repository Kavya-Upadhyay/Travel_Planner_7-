package com.travelplanner.dto.trip;

import com.travelplanner.model.entity.Trip;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
public class TripDTO {
    private UUID id;
    private String title;
    private String description;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private String coverImageUrl;
    private String inviteCode;
    private Trip.TripStatus status;
    private UUID createdById;
    private String createdByName;
    private List<TripMemberDTO> members;
    private int memberCount;
}
