package com.portfolio.service.impl;

import com.portfolio.dto.request.ProjectRequest;
import com.portfolio.dto.request.ReorderRequest;
import com.portfolio.dto.response.PageResponse;
import com.portfolio.entity.Project;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.repository.ProjectRepository;
import com.portfolio.service.ProjectService;
import com.portfolio.specification.ProjectSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "projects")
    public List<Project> getAllProjects() {
        return projectRepository.findAllByOrderByDisplayOrderAsc();
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<Project> getProjects(String category, String search, Boolean featured, Pageable pageable) {
        Page<Project> page = projectRepository.findAll(
                ProjectSpecification.withFilters(category, search, featured),
                pageable
        );
        return PageResponse.of(page);
    }

    @Override
    @Transactional(readOnly = true)
    public Project getProjectById(String id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + id));
    }

    @Override
    @Transactional
    @CacheEvict(value = {"projects", "portfolio"}, allEntries = true)
    public Project createProject(ProjectRequest request) {
        int order = request.getDisplayOrder() != null ? request.getDisplayOrder() : (int) projectRepository.count() + 1;
        Project project = Project.builder()
                .title(request.getTitle())
                .category(request.getCategory())
                .summary(request.getSummary())
                .features(request.getFeatures())
                .tech(request.getTech())
                .featured(request.getFeatured() != null ? request.getFeatured() : false)
                .repo(request.getRepo() != null ? request.getRepo() : "private")
                .demo(request.getDemo() != null ? request.getDemo() : "none")
                .displayOrder(order)
                .build();
        return projectRepository.save(project);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"projects", "portfolio"}, allEntries = true)
    public Project updateProject(String id, ProjectRequest request) {
        Project project = getProjectById(id);
        project.setTitle(request.getTitle());
        project.setCategory(request.getCategory());
        project.setSummary(request.getSummary());
        project.setFeatures(request.getFeatures());
        project.setTech(request.getTech());
        if (request.getFeatured() != null) {
            project.setFeatured(request.getFeatured());
        }
        if (request.getRepo() != null) {
            project.setRepo(request.getRepo());
        }
        if (request.getDemo() != null) {
            project.setDemo(request.getDemo());
        }
        if (request.getDisplayOrder() != null) {
            project.setDisplayOrder(request.getDisplayOrder());
        }
        return projectRepository.save(project);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"projects", "portfolio"}, allEntries = true)
    public void reorderProjects(ReorderRequest request) {
        List<String> ids = request.getIds();
        for (int i = 0; i < ids.size(); i++) {
            final int order = i + 1;
            projectRepository.findById(ids.get(i)).ifPresent(item -> {
                item.setDisplayOrder(order);
                projectRepository.save(item);
            });
        }
    }

    @Override
    @Transactional
    @CacheEvict(value = {"projects", "portfolio"}, allEntries = true)
    public void deleteProject(String id) {
        Project project = getProjectById(id);
        projectRepository.delete(project);
    }
}
