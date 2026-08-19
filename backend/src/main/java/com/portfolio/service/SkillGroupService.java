package com.portfolio.service;

import com.portfolio.dto.request.ReorderRequest;
import com.portfolio.dto.request.SkillGroupRequest;
import com.portfolio.entity.SkillGroup;

import java.util.List;

public interface SkillGroupService {
    List<SkillGroup> getAllSkillGroups(String search);
    SkillGroup getSkillGroupById(String id);
    SkillGroup createSkillGroup(SkillGroupRequest request);
    SkillGroup updateSkillGroup(String id, SkillGroupRequest request);
    void reorderSkillGroups(ReorderRequest request);
    void deleteSkillGroup(String id);
}
