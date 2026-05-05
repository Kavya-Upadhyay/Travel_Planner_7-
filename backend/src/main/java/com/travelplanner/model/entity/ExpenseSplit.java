package com.travelplanner.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * ExpenseSplit — how much each participant owes for a given expense.
 * shareValue stores the raw input (percentage, shares, or exact amount).
 * amount stores the calculated actual owed amount.
 */
@Entity
@Table(name = "expense_splits", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"expense_id", "user_id"})
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ExpenseSplit {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expense_id", nullable = false)
    private Expense expense;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // The actual calculated amount this user owes
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    // Raw input value (e.g., 50 for 50%, or 2 for 2 shares)
    @Column(name = "share_value", precision = 12, scale = 4)
    private BigDecimal shareValue;
}
