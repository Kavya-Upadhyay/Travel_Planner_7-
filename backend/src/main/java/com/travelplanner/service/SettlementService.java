package com.travelplanner.service;

import com.travelplanner.dto.expense.ExpenseSummaryDTO;
import com.travelplanner.model.entity.*;
import com.travelplanner.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

/**
 * SettlementService — implements the Min Cash Flow algorithm to minimize
 * the number of transactions needed to settle all debts within a trip.
 *
 * Algorithm:
 * 1. Compute net balance for each member (totalPaid - totalOwed)
 * 2. Separate into creditors (+) and debtors (-)
 * 3. Greedily match the largest creditor with the largest debtor
 * 4. Each match produces one settlement transaction
 *
 * Time Complexity: O(N log N) where N = number of members
 * Space Complexity: O(N)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SettlementService {

    private final SettlementRepository settlementRepository;
    private final ExpenseRepository expenseRepository;
    private final ExpenseSplitRepository expenseSplitRepository;
    private final TripService tripService;
    private final UserRepository userRepository;

    /**
     * Recalculates and returns optimized settlements for a trip.
     * Deletes any existing pending settlements and generates new ones.
     */
    @Transactional
    public List<SettlementDTO> calculateSettlements(UUID tripId, UUID userId) {
        tripService.verifyMembership(tripId, userId);
        Trip trip = tripService.findTripOrThrow(tripId);

        // Step 1: Compute net balances
        Map<UUID, BigDecimal> balances = computeNetBalances(tripId);

        // Step 2: Delete existing pending settlements
        settlementRepository.deleteByTripId(tripId);

        // Step 3: Run Min Cash Flow algorithm
        List<Settlement> settlements = minCashFlow(balances, trip);

        // Step 4: Save and return
        settlementRepository.saveAll(settlements);

        return settlements.stream().map(this::mapToDTO).toList();
    }

    public List<SettlementDTO> getSettlements(UUID tripId, UUID userId) {
        tripService.verifyMembership(tripId, userId);
        return settlementRepository.findByTripId(tripId).stream()
                .map(this::mapToDTO).toList();
    }

    @Transactional
    public SettlementDTO markCompleted(UUID tripId, UUID settlementId, UUID userId) {
        tripService.verifyMembership(tripId, userId);
        Settlement settlement = settlementRepository.findById(settlementId)
                .orElseThrow(() -> new RuntimeException("Settlement not found"));
        settlement.setStatus(Settlement.SettlementStatus.COMPLETED);
        settlement.setCompletedAt(LocalDateTime.now());
        settlement = settlementRepository.save(settlement);
        return mapToDTO(settlement);
    }

    /**
     * Computes net balance for each user in a trip.
     * Net balance = total amount paid - total amount owed.
     * Positive = others owe them, Negative = they owe others.
     */
    private Map<UUID, BigDecimal> computeNetBalances(UUID tripId) {
        Map<UUID, BigDecimal> balances = new HashMap<>();

        List<Expense> expenses = expenseRepository.findByTripIdOrderByDateDesc(tripId);
        for (Expense expense : expenses) {
            // Payer's balance increases by the amount they paid
            UUID payerId = expense.getPaidBy().getId();
            balances.merge(payerId, expense.getAmount(), BigDecimal::add);

            // Each participant's balance decreases by their share
            List<ExpenseSplit> splits = expenseSplitRepository.findByExpenseId(expense.getId());
            for (ExpenseSplit split : splits) {
                UUID splitUserId = split.getUser().getId();
                balances.merge(splitUserId, split.getAmount().negate(), BigDecimal::add);
            }
        }

        return balances;
    }

    /**
     * Min Cash Flow Algorithm (Greedy):
     * 
     * 1. Separate users into creditors (positive balance) and debtors (negative balance)
     * 2. Use two priority queues (max-heaps by absolute value)
     * 3. Match the largest creditor with the largest debtor
     * 4. Transfer min(credit, |debt|) between them
     * 5. Update balances and repeat until all settled
     *
     * This greedy approach produces at most N-1 transactions for N users,
     * which is near-optimal for most real-world cases.
     */
    private List<Settlement> minCashFlow(Map<UUID, BigDecimal> balances, Trip trip) {
        List<Settlement> settlements = new ArrayList<>();

        // Separate into creditors and debtors
        // Using a priority queue sorted by absolute value (largest first)
        PriorityQueue<Map.Entry<UUID, BigDecimal>> creditors = new PriorityQueue<>(
                (a, b) -> b.getValue().compareTo(a.getValue()));  // Max heap
        PriorityQueue<Map.Entry<UUID, BigDecimal>> debtors = new PriorityQueue<>(
                (a, b) -> a.getValue().compareTo(b.getValue()));  // Min heap (most negative first)

        for (Map.Entry<UUID, BigDecimal> entry : balances.entrySet()) {
            BigDecimal balance = entry.getValue();
            // Skip negligible amounts (less than 0.01)
            if (balance.abs().compareTo(new BigDecimal("0.01")) < 0) continue;

            if (balance.compareTo(BigDecimal.ZERO) > 0) {
                creditors.add(entry);
            } else if (balance.compareTo(BigDecimal.ZERO) < 0) {
                debtors.add(entry);
            }
        }

        while (!creditors.isEmpty() && !debtors.isEmpty()) {
            Map.Entry<UUID, BigDecimal> maxCreditor = creditors.poll();
            Map.Entry<UUID, BigDecimal> maxDebtor = debtors.poll();

            BigDecimal credit = maxCreditor.getValue();
            BigDecimal debt = maxDebtor.getValue().abs();

            // Transfer the minimum of the two
            BigDecimal transferAmount = credit.min(debt);

            User payer = userRepository.findById(maxDebtor.getKey()).orElseThrow();
            User payee = userRepository.findById(maxCreditor.getKey()).orElseThrow();

            Settlement settlement = Settlement.builder()
                    .trip(trip)
                    .payer(payer)      // debtor pays
                    .payee(payee)      // creditor receives
                    .amount(transferAmount)
                    .currency(trip.getMembers().isEmpty() ? "USD" : "USD") // Default
                    .build();
            settlements.add(settlement);

            // Update remaining balances
            BigDecimal remainingCredit = credit.subtract(transferAmount);
            BigDecimal remainingDebt = debt.subtract(transferAmount);

            if (remainingCredit.compareTo(new BigDecimal("0.01")) >= 0) {
                creditors.add(Map.entry(maxCreditor.getKey(), remainingCredit));
            }
            if (remainingDebt.compareTo(new BigDecimal("0.01")) >= 0) {
                debtors.add(Map.entry(maxDebtor.getKey(), remainingDebt.negate()));
            }
        }

        log.info("Min Cash Flow: {} members → {} transactions", balances.size(), settlements.size());
        return settlements;
    }

    private SettlementDTO mapToDTO(Settlement s) {
        return SettlementDTO.builder()
                .id(s.getId())
                .tripId(s.getTrip().getId())
                .payerId(s.getPayer().getId())
                .payerName(s.getPayer().getFullName())
                .payeeId(s.getPayee().getId())
                .payeeName(s.getPayee().getFullName())
                .amount(s.getAmount())
                .currency(s.getCurrency())
                .status(s.getStatus())
                .completedAt(s.getCompletedAt())
                .build();
    }

    // Inner DTO class for settlement response
    @lombok.Data
    @lombok.Builder
    @lombok.AllArgsConstructor
    public static class SettlementDTO {
        private UUID id;
        private UUID tripId;
        private UUID payerId;
        private String payerName;
        private UUID payeeId;
        private String payeeName;
        private BigDecimal amount;
        private String currency;
        private Settlement.SettlementStatus status;
        private LocalDateTime completedAt;
    }
}
