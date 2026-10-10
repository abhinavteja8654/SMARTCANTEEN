package com.smartcanteen.api.service;

import com.smartcanteen.api.dto.AttendanceIntentRequest;
import com.smartcanteen.api.entity.MealAttendanceIntent;
import com.smartcanteen.api.entity.User;
import com.smartcanteen.api.repository.MealAttendanceIntentRepository;
import com.smartcanteen.api.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AttendanceIntentService {

    private final MealAttendanceIntentRepository intentRepository;
    private final UserRepository userRepository;

    public AttendanceIntentService(MealAttendanceIntentRepository intentRepository, UserRepository userRepository) {
        this.intentRepository = intentRepository;
        this.userRepository = userRepository;
    }

    public MealAttendanceIntent submitIntent(AttendanceIntentRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        LocalDate date = request.getTargetDate() != null ? request.getTargetDate() : LocalDate.now().plusDays(1);
        String mealType = request.getMealType() != null ? request.getMealType().toUpperCase() : "LUNCH";

        Optional<MealAttendanceIntent> existing = intentRepository.findByUserIdAndTargetDateAndMealType(user.getId(), date, mealType);
        MealAttendanceIntent intent = existing.orElseGet(() -> new MealAttendanceIntent(user, date, mealType, request.isWillAttend(), request.getDietaryPreference()));

        intent.setWillAttend(request.isWillAttend());
        if (request.getDietaryPreference() != null) {
            intent.setDietaryPreference(request.getDietaryPreference());
        }
        intent.setSubmittedAt(LocalDateTime.now());

        return intentRepository.save(intent);
    }

    public List<MealAttendanceIntent> getIntentsForDate(LocalDate date) {
        return intentRepository.findByTargetDate(date);
    }
}
