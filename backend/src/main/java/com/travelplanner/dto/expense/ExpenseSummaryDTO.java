package com.travelplanner.dto.expense;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
public class ExpenseSummaryDTO {
    private BigDecimal totalExpenses;
    private String currency;
    private int expenseCount;
    private Map<String, BigDecimal> categoryBreakdown;  // category -> total
    private List<MemberBalance> memberBalances;         // per-member net balance

    @Data
    @Builder
    @AllArgsConstructor
    public static class MemberBalance {
        private UUID userId;
        private String userName;
        private BigDecimal totalPaid;
        private BigDecimal totalOwed;
        private BigDecimal netBalance;  // positive = owed money, negative = owes money
    }
}
