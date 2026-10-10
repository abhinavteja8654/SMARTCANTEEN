package com.smartcanteen.api.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {
    private long totalPreOrdersToday;
    private long totalAttendingStudentsToday;
    private int totalDishesPlannedToday;
    private int totalWastedPortionsMonth;
    private BigDecimal totalCostLostMonth;
    private double wasteReductionRatePercentage;
    private int lowStockInventoryCount;
    private List<Map<String, Object>> weeklyDemandVsWaste;

    public DashboardStatsResponse() {}

    public long getTotalPreOrdersToday() { return totalPreOrdersToday; }
    public void setTotalPreOrdersToday(long totalPreOrdersToday) { this.totalPreOrdersToday = totalPreOrdersToday; }

    public long getTotalAttendingStudentsToday() { return totalAttendingStudentsToday; }
    public void setTotalAttendingStudentsToday(long totalAttendingStudentsToday) { this.totalAttendingStudentsToday = totalAttendingStudentsToday; }

    public int getTotalDishesPlannedToday() { return totalDishesPlannedToday; }
    public void setTotalDishesPlannedToday(int totalDishesPlannedToday) { this.totalDishesPlannedToday = totalDishesPlannedToday; }

    public int getTotalWastedPortionsMonth() { return totalWastedPortionsMonth; }
    public void setTotalWastedPortionsMonth(int totalWastedPortionsMonth) { this.totalWastedPortionsMonth = totalWastedPortionsMonth; }

    public BigDecimal getTotalCostLostMonth() { return totalCostLostMonth; }
    public void setTotalCostLostMonth(BigDecimal totalCostLostMonth) { this.totalCostLostMonth = totalCostLostMonth; }

    public double getWasteReductionRatePercentage() { return wasteReductionRatePercentage; }
    public void setWasteReductionRatePercentage(double wasteReductionRatePercentage) { this.wasteReductionRatePercentage = wasteReductionRatePercentage; }

    public int getLowStockInventoryCount() { return lowStockInventoryCount; }
    public void setLowStockInventoryCount(int lowStockInventoryCount) { this.lowStockInventoryCount = lowStockInventoryCount; }

    public List<Map<String, Object>> getWeeklyDemandVsWaste() { return weeklyDemandVsWaste; }
    public void setWeeklyDemandVsWaste(List<Map<String, Object>> weeklyDemandVsWaste) { this.weeklyDemandVsWaste = weeklyDemandVsWaste; }
}
