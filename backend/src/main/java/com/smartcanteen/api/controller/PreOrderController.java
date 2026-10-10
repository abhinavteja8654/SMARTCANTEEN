package com.smartcanteen.api.controller;

import com.smartcanteen.api.dto.PreOrderRequest;
import com.smartcanteen.api.entity.MealPreOrder;
import com.smartcanteen.api.service.PreOrderService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/preorders")
public class PreOrderController {

    private final PreOrderService preOrderService;

    public PreOrderController(PreOrderService preOrderService) {
        this.preOrderService = preOrderService;
    }

    @PostMapping
    public ResponseEntity<MealPreOrder> createPreOrder(
            @RequestBody PreOrderRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(preOrderService.createPreOrder(request, authentication.getName()));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<MealPreOrder>> getMyOrders(Authentication authentication) {
        return ResponseEntity.ok(preOrderService.getUserOrders(authentication.getName()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<MealPreOrder>> getOrdersForDate(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate target = date != null ? date : LocalDate.now();
        return ResponseEntity.ok(preOrderService.getOrdersForDate(target));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<MealPreOrder> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(preOrderService.updateStatus(id, status));
    }
}
