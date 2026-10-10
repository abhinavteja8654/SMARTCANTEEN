package com.smartcanteen.api.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "meal_attendance_intents")
public class MealAttendanceIntent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate targetDate;

    @Column(nullable = false)
    private String mealType; // BREAKFAST, LUNCH, SNACKS, DINNER

    @Column(nullable = false)
    private boolean willAttend = true;

    private String dietaryPreference; // VEG, NON_VEG, ANY

    private LocalDateTime submittedAt = LocalDateTime.now();

    public MealAttendanceIntent() {}

    public MealAttendanceIntent(User user, LocalDate targetDate, String mealType, boolean willAttend, String dietaryPreference) {
        this.user = user;
        this.targetDate = targetDate;
        this.mealType = mealType;
        this.willAttend = willAttend;
        this.dietaryPreference = dietaryPreference;
        this.submittedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDate getTargetDate() { return targetDate; }
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }

    public String getMealType() { return mealType; }
    public void setMealType(String mealType) { this.mealType = mealType; }

    public boolean isWillAttend() { return willAttend; }
    public void setWillAttend(boolean willAttend) { this.willAttend = willAttend; }

    public String getDietaryPreference() { return dietaryPreference; }
    public void setDietaryPreference(String dietaryPreference) { this.dietaryPreference = dietaryPreference; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}
