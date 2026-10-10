package com.smartcanteen.api.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "food_items")
public class FoodItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category; // BREAKFAST, LUNCH, SNACKS, DINNER

    @Column(nullable = false)
    private BigDecimal price;

    private Integer calories;

    @Column(length = 1000)
    private String description;

    private boolean availableToday = true;

    private String imageUrl;

    // Standard preparation time in minutes
    private Integer prepTimeMinutes = 20;

    // Base cost to prepare one plate (used for wastage financial metrics)
    private BigDecimal prepCostPerPlate = BigDecimal.valueOf(35.00);

    public FoodItem() {}

    public FoodItem(String name, String category, BigDecimal price, Integer calories, String description, BigDecimal prepCostPerPlate, String imageUrl) {
        this.name = name;
        this.category = category;
        this.price = price;
        this.calories = calories;
        this.description = description;
        this.prepCostPerPlate = prepCostPerPlate;
        this.imageUrl = imageUrl;
        this.availableToday = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getCalories() { return calories; }
    public void setCalories(Integer calories) { this.calories = calories; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isAvailableToday() { return availableToday; }
    public void setAvailableToday(boolean availableToday) { this.availableToday = availableToday; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Integer getPrepTimeMinutes() { return prepTimeMinutes; }
    public void setPrepTimeMinutes(Integer prepTimeMinutes) { this.prepTimeMinutes = prepTimeMinutes; }

    public BigDecimal getPrepCostPerPlate() { return prepCostPerPlate; }
    public void setPrepCostPerPlate(BigDecimal prepCostPerPlate) { this.prepCostPerPlate = prepCostPerPlate; }
}
