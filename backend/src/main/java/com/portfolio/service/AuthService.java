package com.portfolio.service;

import com.portfolio.dto.request.ChangePasswordRequest;
import com.portfolio.dto.request.LoginRequest;
import com.portfolio.dto.request.RefreshTokenRequest;
import com.portfolio.dto.response.JwtResponse;
import com.portfolio.entity.Admin;

public interface AuthService {
    JwtResponse login(LoginRequest request);
    JwtResponse refreshToken(RefreshTokenRequest request);
    void logout(String refreshTokenStr);
    void changePassword(String adminEmail, ChangePasswordRequest request);
    Admin getAdminProfile(String adminEmail);
}
