package com.smartcanteen.api.controller;

import com.smartcanteen.api.dto.WasteLogRequest;
import com.smartcanteen.api.entity.WasteLog;
import com.smartcanteen.api.service.WasteLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/waste")
public class WasteController {

    private final WasteLogService wasteLogService;

    public WasteController(WasteLogService wasteLogService) {
        this.wasteLogService = wasteLogService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<WasteLog> logWaste(
            @RequestBody WasteLogRequest request,
            Authentication authentication) {
        String loggedBy = authentication != null ? authentication.getName() : "Staff";
        return ResponseEntity.ok(wasteLogService.logWaste(request, loggedBy));
    }

    @GetMapping("/recent")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<WasteLog>> getRecentWasteLogs() {
        return ResponseEntity.ok(wasteLogService.getRecentWasteLogs());
    }
}
