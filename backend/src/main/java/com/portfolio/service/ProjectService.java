package com.portfolio.service;

import com.portfolio.dto.request.ProjectRequest;
import com.portfolio.dto.request.ReorderRequest;
import com.portfolio.dto.response.PageResponse;
import com.portfolio.entity.Project;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProjectService {
    List<Project> getAllProjects();
    PageResponse<Project> getProjects(String category, String search, Boolean featured, Pageable pageable);
    Project getProjectById(String id);
    Project createProject(ProjectRequest request);
    Project updateProject(String id, ProjectRequest request);
    void reorderProjects(ReorderRequest request);
    void deleteProject(String id);
}
