package com.smartcanteen.api.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "daily_prep_plans")
public class DailyPreparationPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate planDate;

    @Column(nullable = false)
    private String mealType; // BREAKFAST, LUNCH, SNACKS, DINNER

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "food_item_id", nullable = false)
    private FoodItem foodItem;

    // Predicted by AI
    private Integer predictedQuantity;

    // Actual quantity approved/cooked by Kitchen Head
    private Integer actualPreparedQuantity;

    // Actual portions served/sold to patrons
    private Integer actualSoldQuantity = 0;

    // Leftovers at the end of the shift
    private Integer leftoverQuantity = 0;

    private String status = "PLANNED"; // PLANNED, IN_PREPARATION, COMPLETED

    private String weatherCondition = "CLEAR"; // CLEAR, RAIN, EXTREME_HEAT, EVENT_DAY

    @Column(length = 500)
    private String chefNotes;

    public DailyPreparationPlan() {}

    public DailyPreparationPlan(LocalDate planDate, String mealType, FoodItem foodItem, Integer predictedQuantity, Integer actualPreparedQuantity) {
        this.planDate = planDate;
        this.mealType = mealType;
        this.foodItem = foodItem;
        this.predictedQuantity = predictedQuantity;
        this.actualPreparedQuantity = actualPreparedQuantity;
        this.status = "PLANNED";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getPlanDate() { return planDate; }
    public void setPlanDate(LocalDate planDate) { this.planDate = planDate; }

    public String getMealType() { return mealType; }
    public void setMealType(String mealType) { this.mealType = mealType; }

    public FoodItem getFoodItem() { return foodItem; }
    public void setFoodItem(FoodItem foodItem) { this.foodItem = foodItem; }

    public Integer getPredictedQuantity() { return predictedQuantity; }
    public void setPredictedQuantity(Integer predictedQuantity) { this.predictedQuantity = predictedQuantity; }

    public Integer getActualPreparedQuantity() { return actualPreparedQuantity; }
    public void setActualPreparedQuantity(Integer actualPreparedQuantity) { this.actualPreparedQuantity = actualPreparedQuantity; }

    public Integer getActualSoldQuantity() { return actualSoldQuantity; }
    public void setActualSoldQuantity(Integer actualSoldQuantity) { this.actualSoldQuantity = actualSoldQuantity; }

    public Integer getLeftoverQuantity() { return leftoverQuantity; }
    public void setLeftoverQuantity(Integer leftoverQuantity) { this.leftoverQuantity = leftoverQuantity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getWeatherCondition() { return weatherCondition; }
    public void setWeatherCondition(String weatherCondition) { this.weatherCondition = weatherCondition; }

    public String getChefNotes() { return chefNotes; }
    public void setChefNotes(String chefNotes) { this.chefNotes = chefNotes; }
}
