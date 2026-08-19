package com.portfolio.repository;

import com.portfolio.entity.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExperienceRepository extends JpaRepository<Experience, String>, JpaSpecificationExecutor<Experience> {
    List<Experience> findAllByOrderByDisplayOrderAsc();
    List<Experience> findByTypeOrderByDisplayOrderAsc(String type);
}
