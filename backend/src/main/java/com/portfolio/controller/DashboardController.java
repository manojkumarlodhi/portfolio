package com.portfolio.controller;

import com.portfolio.dto.response.ApiResponse;
import com.portfolio.dto.response.DashboardOverviewResponse;
import com.portfolio.entity.Profile;
import com.portfolio.repository.*;
import com.portfolio.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Admin dashboard overview statistics")
public class DashboardController {

    private final ProfileService profileService;
    private final ProjectRepository projectRepository;
    private final SkillGroupRepository skillGroupRepository;
    private final ExperienceRepository experienceRepository;
    private final EducationRepository educationRepository;
    private final OrbitItemRepository orbitItemRepository;
    private final StatRepository statRepository;
    private final MessageRepository messageRepository;

    @GetMapping("/overview")
    @Operation(summary = "Dashboard Overview Statistics", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<DashboardOverviewResponse>> getOverview() {
        Profile profile = null;
        try {
            profile = profileService.getProfile();
        } catch (Exception ignored) {}

        DashboardOverviewResponse overview = DashboardOverviewResponse.builder()
                .totalProjects(projectRepository.count())
                .totalSkillGroups(skillGroupRepository.count())
                .totalExperience(experienceRepository.count())
                .totalEducation(educationRepository.count())
                .totalOrbitItems(orbitItemRepository.count())
                .totalStats(statRepository.count())
                .totalMessages(messageRepository.count())
                .unreadMessages(messageRepository.countByIsReadFalse())
                .profile(profile)
                .serverTime(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(ApiResponse.ok(overview, "Dashboard overview loaded"));
    }
}
