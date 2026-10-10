package com.smartcanteen.api.repository;

import com.smartcanteen.api.entity.DailyPreparationPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyPreparationPlanRepository extends JpaRepository<DailyPreparationPlan, Long> {
    List<DailyPreparationPlan> findByPlanDate(LocalDate planDate);
    List<DailyPreparationPlan> findByPlanDateAndMealType(LocalDate planDate, String mealType);
    Optional<DailyPreparationPlan> findByPlanDateAndMealTypeAndFoodItemId(LocalDate planDate, String mealType, Long foodItemId);

    @Query("SELECT AVG(d.actualSoldQuantity) FROM DailyPreparationPlan d WHERE d.foodItem.id = :foodItemId AND d.actualSoldQuantity > 0")
    Double findHistoricalAverageSold(@Param("foodItemId") Long foodItemId);

    @Query("SELECT d FROM DailyPreparationPlan d WHERE d.planDate >= :sinceDate ORDER BY d.planDate DESC")
    List<DailyPreparationPlan> findRecentPlans(@Param("sinceDate") LocalDate sinceDate);
}
