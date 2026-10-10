package com.smartcanteen.api.dto;

import java.time.LocalDate;

public class ForecastRequest {
    private LocalDate forecastDate;
    private String mealType;
    private String weatherCondition; // CLEAR, RAIN, EXTREME_HEAT
    private String specialEvent;     // NORMAL_DAY, EXAM_WEEK, FESTIVAL, SPORTS_DAY

    public ForecastRequest() {}

    public LocalDate getForecastDate() { return forecastDate; }
    public void setForecastDate(LocalDate forecastDate) { this.forecastDate = forecastDate; }

    public String getMealType() { return mealType; }
    public void setMealType(String mealType) { this.mealType = mealType; }

    public String getWeatherCondition() { return weatherCondition; }
    public void setWeatherCondition(String weatherCondition) { this.weatherCondition = weatherCondition; }

    public String getSpecialEvent() { return specialEvent; }
    public void setSpecialEvent(String specialEvent) { this.specialEvent = specialEvent; }
}
