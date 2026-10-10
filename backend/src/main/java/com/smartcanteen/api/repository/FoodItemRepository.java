package com.smartcanteen.api.repository;

import com.smartcanteen.api.entity.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {
    List<FoodItem> findByAvailableToday(boolean availableToday);
    List<FoodItem> findByCategory(String category);
    List<FoodItem> findByCategoryAndAvailableToday(String category, boolean availableToday);
}
