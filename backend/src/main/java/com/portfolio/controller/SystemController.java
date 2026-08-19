package com.portfolio.controller;

import com.portfolio.dto.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/system")
@Tag(name = "System", description = "Public system health and info endpoints")
public class SystemController {

    @GetMapping("/health")
    @Operation(summary = "Health Check")
    public ResponseEntity<ApiResponse<Map<String, Object>>> health() {
        return ResponseEntity.ok(ApiResponse.ok(
                Map.of(
                        "status", "UP",
                        "application", "Portfolio Backend API",
                        "version", "1.0.0",
                        "timestamp", LocalDateTime.now().toString()
                ), "System is operational"));
    }

    @GetMapping("/info")
    @Operation(summary = "API Information")
    public ResponseEntity<ApiResponse<Map<String, Object>>> info() {
        return ResponseEntity.ok(ApiResponse.ok(
                Map.of(
                        "name", "Manoj Lodhi — Portfolio REST API",
                        "description", "Production-grade Spring Boot 3 REST API",
                        "version", "1.0.0",
                        "swagger", "/swagger-ui.html",
                        "docs", "/v3/api-docs"
                ), "API info"));
    }
}
