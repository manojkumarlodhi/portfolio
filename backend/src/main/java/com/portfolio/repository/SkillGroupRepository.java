package com.portfolio.repository;

import com.portfolio.entity.SkillGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillGroupRepository extends JpaRepository<SkillGroup, String>, JpaSpecificationExecutor<SkillGroup> {
    List<SkillGroup> findAllByOrderByDisplayOrderAsc();
}
