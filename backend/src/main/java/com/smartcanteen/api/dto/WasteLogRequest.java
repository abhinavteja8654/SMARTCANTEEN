package com.smartcanteen.api.dto;

import java.time.LocalDate;

public class WasteLogRequest {
    private Long foodItemId;
    private LocalDate wasteDate;
    private Integer wastedPortions;
    private String wasteReason;

    public WasteLogRequest() {}

    public Long getFoodItemId() { return foodItemId; }
    public void setFoodItemId(Long foodItemId) { this.foodItemId = foodItemId; }

    public LocalDate getWasteDate() { return wasteDate; }
    public void setWasteDate(LocalDate wasteDate) { this.wasteDate = wasteDate; }

    public Integer getWastedPortions() { return wastedPortions; }
    public void setWastedPortions(Integer wastedPortions) { this.wastedPortions = wastedPortions; }

    public String getWasteReason() { return wasteReason; }
    public void setWasteReason(String wasteReason) { this.wasteReason = wasteReason; }
}
