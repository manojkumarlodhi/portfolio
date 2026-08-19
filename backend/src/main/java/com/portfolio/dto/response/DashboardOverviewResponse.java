package com.portfolio.dto.response;

import com.portfolio.entity.Profile;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardOverviewResponse {

    private long totalProjects;
    private long totalSkillGroups;
    private long totalExperience;
    private long totalEducation;
    private long totalOrbitItems;
    private long totalStats;
    private long totalMessages;
    private long unreadMessages;
    private Profile profile;
    private LocalDateTime serverTime;
}
