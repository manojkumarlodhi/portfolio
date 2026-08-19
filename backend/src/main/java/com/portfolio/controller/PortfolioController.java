package com.portfolio.controller;

import com.portfolio.dto.response.ApiResponse;
import com.portfolio.dto.response.PortfolioResponse;
import com.portfolio.service.PortfolioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor
@Tag(name = "Portfolio", description = "Public portfolio data bundle endpoint (cached)")
public class PortfolioController {

    private final PortfolioService portfolioService;

    @GetMapping
    @Operation(summary = "Get Full Portfolio Bundle", description = "Returns all portfolio data in a single cached response for the frontend")
    public ResponseEntity<ApiResponse<PortfolioResponse>> getFullPortfolio() {
        return ResponseEntity.ok(ApiResponse.ok(portfolioService.getFullPortfolio(), "Portfolio data loaded successfully"));
    }
}
