package com.portfolio.controller;

import com.portfolio.dto.request.ProjectRequest;
import com.portfolio.dto.request.ReorderRequest;
import com.portfolio.dto.response.ApiResponse;
import com.portfolio.dto.response.PageResponse;
import com.portfolio.entity.Project;
import com.portfolio.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Projects", description = "Portfolio projects — public GET with pagination/filter/search, protected CUD")
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping("/portfolio/projects")
    @Operation(summary = "Get All Projects (Flat List — Public)")
    public ResponseEntity<ApiResponse<List<Project>>> getAllProjects() {
        return ResponseEntity.ok(ApiResponse.ok(projectService.getAllProjects()));
    }

    @GetMapping("/portfolio/projects/search")
    @Operation(summary = "Search & Filter Projects with Pagination (Public)")
    public ResponseEntity<ApiResponse<PageResponse<Project>>> searchProjects(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "displayOrder") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        return ResponseEntity.ok(ApiResponse.ok(projectService.getProjects(category, search, featured, pageable)));
    }

    @GetMapping("/admin/projects/{id}")
    @Operation(summary = "Get Project By ID", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Project>> getProjectById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(projectService.getProjectById(id)));
    }

    @PostMapping("/admin/projects")
    @Operation(summary = "Create Project", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Project>> createProject(@Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(projectService.createProject(request), "Project created successfully"));
    }

    @PutMapping("/admin/projects/{id}")
    @Operation(summary = "Update Project", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Project>> updateProject(@PathVariable String id, @Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(projectService.updateProject(id, request), "Project updated successfully"));
    }

    @PostMapping("/admin/projects/reorder")
    @Operation(summary = "Reorder Projects", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> reorderProjects(@Valid @RequestBody ReorderRequest request) {
        projectService.reorderProjects(request);
        return ResponseEntity.ok(ApiResponse.ok(null, "Projects reordered successfully"));
    }

    @DeleteMapping("/admin/projects/{id}")
    @Operation(summary = "Delete Project", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable String id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Project deleted successfully"));
    }
}
