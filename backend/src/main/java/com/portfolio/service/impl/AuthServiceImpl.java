package com.portfolio.service.impl;

import com.portfolio.dto.request.ChangePasswordRequest;
import com.portfolio.dto.request.LoginRequest;
import com.portfolio.dto.request.RefreshTokenRequest;
import com.portfolio.dto.response.JwtResponse;
import com.portfolio.entity.Admin;
import com.portfolio.entity.RefreshToken;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.exception.TokenRefreshException;
import com.portfolio.repository.AdminRepository;
import com.portfolio.security.JwtUtil;
import com.portfolio.service.AuthService;
import com.portfolio.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final AdminRepository adminRepository;
    private final RefreshTokenService refreshTokenService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.jwt.access-token-expiration-ms:3600000}")
    private long jwtExpirationMs;

    @Override
    @Transactional
    public JwtResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
        );

        Admin admin = adminRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with email: " + normalizedEmail));

        String accessToken = jwtUtil.generateToken(admin.getEmail());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(admin);

        return JwtResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .expiresIn(jwtExpirationMs)
                .email(admin.getEmail())
                .build();
    }

    @Override
    public JwtResponse refreshToken(RefreshTokenRequest request) {
        return refreshTokenService.findByToken(request.getRefreshToken())
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getAdmin)
                .map(admin -> {
                    String accessToken = jwtUtil.generateToken(admin.getEmail());
                    return JwtResponse.builder()
                            .accessToken(accessToken)
                            .refreshToken(request.getRefreshToken())
                            .tokenType("Bearer")
                            .expiresIn(jwtExpirationMs)
                            .email(admin.getEmail())
                            .build();
                })
                .orElseThrow(() -> new TokenRefreshException(request.getRefreshToken(), "Refresh token is not in database!"));
    }

    @Override
    @Transactional
    public void logout(String refreshTokenStr) {
        if (refreshTokenStr != null) {
            refreshTokenService.findByToken(refreshTokenStr)
                    .ifPresent(token -> refreshTokenService.deleteByAdmin(token.getAdmin()));
        }
    }

    @Override
    @Transactional
    public void changePassword(String adminEmail, ChangePasswordRequest request) {
        Admin admin = adminRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with email: " + adminEmail));

        if (!passwordEncoder.matches(request.getCurrentPassword(), admin.getPasswordHash())) {
            throw new IllegalArgumentException("Current password does not match");
        }

        admin.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        adminRepository.save(admin);
    }

    @Override
    public Admin getAdminProfile(String adminEmail) {
        return adminRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with email: " + adminEmail));
    }
}
