package com.smartcanteen.api.config;

import com.smartcanteen.api.entity.*;
import com.smartcanteen.api.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final FoodItemRepository foodItemRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;
    private final DailyPreparationPlanRepository planRepository;
    private final MealPreOrderRepository preOrderRepository;
    private final MealAttendanceIntentRepository intentRepository;
    private final WasteLogRepository wasteLogRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            FoodItemRepository foodItemRepository,
            InventoryItemRepository inventoryItemRepository,
            RecipeIngredientRepository recipeIngredientRepository,
            DailyPreparationPlanRepository planRepository,
            MealPreOrderRepository preOrderRepository,
            MealAttendanceIntentRepository intentRepository,
            WasteLogRepository wasteLogRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.foodItemRepository = foodItemRepository;
        this.inventoryItemRepository = inventoryItemRepository;
        this.recipeIngredientRepository = recipeIngredientRepository;
        this.planRepository = planRepository;
        this.preOrderRepository = preOrderRepository;
        this.intentRepository = intentRepository;
        this.wasteLogRepository = wasteLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedInventory();
        seedFoodItemsAndRecipes();
        seedSampleOrdersAndPlans();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            User admin = new User("Canteen Administrator", "admin@smartcanteen.com", passwordEncoder.encode("Admin@123"), Role.ADMIN, "9876543210", "ADM-001");
            User chef = new User("Head Chef Ramesh", "chef@smartcanteen.com", passwordEncoder.encode("Staff@123"), Role.STAFF, "9876543211", "STF-001");
            User student = new User("Aarav Sharma", "student@smartcanteen.com", passwordEncoder.encode("Student@123"), Role.STUDENT, "9876543212", "STU-2024-88");

            userRepository.saveAll(List.of(admin, chef, student));
        }
    }

    private void seedInventory() {
        if (inventoryItemRepository.count() == 0) {
            inventoryItemRepository.saveAll(List.of(
                    new InventoryItem("Basmati Rice", 120.0, 30.0, "KG", BigDecimal.valueOf(65.0)),
                    new InventoryItem("Fresh Chicken", 45.0, 15.0, "KG", BigDecimal.valueOf(190.0)),
                    new InventoryItem("Paneer (Cottage Cheese)", 25.0, 10.0, "KG", BigDecimal.valueOf(320.0)),
                    new InventoryItem("Toor Dal / Lentils", 50.0, 15.0, "KG", BigDecimal.valueOf(140.0)),
                    new InventoryItem("Fresh Onions", 80.0, 20.0, "KG", BigDecimal.valueOf(35.0)),
                    new InventoryItem("Fresh Tomatoes", 60.0, 20.0, "KG", BigDecimal.valueOf(40.0)),
                    new InventoryItem("Sunflower Cooking Oil", 70.0, 25.0, "LITER", BigDecimal.valueOf(130.0)),
                    new InventoryItem("Assorted Spices Mix", 12.0, 5.0, "KG", BigDecimal.valueOf(450.0)),
                    new InventoryItem("Fresh Milk", 40.0, 15.0, "LITER", BigDecimal.valueOf(60.0)),
                    new InventoryItem("South Indian Filter Coffee Powder", 8.0, 3.0, "KG", BigDecimal.valueOf(500.0))
            ));
        }
    }

    private void seedFoodItemsAndRecipes() {
        if (foodItemRepository.count() == 0) {
            FoodItem biryani = new FoodItem(
                    "Hyderabadi Chicken Biryani", "LUNCH", BigDecimal.valueOf(150.0), 650,
                    "Aromatic basmati rice cooked with marinated chicken pieces and whole spices.",
                    BigDecimal.valueOf(65.0),
                    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500"
            );
            FoodItem paneerButter = new FoodItem(
                    "Paneer Butter Masala with Naan", "LUNCH", BigDecimal.valueOf(130.0), 520,
                    "Rich creamy tomato and cashew curry with soft paneer cubes, served with 2 butter naans.",
                    BigDecimal.valueOf(50.0),
                    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500"
            );
            FoodItem masalaDosa = new FoodItem(
                    "Mysore Masala Dosa", "BREAKFAST", BigDecimal.valueOf(70.0), 380,
                    "Crispy golden crepe filled with spiced potato filling, served with coconut chutney & sambar.",
                    BigDecimal.valueOf(22.0),
                    "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500"
            );
            FoodItem vegFriedRice = new FoodItem(
                    "Vegetable Fried Rice & Manchurian", "DINNER", BigDecimal.valueOf(110.0), 480,
                    "Wok-tossed basmati rice with crunchy vegetables paired with spicy veg manchurian gravy.",
                    BigDecimal.valueOf(40.0),
                    "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500"
            );
            FoodItem samosa = new FoodItem(
                    "Crispy Punjabi Samosa (2 pcs)", "SNACKS", BigDecimal.valueOf(40.0), 310,
                    "Golden fried pastry filled with spiced potatoes, green peas and served with mint chutney.",
                    BigDecimal.valueOf(14.0),
                    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500"
            );
            FoodItem filterCoffee = new FoodItem(
                    "South Indian Filter Coffee", "BREAKFAST", BigDecimal.valueOf(25.0), 95,
                    "Freshly brewed chicory blend filter coffee with frothy whole milk.",
                    BigDecimal.valueOf(9.0),
                    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500"
            );

            foodItemRepository.saveAll(List.of(biryani, paneerButter, masalaDosa, vegFriedRice, samosa, filterCoffee));

            // Link recipes
            recipeIngredientRepository.saveAll(List.of(
                    new RecipeIngredient(biryani, "Basmati Rice", 0.15, "KG"),
                    new RecipeIngredient(biryani, "Fresh Chicken", 0.18, "KG"),
                    new RecipeIngredient(biryani, "Fresh Onions", 0.08, "KG"),
                    new RecipeIngredient(biryani, "Sunflower Cooking Oil", 0.03, "LITER"),

                    new RecipeIngredient(paneerButter, "Paneer (Cottage Cheese)", 0.12, "KG"),
                    new RecipeIngredient(paneerButter, "Fresh Tomatoes", 0.10, "KG"),
                    new RecipeIngredient(paneerButter, "Sunflower Cooking Oil", 0.02, "LITER"),

                    new RecipeIngredient(filterCoffee, "Fresh Milk", 0.15, "LITER"),
                    new RecipeIngredient(filterCoffee, "South Indian Filter Coffee Powder", 0.02, "KG")
            ));
        }
    }

    private void seedSampleOrdersAndPlans() {
        if (preOrderRepository.count() == 0) {
            User student = userRepository.findByEmail("student@smartcanteen.com").orElse(null);
            List<FoodItem> items = foodItemRepository.findAll();
            if (student != null && !items.isEmpty()) {
                FoodItem biryani = items.get(0);
                MealPreOrder order1 = new MealPreOrder(student, biryani, 2, LocalDate.now(), "LUNCH", biryani.getPrice().multiply(BigDecimal.valueOf(2)));
                preOrderRepository.save(order1);

                MealAttendanceIntent intent = new MealAttendanceIntent(student, LocalDate.now(), "LUNCH", true, "NON_VEG");
                intentRepository.save(intent);

                // Initial plan
                DailyPreparationPlan planToday = new DailyPreparationPlan(LocalDate.now(), "LUNCH", biryani, 120, 120);
                planToday.setActualSoldQuantity(112);
                planToday.setLeftoverQuantity(8);
                planToday.setStatus("COMPLETED");
                planRepository.save(planToday);

                WasteLog waste = new WasteLog(biryani, LocalDate.now().minusDays(1), 6, "OVER_PREPARATION", BigDecimal.valueOf(390.0), "chef@smartcanteen.com");
                wasteLogRepository.save(waste);
            }
        }
    }
}
