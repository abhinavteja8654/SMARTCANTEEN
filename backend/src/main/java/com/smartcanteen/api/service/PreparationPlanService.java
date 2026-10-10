package com.smartcanteen.api.service;

import com.smartcanteen.api.dto.DailyPlanUpdateRequest;
import com.smartcanteen.api.entity.DailyPreparationPlan;
import com.smartcanteen.api.entity.FoodItem;
import com.smartcanteen.api.entity.WasteLog;
import com.smartcanteen.api.repository.DailyPreparationPlanRepository;
import com.smartcanteen.api.repository.FoodItemRepository;
import com.smartcanteen.api.repository.WasteLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PreparationPlanService {

    private final DailyPreparationPlanRepository planRepository;
    private final FoodItemRepository foodItemRepository;
    private final InventoryService inventoryService;
    private final WasteLogRepository wasteLogRepository;

    public PreparationPlanService(
            DailyPreparationPlanRepository planRepository,
            FoodItemRepository foodItemRepository,
            InventoryService inventoryService,
            WasteLogRepository wasteLogRepository) {
        this.planRepository = planRepository;
        this.foodItemRepository = foodItemRepository;
        this.inventoryService = inventoryService;
        this.wasteLogRepository = wasteLogRepository;
    }

    public List<DailyPreparationPlan> getPlansForDate(LocalDate date) {
        return planRepository.findByPlanDate(date);
    }

    public DailyPreparationPlan createOrGetPlan(LocalDate date, String mealType, Long foodItemId, Integer predictedQuantity) {
        Optional<DailyPreparationPlan> existing = planRepository.findByPlanDateAndMealTypeAndFoodItemId(date, mealType, foodItemId);
        if (existing.isPresent()) {
            return existing.get();
        }

        FoodItem item = foodItemRepository.findById(foodItemId)
                .orElseThrow(() -> new RuntimeException("Food item not found: " + foodItemId));

        DailyPreparationPlan plan = new DailyPreparationPlan();
        plan.setPlanDate(date);
        plan.setMealType(mealType);
        plan.setFoodItem(item);
        plan.setPredictedQuantity(predictedQuantity);
        plan.setActualPreparedQuantity(predictedQuantity); // default proposed
        plan.setStatus("PLANNED");

        return planRepository.save(plan);
    }

    @Transactional
    public DailyPreparationPlan updatePlan(Long planId, DailyPlanUpdateRequest update, String staffEmail) {
        DailyPreparationPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Preparation plan not found: " + planId));

        if (update.getActualPreparedQuantity() != null) {
            int oldPrep = plan.getActualPreparedQuantity() != null ? plan.getActualPreparedQuantity() : 0;
            plan.setActualPreparedQuantity(update.getActualPreparedQuantity());

            // Deduct recipe ingredients if this is being prepped
            if ("IN_PREPARATION".equalsIgnoreCase(update.getStatus()) || "COMPLETED".equalsIgnoreCase(update.getStatus())) {
                int delta = update.getActualPreparedQuantity() - oldPrep;
                if (delta > 0) {
                    inventoryService.deductIngredientsForPreparation(plan.getFoodItem(), delta);
                }
            }
        }

        if (update.getActualSoldQuantity() != null) {
            plan.setActualSoldQuantity(update.getActualSoldQuantity());
        }

        if (update.getLeftoverQuantity() != null) {
            plan.setLeftoverQuantity(update.getLeftoverQuantity());
            // Automatically log to waste_logs if leftover > 0 when plan is completed
            if (update.getLeftoverQuantity() > 0 && "COMPLETED".equalsIgnoreCase(update.getStatus())) {
                BigDecimal costPerPlate = plan.getFoodItem().getPrepCostPerPlate() != null
                        ? plan.getFoodItem().getPrepCostPerPlate()
                        : BigDecimal.valueOf(35.00);
                BigDecimal totalLost = costPerPlate.multiply(BigDecimal.valueOf(update.getLeftoverQuantity()));

                WasteLog waste = new WasteLog(
                        plan.getFoodItem(),
                        plan.getPlanDate(),
                        update.getLeftoverQuantity(),
                        "OVER_PREPARATION",
                        totalLost,
                        staffEmail != null ? staffEmail : "Kitchen Staff"
                );
                wasteLogRepository.save(waste);
            }
        }

        if (update.getStatus() != null) {
            plan.setStatus(update.getStatus());
        }

        if (update.getChefNotes() != null) {
            plan.setChefNotes(update.getChefNotes());
        }

        return planRepository.save(plan);
    }
}
