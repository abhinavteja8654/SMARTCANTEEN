package com.smartcanteen.api.dto;

public class DailyPlanUpdateRequest {
    private Integer actualPreparedQuantity;
    private Integer actualSoldQuantity;
    private Integer leftoverQuantity;
    private String status;
    private String chefNotes;

    public DailyPlanUpdateRequest() {}

    public Integer getActualPreparedQuantity() { return actualPreparedQuantity; }
    public void setActualPreparedQuantity(Integer actualPreparedQuantity) { this.actualPreparedQuantity = actualPreparedQuantity; }

    public Integer getActualSoldQuantity() { return actualSoldQuantity; }
    public void setActualSoldQuantity(Integer actualSoldQuantity) { this.actualSoldQuantity = actualSoldQuantity; }

    public Integer getLeftoverQuantity() { return leftoverQuantity; }
    public void setLeftoverQuantity(Integer leftoverQuantity) { this.leftoverQuantity = leftoverQuantity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getChefNotes() { return chefNotes; }
    public void setChefNotes(String chefNotes) { this.chefNotes = chefNotes; }
}
