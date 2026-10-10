package com.smartcanteen.api.controller;

import com.smartcanteen.api.entity.FoodItem;
import com.smartcanteen.api.repository.FoodItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/food-items")
public class FoodItemController {

    private final FoodItemRepository foodItemRepository;

    public FoodItemController(FoodItemRepository foodItemRepository) {
        this.foodItemRepository = foodItemRepository;
    }

    @GetMapping
    public ResponseEntity<List<FoodItem>> getAllFoodItems() {
        return ResponseEntity.ok(foodItemRepository.findAll());
    }

    @GetMapping("/available")
    public ResponseEntity<List<FoodItem>> getAvailableFoodItems() {
        return ResponseEntity.ok(foodItemRepository.findByAvailableToday(true));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<FoodItem> createFoodItem(@RequestBody FoodItem foodItem) {
        return ResponseEntity.ok(foodItemRepository.save(foodItem));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<FoodItem> updateFoodItem(@PathVariable Long id, @RequestBody FoodItem updated) {
        FoodItem item = foodItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found: " + id));

        item.setName(updated.getName());
        item.setCategory(updated.getCategory());
        item.setPrice(updated.getPrice());
        item.setCalories(updated.getCalories());
        item.setDescription(updated.getDescription());
        item.setImageUrl(updated.getImageUrl());
        item.setAvailableToday(updated.isAvailableToday());
        item.setPrepCostPerPlate(updated.getPrepCostPerPlate());

        return ResponseEntity.ok(foodItemRepository.save(item));
    }

    @PatchMapping("/{id}/toggle-availability")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<FoodItem> toggleAvailability(@PathVariable Long id) {
        FoodItem item = foodItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found: " + id));
        item.setAvailableToday(!item.isAvailableToday());
        return ResponseEntity.ok(foodItemRepository.save(item));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteFoodItem(@PathVariable Long id) {
        foodItemRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
