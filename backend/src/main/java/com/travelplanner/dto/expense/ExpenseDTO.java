package com.travelplanner.dto.expense;

import com.travelplanner.model.entity.Expense;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
public class ExpenseDTO {
    private UUID id;
    private UUID tripId;
    private String title;
    private BigDecimal amount;
    private String currency;
    private Expense.ExpenseCategory category;
    private Expense.SplitType splitType;
    private UUID paidById;
    private String paidByName;
    private String receiptUrl;
    private LocalDate date;
    private String notes;
    private UUID activityId;
    private List<ExpenseSplitDTO> splits;

    @Data
    @Builder
    @AllArgsConstructor
    public static class ExpenseSplitDTO {
        private UUID userId;
        private String userName;
        private BigDecimal amount;
        private BigDecimal shareValue;
    }
}
