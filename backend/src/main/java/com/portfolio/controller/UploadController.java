package com.portfolio.controller;

import com.portfolio.dto.response.ApiResponse;
import com.portfolio.dto.response.UploadResponse;
import com.portfolio.entity.Profile;
import com.portfolio.service.CloudinaryService;
import com.portfolio.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/upload")
@RequiredArgsConstructor
@Tag(name = "Media Upload", description = "Cloudinary photo and resume upload endpoints")
public class UploadController {

    private final CloudinaryService cloudinaryService;
    private final ProfileService profileService;

    @PostMapping(value = "/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload Profile Photo", description = "Upload a JPG/PNG and update profile.photoUrl with Cloudinary URL",
            security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Profile>> uploadPhoto(@RequestParam("file") MultipartFile file) {
        UploadResponse uploadResponse = cloudinaryService.uploadPhoto(file);
        Profile updatedProfile = profileService.updatePhotoUrl(uploadResponse.getUrl());
        return ResponseEntity.ok(ApiResponse.ok(updatedProfile, "Profile photo uploaded and saved successfully"));
    }

    @PostMapping(value = "/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload Resume PDF", description = "Upload a PDF resume to Cloudinary and update profile.resumeUrl",
            security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Profile>> uploadResume(@RequestParam("file") MultipartFile file) {
        UploadResponse uploadResponse = cloudinaryService.uploadResume(file);
        Profile updatedProfile = profileService.updateResumeUrl(uploadResponse.getUrl());
        return ResponseEntity.ok(ApiResponse.ok(updatedProfile, "Resume uploaded and saved successfully"));
    }

    @GetMapping("/info")
    @Operation(summary = "Upload Limits Info", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Object>> getUploadInfo() {
        return ResponseEntity.ok(ApiResponse.ok(
                java.util.Map.of(
                        "maxPhotoSize", "10 MB",
                        "allowedPhotoFormats", java.util.List.of("jpg", "jpeg", "png", "webp"),
                        "maxResumeSize", "25 MB",
                        "allowedResumeFormat", "pdf",
                        "storage", "Cloudinary CDN"
                ), "Upload configuration"));
    }
}
