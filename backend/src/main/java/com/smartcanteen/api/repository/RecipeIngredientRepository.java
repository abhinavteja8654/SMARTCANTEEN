package com.smartcanteen.api.repository;

import com.smartcanteen.api.entity.FoodItem;
import com.smartcanteen.api.entity.RecipeIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeIngredientRepository extends JpaRepository<RecipeIngredient, Long> {
    List<RecipeIngredient> findByFoodItem(FoodItem foodItem);
    List<RecipeIngredient> findByFoodItemId(Long foodItemId);
}
