package com.smartcanteen.api.repository;

import com.smartcanteen.api.entity.MealPreOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MealPreOrderRepository extends JpaRepository<MealPreOrder, Long> {
    List<MealPreOrder> findByUserId(Long userId);
    List<MealPreOrder> findByMealDate(LocalDate mealDate);
    List<MealPreOrder> findByMealDateAndMealType(LocalDate mealDate, String mealType);

    @Query("SELECT COALESCE(SUM(m.quantity), 0) FROM MealPreOrder m WHERE m.foodItem.id = :foodItemId AND m.mealDate = :mealDate AND m.status != 'CANCELLED'")
    Integer countPreOrderedQuantity(@Param("foodItemId") Long foodItemId, @Param("mealDate") LocalDate mealDate);

    @Query("SELECT COUNT(m) FROM MealPreOrder m WHERE m.mealDate = :mealDate AND m.status != 'CANCELLED'")
    Long countTotalPreOrdersForDate(@Param("mealDate") LocalDate mealDate);
}
