package com.portfolio.service.impl;

import com.portfolio.dto.request.ExperienceRequest;
import com.portfolio.dto.request.ReorderRequest;
import com.portfolio.entity.Experience;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.repository.ExperienceRepository;
import com.portfolio.service.ExperienceService;
import com.portfolio.specification.ExperienceSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExperienceServiceImpl implements ExperienceService {

    private final ExperienceRepository experienceRepository;

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "experience", key = "(#type != null ? #type : 'all') + '-' + (#search != null ? #search : 'all')")
    public List<Experience> getAllExperience(String type, String search) {
        if ((type != null && !type.equalsIgnoreCase("All")) || (search != null && !search.trim().isEmpty())) {
            return experienceRepository.findAll(
                    ExperienceSpecification.withFilters(type, search),
                    Sort.by(Sort.Direction.ASC, "displayOrder")
            );
        }
        return experienceRepository.findAllByOrderByDisplayOrderAsc();
    }

    @Override
    @Transactional(readOnly = true)
    public Experience getExperienceById(String id) {
        return experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience entry not found with ID: " + id));
    }

    @Override
    @Transactional
    @CacheEvict(value = {"experience", "portfolio"}, allEntries = true)
    public Experience createExperience(ExperienceRequest request) {
        int order = request.getDisplayOrder() != null ? request.getDisplayOrder() : (int) experienceRepository.count() + 1;
        Experience exp = Experience.builder()
                .type(request.getType())
                .company(request.getCompany())
                .role(request.getRole())
                .period(request.getPeriod())
                .context(request.getContext())
                .points(request.getPoints())
                .tech(request.getTech() != null ? request.getTech() : List.of())
                .displayOrder(order)
                .build();
        return experienceRepository.save(exp);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"experience", "portfolio"}, allEntries = true)
    public Experience updateExperience(String id, ExperienceRequest request) {
        Experience exp = getExperienceById(id);
        exp.setType(request.getType());
        exp.setCompany(request.getCompany());
        exp.setRole(request.getRole());
        exp.setPeriod(request.getPeriod());
        exp.setContext(request.getContext());
        exp.setPoints(request.getPoints());
        if (request.getTech() != null) {
            exp.setTech(request.getTech());
        }
        if (request.getDisplayOrder() != null) {
            exp.setDisplayOrder(request.getDisplayOrder());
        }
        return experienceRepository.save(exp);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"experience", "portfolio"}, allEntries = true)
    public void reorderExperience(ReorderRequest request) {
        List<String> ids = request.getIds();
        for (int i = 0; i < ids.size(); i++) {
            final int order = i + 1;
            experienceRepository.findById(ids.get(i)).ifPresent(item -> {
                item.setDisplayOrder(order);
                experienceRepository.save(item);
            });
        }
    }

    @Override
    @Transactional
    @CacheEvict(value = {"experience", "portfolio"}, allEntries = true)
    public void deleteExperience(String id) {
        Experience exp = getExperienceById(id);
        experienceRepository.delete(exp);
    }
}
