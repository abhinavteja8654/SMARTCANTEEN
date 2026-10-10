package com.smartcanteen.api.repository;

import com.smartcanteen.api.entity.MealAttendanceIntent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MealAttendanceIntentRepository extends JpaRepository<MealAttendanceIntent, Long> {
    List<MealAttendanceIntent> findByTargetDate(LocalDate targetDate);
    Optional<MealAttendanceIntent> findByUserIdAndTargetDateAndMealType(Long userId, LocalDate targetDate, String mealType);

    @Query("SELECT COUNT(m) FROM MealAttendanceIntent m WHERE m.targetDate = :targetDate AND m.mealType = :mealType AND m.willAttend = true")
    Integer countAttendingStudents(@Param("targetDate") LocalDate targetDate, @Param("mealType") String mealType);
}
