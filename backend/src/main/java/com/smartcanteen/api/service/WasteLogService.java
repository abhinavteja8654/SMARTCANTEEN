package com.smartcanteen.api.service;

import com.smartcanteen.api.dto.WasteLogRequest;
import com.smartcanteen.api.entity.FoodItem;
import com.smartcanteen.api.entity.WasteLog;
import com.smartcanteen.api.repository.FoodItemRepository;
import com.smartcanteen.api.repository.WasteLogRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class WasteLogService {

    private final WasteLogRepository wasteLogRepository;
    private final FoodItemRepository foodItemRepository;

    public WasteLogService(WasteLogRepository wasteLogRepository, FoodItemRepository foodItemRepository) {
        this.wasteLogRepository = wasteLogRepository;
        this.foodItemRepository = foodItemRepository;
    }

    public WasteLog logWaste(WasteLogRequest request, String loggedBy) {
        FoodItem item = foodItemRepository.findById(request.getFoodItemId())
                .orElseThrow(() -> new RuntimeException("Food item not found: " + request.getFoodItemId()));

        LocalDate date = request.getWasteDate() != null ? request.getWasteDate() : LocalDate.now();
        int portions = request.getWastedPortions() != null ? request.getWastedPortions() : 1;
        BigDecimal costPerPlate = item.getPrepCostPerPlate() != null ? item.getPrepCostPerPlate() : BigDecimal.valueOf(35.00);
        BigDecimal totalCostLost = costPerPlate.multiply(BigDecimal.valueOf(portions));

        WasteLog wasteLog = new WasteLog(
                item,
                date,
                portions,
                request.getWasteReason() != null ? request.getWasteReason() : "OVER_PREPARATION",
                totalCostLost,
                loggedBy != null ? loggedBy : "Kitchen Staff"
        );

        return wasteLogRepository.save(wasteLog);
    }

    public List<WasteLog> getRecentWasteLogs() {
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        return wasteLogRepository.findByWasteDateBetween(thirtyDaysAgo, LocalDate.now());
    }

    public Integer getTotalWastedPortionsMonth() {
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        return wasteLogRepository.sumTotalWastedPortions(startOfMonth);
    }

    public BigDecimal getTotalCostLostMonth() {
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        return wasteLogRepository.sumTotalCostLost(startOfMonth);
    }
}
