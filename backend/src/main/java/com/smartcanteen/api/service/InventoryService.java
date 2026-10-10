package com.smartcanteen.api.service;

import com.smartcanteen.api.entity.FoodItem;
import com.smartcanteen.api.entity.InventoryItem;
import com.smartcanteen.api.entity.RecipeIngredient;
import com.smartcanteen.api.repository.InventoryItemRepository;
import com.smartcanteen.api.repository.RecipeIngredientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {

    private final InventoryItemRepository inventoryItemRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;

    public InventoryService(InventoryItemRepository inventoryItemRepository, RecipeIngredientRepository recipeIngredientRepository) {
        this.inventoryItemRepository = inventoryItemRepository;
        this.recipeIngredientRepository = recipeIngredientRepository;
    }

    public List<InventoryItem> getAllInventory() {
        return inventoryItemRepository.findAll();
    }

    public List<InventoryItem> getLowStockItems() {
        return inventoryItemRepository.findLowStockItems();
    }

    public InventoryItem saveOrUpdate(InventoryItem item) {
        if (item.getLastRestockedDate() == null) {
            item.setLastRestockedDate(LocalDate.now());
        }
        return inventoryItemRepository.save(item);
    }

    public void deleteItem(Long id) {
        inventoryItemRepository.deleteById(id);
    }

    @Transactional
    public void deductIngredientsForPreparation(FoodItem foodItem, int preparedQuantity) {
        List<RecipeIngredient> ingredients = recipeIngredientRepository.findByFoodItemId(foodItem.getId());
        for (RecipeIngredient recipeIng : ingredients) {
            double totalNeeded = recipeIng.getQuantityPerPlate() * preparedQuantity;
            Optional<InventoryItem> invOpt = inventoryItemRepository.findByNameIgnoreCase(recipeIng.getIngredientName());
            if (invOpt.isPresent()) {
                InventoryItem inventoryItem = invOpt.get();
                double remaining = Math.max(0.0, inventoryItem.getCurrentStock() - totalNeeded);
                inventoryItem.setCurrentStock(remaining);
                inventoryItemRepository.save(inventoryItem);
            }
        }
    }
}
