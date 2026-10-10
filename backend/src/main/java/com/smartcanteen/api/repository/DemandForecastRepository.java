package com.smartcanteen.api.repository;

import com.smartcanteen.api.entity.DemandForecast;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DemandForecastRepository extends JpaRepository<DemandForecast, Long> {
    List<DemandForecast> findByForecastDate(LocalDate forecastDate);
    List<DemandForecast> findByForecastDateAndMealType(LocalDate forecastDate, String mealType);
    Optional<DemandForecast> findByForecastDateAndMealTypeAndFoodItemId(LocalDate forecastDate, String mealType, Long foodItemId);
}
