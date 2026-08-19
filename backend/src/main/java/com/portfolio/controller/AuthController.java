package com.portfolio.controller;

import com.portfolio.dto.request.ChangePasswordRequest;
import com.portfolio.dto.request.LoginRequest;
import com.portfolio.dto.request.RefreshTokenRequest;
import com.portfolio.dto.response.ApiResponse;
import com.portfolio.dto.response.JwtResponse;
import com.portfolio.entity.Admin;
import com.portfolio.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Admin login, token refresh, logout, and password management")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Admin Login", description = "Authenticate admin and receive JWT access + refresh tokens")
    public ResponseEntity<ApiResponse<JwtResponse>> login(@Valid @RequestBody LoginRequest request) {
        JwtResponse jwtResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok(jwtResponse, "Login successful"));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh Access Token", description = "Use refresh token to obtain a new access token")
    public ResponseEntity<ApiResponse<JwtResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        JwtResponse jwtResponse = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.ok(jwtResponse, "Token refreshed successfully"));
    }

    @PostMapping("/logout")
    @Operation(summary = "Admin Logout", description = "Invalidate the current refresh token session")
    public ResponseEntity<ApiResponse<Void>> logout(@Valid @RequestBody RefreshTokenRequest request) {
        authService.logout(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.ok(null, "Logged out successfully"));
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change Admin Password", description = "Change admin account password (requires valid access token)")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.ok(null, "Password changed successfully"));
    }

    @GetMapping("/me")
    @Operation(summary = "Get Admin Profile", description = "Fetch the authenticated admin profile")
    public ResponseEntity<ApiResponse<Admin>> getMe(@AuthenticationPrincipal UserDetails userDetails) {
        Admin admin = authService.getAdminProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(admin, "Admin profile fetched"));
    }
}
