package com.travelplanner.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Poll — a voting question posted within a trip for group decisions.
 */
@Entity
@Table(name = "polls")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Poll {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(nullable = false, length = 500)
    private String question;

    @Enumerated(EnumType.STRING)
    @Column(name = "poll_type", length = 20)
    @Builder.Default
    private PollType pollType = PollType.SINGLE;

    @Column
    private LocalDateTime deadline;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private PollStatus status = PollStatus.ACTIVE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @OneToMany(mappedBy = "poll", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PollOption> options = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum PollType {
        SINGLE, MULTIPLE
    }

    public enum PollStatus {
        ACTIVE, CLOSED
    }
}
