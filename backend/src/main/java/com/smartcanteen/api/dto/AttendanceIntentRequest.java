package com.smartcanteen.api.dto;

import java.time.LocalDate;

public class AttendanceIntentRequest {
    private LocalDate targetDate;
    private String mealType;
    private boolean willAttend;
    private String dietaryPreference;

    public AttendanceIntentRequest() {}

    public LocalDate getTargetDate() { return targetDate; }
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }

    public String getMealType() { return mealType; }
    public void setMealType(String mealType) { this.mealType = mealType; }

    public boolean isWillAttend() { return willAttend; }
    public void setWillAttend(boolean willAttend) { this.willAttend = willAttend; }

    public String getDietaryPreference() { return dietaryPreference; }
    public void setDietaryPreference(String dietaryPreference) { this.dietaryPreference = dietaryPreference; }
}
