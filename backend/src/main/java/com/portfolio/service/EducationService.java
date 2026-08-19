package com.portfolio.service;

import com.portfolio.dto.request.EducationRequest;
import com.portfolio.dto.request.ReorderRequest;
import com.portfolio.entity.Education;

import java.util.List;

public interface EducationService {
    List<Education> getAllEducation();
    Education getEducationById(String id);
    Education createEducation(EducationRequest request);
    Education updateEducation(String id, EducationRequest request);
    void reorderEducation(ReorderRequest request);
    void deleteEducation(String id);
}
