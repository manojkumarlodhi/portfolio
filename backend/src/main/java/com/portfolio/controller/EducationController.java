package com.portfolio.controller;

import com.portfolio.dto.request.EducationRequest;
import com.portfolio.dto.request.ReorderRequest;
import com.portfolio.dto.response.ApiResponse;
import com.portfolio.entity.Education;
import com.portfolio.service.EducationService;
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
@Tag(name = "Education", description = "Education entries — public GET, protected CUD")
public class EducationController {

    private final EducationService educationService;

    @GetMapping("/portfolio/education")
    @Operation(summary = "Get All Education (Public)")
    public ResponseEntity<ApiResponse<List<Education>>> getAllEducation() {
        return ResponseEntity.ok(ApiResponse.ok(educationService.getAllEducation()));
    }

    @GetMapping("/admin/education/{id}")
    @Operation(summary = "Get Education By ID", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Education>> getEducationById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(educationService.getEducationById(id)));
    }

    @PostMapping("/admin/education")
    @Operation(summary = "Create Education Entry", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Education>> createEducation(@Valid @RequestBody EducationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(educationService.createEducation(request), "Education entry created successfully"));
    }

    @PutMapping("/admin/education/{id}")
    @Operation(summary = "Update Education Entry", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Education>> updateEducation(@PathVariable String id, @Valid @RequestBody EducationRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(educationService.updateEducation(id, request), "Education updated successfully"));
    }

    @PostMapping("/admin/education/reorder")
    @Operation(summary = "Reorder Education Entries", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> reorderEducation(@Valid @RequestBody ReorderRequest request) {
        educationService.reorderEducation(request);
        return ResponseEntity.ok(ApiResponse.ok(null, "Education reordered successfully"));
    }

    @DeleteMapping("/admin/education/{id}")
    @Operation(summary = "Delete Education Entry", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> deleteEducation(@PathVariable String id) {
        educationService.deleteEducation(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Education deleted successfully"));
    }
}
