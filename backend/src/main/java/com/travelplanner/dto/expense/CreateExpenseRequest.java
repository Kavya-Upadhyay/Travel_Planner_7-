package com.travelplanner.dto.expense;

import com.travelplanner.model.entity.Expense;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class CreateExpenseRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    @NotBlank(message = "Currency is required")
    private String currency;

    private Expense.ExpenseCategory category;

    @NotNull(message = "Split type is required")
    private Expense.SplitType splitType;

    @NotNull(message = "Payer is required")
    private UUID paidBy;

    private LocalDate date;
    private String notes;
    private UUID activityId;

    @NotNull(message = "Splits are required")
    private List<SplitInput> splits;

    @Data
    public static class SplitInput {
        @NotNull
        private UUID userId;
        private BigDecimal shareValue; // Used for EXACT, PERCENTAGE, SHARES
    }
}
