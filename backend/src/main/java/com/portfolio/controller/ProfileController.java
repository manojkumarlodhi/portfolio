package com.portfolio.controller;

import com.portfolio.dto.request.ProfileRequest;
import com.portfolio.dto.response.ApiResponse;
import com.portfolio.entity.Profile;
import com.portfolio.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Profile", description = "Portfolio profile CRUD — public GET, protected PUT")
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/portfolio/profile")
    @Operation(summary = "Get Public Profile")
    public ResponseEntity<ApiResponse<Profile>> getProfile() {
        return ResponseEntity.ok(ApiResponse.ok(profileService.getProfile()));
    }

    @PutMapping("/admin/profile")
    @Operation(summary = "Update Profile", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Profile>> updateProfile(@Valid @RequestBody ProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(profileService.updateProfile(request), "Profile updated successfully"));
    }

    @DeleteMapping("/admin/profile/photo")
    @Operation(summary = "Remove Profile Photo", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Profile>> deletePhoto() {
        return ResponseEntity.ok(ApiResponse.ok(profileService.deletePhoto(), "Photo removed from profile"));
    }

    @DeleteMapping("/admin/profile/resume")
    @Operation(summary = "Remove Resume URL", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Profile>> deleteResume() {
        return ResponseEntity.ok(ApiResponse.ok(profileService.deleteResume(), "Resume removed from profile"));
    }
}
