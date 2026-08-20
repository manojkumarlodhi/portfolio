package com.portfolio.security;

import com.portfolio.entity.Admin;
import com.portfolio.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        String normalizedEmail = email != null ? email.trim().toLowerCase() : "";
        Admin admin = adminRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found with email: " + email));

        return new User(
                admin.getEmail(),
                admin.getPasswordHash(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );
    }
}
