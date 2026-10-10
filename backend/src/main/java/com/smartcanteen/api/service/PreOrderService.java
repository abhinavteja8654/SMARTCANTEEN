package com.smartcanteen.api.service;

import com.smartcanteen.api.dto.PreOrderRequest;
import com.smartcanteen.api.entity.FoodItem;
import com.smartcanteen.api.entity.MealPreOrder;
import com.smartcanteen.api.entity.User;
import com.smartcanteen.api.repository.FoodItemRepository;
import com.smartcanteen.api.repository.MealPreOrderRepository;
import com.smartcanteen.api.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class PreOrderService {

    private final MealPreOrderRepository preOrderRepository;
    private final FoodItemRepository foodItemRepository;
    private final UserRepository userRepository;

    public PreOrderService(MealPreOrderRepository preOrderRepository, FoodItemRepository foodItemRepository, UserRepository userRepository) {
        this.preOrderRepository = preOrderRepository;
        this.foodItemRepository = foodItemRepository;
        this.userRepository = userRepository;
    }

    public MealPreOrder createPreOrder(PreOrderRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        FoodItem item = foodItemRepository.findById(request.getFoodItemId())
                .orElseThrow(() -> new RuntimeException("Food item not found: " + request.getFoodItemId()));

        int qty = (request.getQuantity() != null && request.getQuantity() > 0) ? request.getQuantity() : 1;
        BigDecimal total = item.getPrice().multiply(BigDecimal.valueOf(qty));
        LocalDate date = request.getMealDate() != null ? request.getMealDate() : LocalDate.now().plusDays(1);
        String mealType = request.getMealType() != null ? request.getMealType().toUpperCase() : item.getCategory();

        MealPreOrder preOrder = new MealPreOrder(user, item, qty, date, mealType, total);
        return preOrderRepository.save(preOrder);
    }

    public List<MealPreOrder> getUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));
        return preOrderRepository.findByUserId(user.getId());
    }

    public List<MealPreOrder> getOrdersForDate(LocalDate date) {
        return preOrderRepository.findByMealDate(date);
    }

    public MealPreOrder updateStatus(Long orderId, String newStatus) {
        MealPreOrder order = preOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        order.setStatus(newStatus.toUpperCase());
        return preOrderRepository.save(order);
    }
}
