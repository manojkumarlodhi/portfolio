package com.portfolio.service.impl;

import com.portfolio.entity.Admin;
import com.portfolio.entity.RefreshToken;
import com.portfolio.exception.TokenRefreshException;
import com.portfolio.repository.RefreshTokenRepository;
import com.portfolio.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    @Value("${app.jwt.refresh-token-expiration-ms:604800000}")
    private Long refreshTokenDurationMs;

    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Override
    @Transactional
    public RefreshToken createRefreshToken(Admin admin) {
        // Delete any existing refresh token for this admin to enforce single session rotation
        refreshTokenRepository.deleteByAdmin(admin);
        refreshTokenRepository.flush(); // force flush before insert to avoid duplicate key

        RefreshToken refreshToken = RefreshToken.builder()
                .admin(admin)
                .expiryDate(Instant.now().plusMillis(refreshTokenDurationMs))
                .token(UUID.randomUUID().toString())
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "Refresh token has expired. Please sign in again.");
        }
        return token;
    }

    @Override
    @Transactional
    public int deleteByAdmin(Admin admin) {
        return refreshTokenRepository.deleteByAdmin(admin);
    }
}
