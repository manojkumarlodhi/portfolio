package com.portfolio.controller;

import com.portfolio.dto.request.OrbitItemRequest;
import com.portfolio.dto.request.ReorderRequest;
import com.portfolio.dto.response.ApiResponse;
import com.portfolio.entity.OrbitItem;
import com.portfolio.service.OrbitItemService;
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
@Tag(name = "Orbit Items", description = "Tech orbit items — public GET, protected CUD")
public class OrbitItemController {

    private final OrbitItemService orbitItemService;

    @GetMapping("/portfolio/orbit")
    @Operation(summary = "Get All Orbit Items (Public)")
    public ResponseEntity<ApiResponse<List<OrbitItem>>> getAllOrbitItems() {
        return ResponseEntity.ok(ApiResponse.ok(orbitItemService.getAllOrbitItems()));
    }

    @GetMapping("/admin/orbit/{id}")
    @Operation(summary = "Get Orbit Item By ID", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<OrbitItem>> getOrbitItemById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(orbitItemService.getOrbitItemById(id)));
    }

    @PostMapping("/admin/orbit")
    @Operation(summary = "Create Orbit Item", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<OrbitItem>> createOrbitItem(@Valid @RequestBody OrbitItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(orbitItemService.createOrbitItem(request), "Orbit item created successfully"));
    }

    @PutMapping("/admin/orbit/{id}")
    @Operation(summary = "Update Orbit Item", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<OrbitItem>> updateOrbitItem(@PathVariable String id, @Valid @RequestBody OrbitItemRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(orbitItemService.updateOrbitItem(id, request), "Orbit item updated successfully"));
    }

    @PostMapping("/admin/orbit/reorder")
    @Operation(summary = "Reorder Orbit Items", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> reorderOrbitItems(@Valid @RequestBody ReorderRequest request) {
        orbitItemService.reorderOrbitItems(request);
        return ResponseEntity.ok(ApiResponse.ok(null, "Orbit items reordered successfully"));
    }

    @DeleteMapping("/admin/orbit/{id}")
    @Operation(summary = "Delete Orbit Item", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> deleteOrbitItem(@PathVariable String id) {
        orbitItemService.deleteOrbitItem(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Orbit item deleted successfully"));
    }
}
