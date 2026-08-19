package com.portfolio.service.impl;

import com.portfolio.dto.request.EducationRequest;
import com.portfolio.dto.request.ReorderRequest;
import com.portfolio.entity.Education;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.repository.EducationRepository;
import com.portfolio.service.EducationService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EducationServiceImpl implements EducationService {

    private final EducationRepository educationRepository;

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "education")
    public List<Education> getAllEducation() {
        return educationRepository.findAllByOrderByDisplayOrderAsc();
    }

    @Override
    @Transactional(readOnly = true)
    public Education getEducationById(String id) {
        return educationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Education entry not found with ID: " + id));
    }

    @Override
    @Transactional
    @CacheEvict(value = {"education", "portfolio"}, allEntries = true)
    public Education createEducation(EducationRequest request) {
        int order = request.getDisplayOrder() != null ? request.getDisplayOrder() : (int) educationRepository.count() + 1;
        Education edu = Education.builder()
                .title(request.getTitle())
                .org(request.getOrg())
                .meta(request.getMeta())
                .note(request.getNote())
                .displayOrder(order)
                .build();
        return educationRepository.save(edu);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"education", "portfolio"}, allEntries = true)
    public Education updateEducation(String id, EducationRequest request) {
        Education edu = getEducationById(id);
        edu.setTitle(request.getTitle());
        edu.setOrg(request.getOrg());
        edu.setMeta(request.getMeta());
        edu.setNote(request.getNote());
        if (request.getDisplayOrder() != null) {
            edu.setDisplayOrder(request.getDisplayOrder());
        }
        return educationRepository.save(edu);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"education", "portfolio"}, allEntries = true)
    public void reorderEducation(ReorderRequest request) {
        List<String> ids = request.getIds();
        for (int i = 0; i < ids.size(); i++) {
            final int order = i + 1;
            educationRepository.findById(ids.get(i)).ifPresent(item -> {
                item.setDisplayOrder(order);
                educationRepository.save(item);
            });
        }
    }

    @Override
    @Transactional
    @CacheEvict(value = {"education", "portfolio"}, allEntries = true)
    public void deleteEducation(String id) {
        Education edu = getEducationById(id);
        educationRepository.delete(edu);
    }
}
