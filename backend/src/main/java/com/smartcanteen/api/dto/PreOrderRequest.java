package com.smartcanteen.api.dto;

import java.time.LocalDate;

public class PreOrderRequest {
    private Long foodItemId;
    private Integer quantity;
    private LocalDate mealDate;
    private String mealType;

    public PreOrderRequest() {}

    public Long getFoodItemId() { return foodItemId; }
    public void setFoodItemId(Long foodItemId) { this.foodItemId = foodItemId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public LocalDate getMealDate() { return mealDate; }
    public void setMealDate(LocalDate mealDate) { this.mealDate = mealDate; }

    public String getMealType() { return mealType; }
    public void setMealType(String mealType) { this.mealType = mealType; }
}
