package com.smartcanteen.api.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "demand_forecasts")
public class DemandForecast {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate forecastDate;

    @Column(nullable = false)
    private String mealType; // BREAKFAST, LUNCH, SNACKS, DINNER

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "food_item_id", nullable = false)
    private FoodItem foodItem;

    private Integer historicalAvgQuantity;
    private Double dayOfWeekFactor;
    private Double weatherFactor;
    private Integer confirmedPreOrders;
    private Integer attendanceIntentSignals;

    // AI final recommendation
    private Integer predictedQuantity;

    // Minimum safety buffer recommendation
    private Integer minBufferQuantity;
    // Maximum suggested cap to prevent waste
    private Integer maxCapQuantity;

    private Double confidenceScore; // e.g. 0.92 (92%)

    @Column(length = 1000)
    private String aiReasoning;

    private LocalDateTime generatedAt = LocalDateTime.now();

    public DemandForecast() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getForecastDate() { return forecastDate; }
    public void setForecastDate(LocalDate forecastDate) { this.forecastDate = forecastDate; }

    public String getMealType() { return mealType; }
    public void setMealType(String mealType) { this.mealType = mealType; }

    public FoodItem getFoodItem() { return foodItem; }
    public void setFoodItem(FoodItem foodItem) { this.foodItem = foodItem; }

    public Integer getHistoricalAvgQuantity() { return historicalAvgQuantity; }
    public void setHistoricalAvgQuantity(Integer historicalAvgQuantity) { this.historicalAvgQuantity = historicalAvgQuantity; }

    public Double getDayOfWeekFactor() { return dayOfWeekFactor; }
    public void setDayOfWeekFactor(Double dayOfWeekFactor) { this.dayOfWeekFactor = dayOfWeekFactor; }

    public Double getWeatherFactor() { return weatherFactor; }
    public void setWeatherFactor(Double weatherFactor) { this.weatherFactor = weatherFactor; }

    public Integer getConfirmedPreOrders() { return confirmedPreOrders; }
    public void setConfirmedPreOrders(Integer confirmedPreOrders) { this.confirmedPreOrders = confirmedPreOrders; }

    public Integer getAttendanceIntentSignals() { return attendanceIntentSignals; }
    public void setAttendanceIntentSignals(Integer attendanceIntentSignals) { this.attendanceIntentSignals = attendanceIntentSignals; }

    public Integer getPredictedQuantity() { return predictedQuantity; }
    public void setPredictedQuantity(Integer predictedQuantity) { this.predictedQuantity = predictedQuantity; }

    public Integer getMinBufferQuantity() { return minBufferQuantity; }
    public void setMinBufferQuantity(Integer minBufferQuantity) { this.minBufferQuantity = minBufferQuantity; }

    public Integer getMaxCapQuantity() { return maxCapQuantity; }
    public void setMaxCapQuantity(Integer maxCapQuantity) { this.maxCapQuantity = maxCapQuantity; }

    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }

    public String getAiReasoning() { return aiReasoning; }
    public void setAiReasoning(String aiReasoning) { this.aiReasoning = aiReasoning; }

    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
}
