package com.portfolio.controller;

import com.portfolio.dto.request.ExperienceRequest;
import com.portfolio.dto.request.ReorderRequest;
import com.portfolio.dto.response.ApiResponse;
import com.portfolio.entity.Experience;
import com.portfolio.service.ExperienceService;
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
@Tag(name = "Experience", description = "Work/training experience — public GET, protected CUD, filterable & searchable")
public class ExperienceController {

    private final ExperienceService experienceService;

    @GetMapping("/portfolio/experience")
    @Operation(summary = "Get All Experience (Public, filterable)")
    public ResponseEntity<ApiResponse<List<Experience>>> getAllExperience(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(ApiResponse.ok(experienceService.getAllExperience(type, search)));
    }

    @GetMapping("/admin/experience/{id}")
    @Operation(summary = "Get Experience By ID", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Experience>> getExperienceById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(experienceService.getExperienceById(id)));
    }

    @PostMapping("/admin/experience")
    @Operation(summary = "Create Experience", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Experience>> createExperience(@Valid @RequestBody ExperienceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(experienceService.createExperience(request), "Experience entry created successfully"));
    }

    @PutMapping("/admin/experience/{id}")
    @Operation(summary = "Update Experience", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Experience>> updateExperience(@PathVariable String id, @Valid @RequestBody ExperienceRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(experienceService.updateExperience(id, request), "Experience updated successfully"));
    }

    @PostMapping("/admin/experience/reorder")
    @Operation(summary = "Reorder Experience", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> reorderExperience(@Valid @RequestBody ReorderRequest request) {
        experienceService.reorderExperience(request);
        return ResponseEntity.ok(ApiResponse.ok(null, "Experience reordered successfully"));
    }

    @DeleteMapping("/admin/experience/{id}")
    @Operation(summary = "Delete Experience", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> deleteExperience(@PathVariable String id) {
        experienceService.deleteExperience(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Experience deleted successfully"));
    }
}
