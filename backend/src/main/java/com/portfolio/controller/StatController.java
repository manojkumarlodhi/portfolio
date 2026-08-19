package com.portfolio.controller;

import com.portfolio.dto.request.ReorderRequest;
import com.portfolio.dto.request.StatRequest;
import com.portfolio.dto.response.ApiResponse;
import com.portfolio.entity.Stat;
import com.portfolio.service.StatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Stats", description = "Portfolio stats CRUD — public GET, protected CUD")
public class StatController {

    private final StatService statService;

    @GetMapping("/portfolio/stats")
    @Operation(summary = "Get All Stats (Public)")
    public ResponseEntity<ApiResponse<List<Stat>>> getAllStats() {
        return ResponseEntity.ok(ApiResponse.ok(statService.getAllStats()));
    }

    @GetMapping("/admin/stats/{id}")
    @Operation(summary = "Get Stat By ID", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Stat>> getStatById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(statService.getStatById(id)));
    }

    @PostMapping("/admin/stats")
    @Operation(summary = "Create Stat", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Stat>> createStat(@Valid @RequestBody StatRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(statService.createStat(request), "Stat created successfully"));
    }

    @PutMapping("/admin/stats/{id}")
    @Operation(summary = "Update Stat", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Stat>> updateStat(@PathVariable String id, @Valid @RequestBody StatRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(statService.updateStat(id, request), "Stat updated successfully"));
    }

    @PostMapping("/admin/stats/reorder")
    @Operation(summary = "Reorder Stats", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> reorderStats(@Valid @RequestBody ReorderRequest request) {
        statService.reorderStats(request);
        return ResponseEntity.ok(ApiResponse.ok(null, "Stats reordered successfully"));
    }

    @DeleteMapping("/admin/stats/{id}")
    @Operation(summary = "Delete Stat", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> deleteStat(@PathVariable String id) {
        statService.deleteStat(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Stat deleted successfully"));
    }
}
