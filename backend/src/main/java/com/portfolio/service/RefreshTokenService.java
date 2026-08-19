package com.portfolio.service;

import com.portfolio.entity.Admin;
import com.portfolio.entity.RefreshToken;

import java.util.Optional;

public interface RefreshTokenService {
    Optional<RefreshToken> findByToken(String token);
    RefreshToken createRefreshToken(Admin admin);
    RefreshToken verifyExpiration(RefreshToken token);
    int deleteByAdmin(Admin admin);
}
