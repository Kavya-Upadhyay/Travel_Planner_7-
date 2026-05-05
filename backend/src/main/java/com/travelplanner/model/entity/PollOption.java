package com.travelplanner.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

/**
 * PollOption — a choice within a poll that users can vote for.
 */
@Entity
@Table(name = "poll_options")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PollOption {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "poll_id", nullable = false)
    private Poll poll;

    @Column(name = "option_text", nullable = false, length = 300)
    private String optionText;

    @Column(name = "sort_order")
    private Integer sortOrder;
}
