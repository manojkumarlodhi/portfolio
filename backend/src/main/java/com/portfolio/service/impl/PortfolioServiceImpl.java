package com.portfolio.service.impl;

import com.portfolio.dto.response.PortfolioResponse;
import com.portfolio.entity.OrbitItem;
import com.portfolio.repository.*;
import com.portfolio.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PortfolioServiceImpl implements PortfolioService {

    private final ProfileRepository profileRepository;
    private final StatRepository statRepository;
    private final OrbitItemRepository orbitItemRepository;
    private final SkillGroupRepository skillGroupRepository;
    private final ExperienceRepository experienceRepository;
    private final ProjectRepository projectRepository;
    private final EducationRepository educationRepository;

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "portfolio")
    public PortfolioResponse getFullPortfolio() {
        return PortfolioResponse.builder()
                .profile(profileRepository.findAll().stream().findFirst().orElse(null))
                .stats(statRepository.findAllByOrderByDisplayOrderAsc())
                .orbitOuter(orbitItemRepository.findByOrbitTypeOrderByDisplayOrderAsc(OrbitItem.OrbitType.OUTER))
                .orbitInner(orbitItemRepository.findByOrbitTypeOrderByDisplayOrderAsc(OrbitItem.OrbitType.INNER))
                .skillGroups(skillGroupRepository.findAllByOrderByDisplayOrderAsc())
                .experience(experienceRepository.findAllByOrderByDisplayOrderAsc())
                .projects(projectRepository.findAllByOrderByDisplayOrderAsc())
                .education(educationRepository.findAllByOrderByDisplayOrderAsc())
                .build();
    }
}
