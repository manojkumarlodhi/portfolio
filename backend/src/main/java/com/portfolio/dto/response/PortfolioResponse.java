package com.portfolio.dto.response;

import com.portfolio.entity.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PortfolioResponse {

    private Profile profile;
    private List<Stat> stats;
    private List<OrbitItem> orbitOuter;
    private List<OrbitItem> orbitInner;
    private List<SkillGroup> skillGroups;
    private List<Experience> experience;
    private List<Project> projects;
    private List<Education> education;
}
