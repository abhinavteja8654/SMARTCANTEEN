package com.smartcanteen.api.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "inventory_items")
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private Double currentStock;

    @Column(nullable = false)
    private Double minThresholdStock;

    @Column(nullable = false)
    private String unit; // KG, LITER, PACK, PIECE, GRAM

    private BigDecimal costPerUnit;

    private LocalDate lastRestockedDate = LocalDate.now();

    public InventoryItem() {}

    public InventoryItem(String name, Double currentStock, Double minThresholdStock, String unit, BigDecimal costPerUnit) {
        this.name = name;
        this.currentStock = currentStock;
        this.minThresholdStock = minThresholdStock;
        this.unit = unit;
        this.costPerUnit = costPerUnit;
        this.lastRestockedDate = LocalDate.now();
    }

    public boolean isLowStock() {
        return currentStock != null && minThresholdStock != null && currentStock <= minThresholdStock;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getCurrentStock() { return currentStock; }
    public void setCurrentStock(Double currentStock) { this.currentStock = currentStock; }

    public Double getMinThresholdStock() { return minThresholdStock; }
    public void setMinThresholdStock(Double minThresholdStock) { this.minThresholdStock = minThresholdStock; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public BigDecimal getCostPerUnit() { return costPerUnit; }
    public void setCostPerUnit(BigDecimal costPerUnit) { this.costPerUnit = costPerUnit; }

    public LocalDate getLastRestockedDate() { return lastRestockedDate; }
    public void setLastRestockedDate(LocalDate lastRestockedDate) { this.lastRestockedDate = lastRestockedDate; }
}
