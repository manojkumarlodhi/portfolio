package com.portfolio.service.impl;

import com.portfolio.dto.request.ReorderRequest;
import com.portfolio.dto.request.SkillGroupRequest;
import com.portfolio.entity.SkillGroup;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.repository.SkillGroupRepository;
import com.portfolio.service.SkillGroupService;
import com.portfolio.specification.SkillGroupSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillGroupServiceImpl implements SkillGroupService {

    private final SkillGroupRepository skillGroupRepository;

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "skills", key = "#search != null ? #search : 'all'")
    public List<SkillGroup> getAllSkillGroups(String search) {
        if (search != null && !search.trim().isEmpty()) {
            return skillGroupRepository.findAll(
                    SkillGroupSpecification.withSearch(search),
                    Sort.by(Sort.Direction.ASC, "displayOrder")
            );
        }
        return skillGroupRepository.findAllByOrderByDisplayOrderAsc();
    }

    @Override
    @Transactional(readOnly = true)
    public SkillGroup getSkillGroupById(String id) {
        return skillGroupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill group not found with ID: " + id));
    }

    @Override
    @Transactional
    @CacheEvict(value = {"skills", "portfolio"}, allEntries = true)
    public SkillGroup createSkillGroup(SkillGroupRequest request) {
        int order = request.getDisplayOrder() != null ? request.getDisplayOrder() : (int) skillGroupRepository.count() + 1;
        SkillGroup group = SkillGroup.builder()
                .title(request.getTitle())
                .items(request.getItems())
                .displayOrder(order)
                .build();
        return skillGroupRepository.save(group);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"skills", "portfolio"}, allEntries = true)
    public SkillGroup updateSkillGroup(String id, SkillGroupRequest request) {
        SkillGroup group = getSkillGroupById(id);
        group.setTitle(request.getTitle());
        group.setItems(request.getItems());
        if (request.getDisplayOrder() != null) {
            group.setDisplayOrder(request.getDisplayOrder());
        }
        return skillGroupRepository.save(group);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"skills", "portfolio"}, allEntries = true)
    public void reorderSkillGroups(ReorderRequest request) {
        List<String> ids = request.getIds();
        for (int i = 0; i < ids.size(); i++) {
            final int order = i + 1;
            skillGroupRepository.findById(ids.get(i)).ifPresent(item -> {
                item.setDisplayOrder(order);
                skillGroupRepository.save(item);
            });
        }
    }

    @Override
    @Transactional
    @CacheEvict(value = {"skills", "portfolio"}, allEntries = true)
    public void deleteSkillGroup(String id) {
        SkillGroup group = getSkillGroupById(id);
        skillGroupRepository.delete(group);
    }
}
