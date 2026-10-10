package com.smartcanteen.api.controller;

import com.smartcanteen.api.dto.DailyPlanUpdateRequest;
import com.smartcanteen.api.entity.DailyPreparationPlan;
import com.smartcanteen.api.service.PreparationPlanService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/prep-plans")
public class PreparationPlanController {

    private final PreparationPlanService preparationPlanService;

    public PreparationPlanController(PreparationPlanService preparationPlanService) {
        this.preparationPlanService = preparationPlanService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<DailyPreparationPlan>> getPlansForDate(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate target = date != null ? date : LocalDate.now();
        return ResponseEntity.ok(preparationPlanService.getPlansForDate(target));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<DailyPreparationPlan> createPlan(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam String mealType,
            @RequestParam Long foodItemId,
            @RequestParam Integer predictedQuantity) {
        LocalDate target = date != null ? date : LocalDate.now();
        return ResponseEntity.ok(preparationPlanService.createOrGetPlan(target, mealType, foodItemId, predictedQuantity));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<DailyPreparationPlan> updatePlan(
            @PathVariable Long id,
            @RequestBody DailyPlanUpdateRequest request,
            Authentication authentication) {
        String staffEmail = authentication != null ? authentication.getName() : "Staff";
        return ResponseEntity.ok(preparationPlanService.updatePlan(id, request, staffEmail));
    }
}
