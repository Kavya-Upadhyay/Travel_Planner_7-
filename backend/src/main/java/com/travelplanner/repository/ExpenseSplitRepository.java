package com.travelplanner.repository;

import com.travelplanner.model.entity.ExpenseSplit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExpenseSplitRepository extends JpaRepository<ExpenseSplit, UUID> {
    List<ExpenseSplit> findByExpenseId(UUID expenseId);

    @Query("SELECT es FROM ExpenseSplit es WHERE es.expense.trip.id = :tripId")
    List<ExpenseSplit> findAllByTripId(@Param("tripId") UUID tripId);
}
