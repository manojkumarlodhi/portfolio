package com.portfolio.service;

import com.portfolio.dto.request.ExperienceRequest;
import com.portfolio.dto.request.ReorderRequest;
import com.portfolio.entity.Experience;

import java.util.List;

public interface ExperienceService {
    List<Experience> getAllExperience(String type, String search);
    Experience getExperienceById(String id);
    Experience createExperience(ExperienceRequest request);
    Experience updateExperience(String id, ExperienceRequest request);
    void reorderExperience(ReorderRequest request);
    void deleteExperience(String id);
}
