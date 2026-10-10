package com.smartcanteen.api.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "waste_logs")
public class WasteLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "food_item_id", nullable = false)
    private FoodItem foodItem;

    @Column(nullable = false)
    private LocalDate wasteDate;

    @Column(nullable = false)
    private Integer wastedPortions;

    @Column(nullable = false)
    private String wasteReason; // OVER_PREPARATION, EXPIRED, SPOILED, UNCOLLECTED_PREORDER

    private BigDecimal estimatedCostLost;

    private String loggedBy;

    private LocalDateTime createdAt = LocalDateTime.now();

    public WasteLog() {}

    public WasteLog(FoodItem foodItem, LocalDate wasteDate, Integer wastedPortions, String wasteReason, BigDecimal estimatedCostLost, String loggedBy) {
        this.foodItem = foodItem;
        this.wasteDate = wasteDate;
        this.wastedPortions = wastedPortions;
        this.wasteReason = wasteReason;
        this.estimatedCostLost = estimatedCostLost;
        this.loggedBy = loggedBy;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public FoodItem getFoodItem() { return foodItem; }
    public void setFoodItem(FoodItem foodItem) { this.foodItem = foodItem; }

    public LocalDate getWasteDate() { return wasteDate; }
    public void setWasteDate(LocalDate wasteDate) { this.wasteDate = wasteDate; }

    public Integer getWastedPortions() { return wastedPortions; }
    public void setWastedPortions(Integer wastedPortions) { this.wastedPortions = wastedPortions; }

    public String getWasteReason() { return wasteReason; }
    public void setWasteReason(String wasteReason) { this.wasteReason = wasteReason; }

    public BigDecimal getEstimatedCostLost() { return estimatedCostLost; }
    public void setEstimatedCostLost(BigDecimal estimatedCostLost) { this.estimatedCostLost = estimatedCostLost; }

    public String getLoggedBy() { return loggedBy; }
    public void setLoggedBy(String loggedBy) { this.loggedBy = loggedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
