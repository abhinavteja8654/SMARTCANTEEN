package com.smartcanteen.api.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "recipe_ingredients")
public class RecipeIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_item_id", nullable = false)
    private FoodItem foodItem;

    @Column(nullable = false)
    private String ingredientName;

    @Column(nullable = false)
    private Double quantityPerPlate;

    @Column(nullable = false)
    private String unit; // KG, GRAM, LITER, ML, PIECE

    public RecipeIngredient() {}

    public RecipeIngredient(FoodItem foodItem, String ingredientName, Double quantityPerPlate, String unit) {
        this.foodItem = foodItem;
        this.ingredientName = ingredientName;
        this.quantityPerPlate = quantityPerPlate;
        this.unit = unit;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public FoodItem getFoodItem() { return foodItem; }
    public void setFoodItem(FoodItem foodItem) { this.foodItem = foodItem; }

    public String getIngredientName() { return ingredientName; }
    public void setIngredientName(String ingredientName) { this.ingredientName = ingredientName; }

    public Double getQuantityPerPlate() { return quantityPerPlate; }
    public void setQuantityPerPlate(Double quantityPerPlate) { this.quantityPerPlate = quantityPerPlate; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
}
