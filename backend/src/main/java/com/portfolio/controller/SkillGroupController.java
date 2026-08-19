package com.portfolio.controller;

import com.portfolio.dto.request.ReorderRequest;
import com.portfolio.dto.request.SkillGroupRequest;
import com.portfolio.dto.response.ApiResponse;
import com.portfolio.entity.SkillGroup;
import com.portfolio.service.SkillGroupService;
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
@Tag(name = "Skills", description = "Skill groups — public GET, protected CUD, server-side search")
public class SkillGroupController {

    private final SkillGroupService skillGroupService;

    @GetMapping("/portfolio/skills")
    @Operation(summary = "Get All Skill Groups (Public, searchable)")
    public ResponseEntity<ApiResponse<List<SkillGroup>>> getAllSkillGroups(
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(ApiResponse.ok(skillGroupService.getAllSkillGroups(search)));
    }

    @GetMapping("/admin/skills/{id}")
    @Operation(summary = "Get Skill Group By ID", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<SkillGroup>> getSkillGroupById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(skillGroupService.getSkillGroupById(id)));
    }

    @PostMapping("/admin/skills")
    @Operation(summary = "Create Skill Group", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<SkillGroup>> createSkillGroup(@Valid @RequestBody SkillGroupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(skillGroupService.createSkillGroup(request), "Skill group created successfully"));
    }

    @PutMapping("/admin/skills/{id}")
    @Operation(summary = "Update Skill Group", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<SkillGroup>> updateSkillGroup(@PathVariable String id, @Valid @RequestBody SkillGroupRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(skillGroupService.updateSkillGroup(id, request), "Skill group updated successfully"));
    }

    @PostMapping("/admin/skills/reorder")
    @Operation(summary = "Reorder Skill Groups", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> reorderSkillGroups(@Valid @RequestBody ReorderRequest request) {
        skillGroupService.reorderSkillGroups(request);
        return ResponseEntity.ok(ApiResponse.ok(null, "Skill groups reordered successfully"));
    }

    @DeleteMapping("/admin/skills/{id}")
    @Operation(summary = "Delete Skill Group", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> deleteSkillGroup(@PathVariable String id) {
        skillGroupService.deleteSkillGroup(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Skill group deleted successfully"));
    }
}
