package com.travelplanner.service;

import com.travelplanner.dto.expense.*;
import com.travelplanner.exception.BadRequestException;
import com.travelplanner.exception.ResourceNotFoundException;
import com.travelplanner.model.entity.*;
import com.travelplanner.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * ExpenseService — manages expense CRUD with 4 split types.
 * 
 * Split calculation logic:
 * - EQUAL: total / numParticipants
 * - EXACT: each user specifies their exact amount (must sum to total)
 * - PERCENTAGE: each user specifies a percentage (must sum to 100)
 * - SHARES: each user specifies shares (amount = total * userShares / totalShares)
 */
@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseSplitRepository expenseSplitRepository;
    private final TripService tripService;
    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;

    @Transactional
    public ExpenseDTO createExpense(UUID tripId, CreateExpenseRequest request, UUID userId) {
        tripService.verifyEditAccess(tripId, userId);
        Trip trip = tripService.findTripOrThrow(tripId);
        User payer = userRepository.findById(request.getPaidBy())
                .orElseThrow(() -> new ResourceNotFoundException("Payer not found"));
        User creator = userRepository.findById(userId).orElseThrow();

        Expense expense = Expense.builder()
                .trip(trip)
                .title(request.getTitle())
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .category(request.getCategory() != null ? request.getCategory() : Expense.ExpenseCategory.OTHER)
                .splitType(request.getSplitType())
                .paidBy(payer)
                .date(request.getDate() != null ? request.getDate() : LocalDate.now())
                .notes(request.getNotes())
                .createdBy(creator)
                .build();

        // Link to activity if provided
        if (request.getActivityId() != null) {
            Activity activity = activityRepository.findById(request.getActivityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));
            expense.setActivity(activity);
        }

        expense = expenseRepository.save(expense);

        // Calculate and save splits
        List<ExpenseSplit> splits = calculateSplits(expense, request);
        expenseSplitRepository.saveAll(splits);

        return mapToDTO(expense, splits);
    }

    public List<ExpenseDTO> getTripExpenses(UUID tripId, UUID userId) {
        tripService.verifyMembership(tripId, userId);
        return expenseRepository.findByTripIdOrderByDateDesc(tripId).stream()
                .map(e -> mapToDTO(e, expenseSplitRepository.findByExpenseId(e.getId())))
                .collect(Collectors.toList());
    }

    public ExpenseDTO getExpenseById(UUID tripId, UUID expenseId, UUID userId) {
        tripService.verifyMembership(tripId, userId);
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
        List<ExpenseSplit> splits = expenseSplitRepository.findByExpenseId(expenseId);
        return mapToDTO(expense, splits);
    }

    @Transactional
    public void deleteExpense(UUID tripId, UUID expenseId, UUID userId) {
        tripService.verifyEditAccess(tripId, userId);
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
        expenseRepository.delete(expense);
    }

    public ExpenseSummaryDTO getExpenseSummary(UUID tripId, UUID userId) {
        tripService.verifyMembership(tripId, userId);

        List<Expense> expenses = expenseRepository.findByTripIdOrderByDateDesc(tripId);
        BigDecimal total = expenseRepository.getTotalExpensesByTripId(tripId);

        // Category breakdown
        Map<String, BigDecimal> categoryBreakdown = expenses.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getCategory().name(),
                        Collectors.reducing(BigDecimal.ZERO, Expense::getAmount, BigDecimal::add)
                ));

        // Member balances
        Map<UUID, BigDecimal> paidMap = new HashMap<>();
        Map<UUID, BigDecimal> owedMap = new HashMap<>();
        Map<UUID, String> nameMap = new HashMap<>();

        for (Expense expense : expenses) {
            UUID payerId = expense.getPaidBy().getId();
            paidMap.merge(payerId, expense.getAmount(), BigDecimal::add);
            nameMap.putIfAbsent(payerId, expense.getPaidBy().getFullName());

            List<ExpenseSplit> splits = expenseSplitRepository.findByExpenseId(expense.getId());
            for (ExpenseSplit split : splits) {
                UUID splitUserId = split.getUser().getId();
                owedMap.merge(splitUserId, split.getAmount(), BigDecimal::add);
                nameMap.putIfAbsent(splitUserId, split.getUser().getFullName());
            }
        }

        Set<UUID> allUsers = new HashSet<>();
        allUsers.addAll(paidMap.keySet());
        allUsers.addAll(owedMap.keySet());

        List<ExpenseSummaryDTO.MemberBalance> balances = allUsers.stream()
                .map(uid -> {
                    BigDecimal paid = paidMap.getOrDefault(uid, BigDecimal.ZERO);
                    BigDecimal owed = owedMap.getOrDefault(uid, BigDecimal.ZERO);
                    return ExpenseSummaryDTO.MemberBalance.builder()
                            .userId(uid)
                            .userName(nameMap.get(uid))
                            .totalPaid(paid)
                            .totalOwed(owed)
                            .netBalance(paid.subtract(owed))
                            .build();
                })
                .collect(Collectors.toList());

        String currency = expenses.isEmpty() ? "USD" : expenses.get(0).getCurrency();

        return ExpenseSummaryDTO.builder()
                .totalExpenses(total)
                .currency(currency)
                .expenseCount(expenses.size())
                .categoryBreakdown(categoryBreakdown)
                .memberBalances(balances)
                .build();
    }

    /**
     * Calculates split amounts based on the split type.
     */
    private List<ExpenseSplit> calculateSplits(Expense expense, CreateExpenseRequest request) {
        List<CreateExpenseRequest.SplitInput> splitInputs = request.getSplits();
        BigDecimal totalAmount = request.getAmount();
        List<ExpenseSplit> result = new ArrayList<>();

        switch (request.getSplitType()) {
            case EQUAL -> {
                BigDecimal perPerson = totalAmount.divide(
                        BigDecimal.valueOf(splitInputs.size()), 2, RoundingMode.HALF_UP);
                for (CreateExpenseRequest.SplitInput input : splitInputs) {
                    User user = userRepository.findById(input.getUserId()).orElseThrow();
                    result.add(ExpenseSplit.builder()
                            .expense(expense).user(user)
                            .amount(perPerson).shareValue(perPerson)
                            .build());
                }
            }
            case EXACT -> {
                BigDecimal sum = splitInputs.stream()
                        .map(CreateExpenseRequest.SplitInput::getShareValue)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                if (sum.compareTo(totalAmount) != 0) {
                    throw new BadRequestException("Exact split amounts must sum to " + totalAmount + ", got " + sum);
                }
                for (CreateExpenseRequest.SplitInput input : splitInputs) {
                    User user = userRepository.findById(input.getUserId()).orElseThrow();
                    result.add(ExpenseSplit.builder()
                            .expense(expense).user(user)
                            .amount(input.getShareValue()).shareValue(input.getShareValue())
                            .build());
                }
            }
            case PERCENTAGE -> {
                BigDecimal totalPct = splitInputs.stream()
                        .map(CreateExpenseRequest.SplitInput::getShareValue)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                if (totalPct.compareTo(BigDecimal.valueOf(100)) != 0) {
                    throw new BadRequestException("Percentages must sum to 100, got " + totalPct);
                }
                for (CreateExpenseRequest.SplitInput input : splitInputs) {
                    User user = userRepository.findById(input.getUserId()).orElseThrow();
                    BigDecimal amount = totalAmount.multiply(input.getShareValue())
                            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                    result.add(ExpenseSplit.builder()
                            .expense(expense).user(user)
                            .amount(amount).shareValue(input.getShareValue())
                            .build());
                }
            }
            case SHARES -> {
                BigDecimal totalShares = splitInputs.stream()
                        .map(CreateExpenseRequest.SplitInput::getShareValue)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                if (totalShares.compareTo(BigDecimal.ZERO) <= 0) {
                    throw new BadRequestException("Total shares must be positive");
                }
                for (CreateExpenseRequest.SplitInput input : splitInputs) {
                    User user = userRepository.findById(input.getUserId()).orElseThrow();
                    BigDecimal amount = totalAmount.multiply(input.getShareValue())
                            .divide(totalShares, 2, RoundingMode.HALF_UP);
                    result.add(ExpenseSplit.builder()
                            .expense(expense).user(user)
                            .amount(amount).shareValue(input.getShareValue())
                            .build());
                }
            }
        }
        return result;
    }

    private ExpenseDTO mapToDTO(Expense e, List<ExpenseSplit> splits) {
        return ExpenseDTO.builder()
                .id(e.getId())
                .tripId(e.getTrip().getId())
                .title(e.getTitle())
                .amount(e.getAmount())
                .currency(e.getCurrency())
                .category(e.getCategory())
                .splitType(e.getSplitType())
                .paidById(e.getPaidBy().getId())
                .paidByName(e.getPaidBy().getFullName())
                .receiptUrl(e.getReceiptUrl())
                .date(e.getDate())
                .notes(e.getNotes())
                .activityId(e.getActivity() != null ? e.getActivity().getId() : null)
                .splits(splits.stream().map(s -> ExpenseDTO.ExpenseSplitDTO.builder()
                        .userId(s.getUser().getId())
                        .userName(s.getUser().getFullName())
                        .amount(s.getAmount())
                        .shareValue(s.getShareValue())
                        .build()).collect(Collectors.toList()))
                .build();
    }
}
