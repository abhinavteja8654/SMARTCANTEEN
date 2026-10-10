package com.smartcanteen.api.controller;

import com.smartcanteen.api.dto.ForecastRequest;
import com.smartcanteen.api.entity.DemandForecast;
import com.smartcanteen.api.service.PredictionService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/predictions")
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }

    @PostMapping("/generate")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<DemandForecast>> generatePredictions(@RequestBody ForecastRequest request) {
        return ResponseEntity.ok(predictionService.generateForecasts(request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<DemandForecast>> getPredictions(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String mealType) {
        LocalDate target = date != null ? date : LocalDate.now().plusDays(1);
        return ResponseEntity.ok(predictionService.getForecastsForDate(target, mealType));
    }
}
