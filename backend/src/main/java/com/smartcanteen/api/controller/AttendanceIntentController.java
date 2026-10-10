package com.smartcanteen.api.controller;

import com.smartcanteen.api.dto.AttendanceIntentRequest;
import com.smartcanteen.api.entity.MealAttendanceIntent;
import com.smartcanteen.api.service.AttendanceIntentService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance-intent")
public class AttendanceIntentController {

    private final AttendanceIntentService attendanceIntentService;

    public AttendanceIntentController(AttendanceIntentService attendanceIntentService) {
        this.attendanceIntentService = attendanceIntentService;
    }

    @PostMapping
    public ResponseEntity<MealAttendanceIntent> submitIntent(
            @RequestBody AttendanceIntentRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(attendanceIntentService.submitIntent(request, authentication.getName()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<MealAttendanceIntent>> getIntentsForDate(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate target = date != null ? date : LocalDate.now();
        return ResponseEntity.ok(attendanceIntentService.getIntentsForDate(target));
    }
}
