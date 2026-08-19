package com.portfolio.repository;

import com.portfolio.entity.OrbitItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrbitItemRepository extends JpaRepository<OrbitItem, String> {
    List<OrbitItem> findAllByOrderByDisplayOrderAsc();
    List<OrbitItem> findByOrbitTypeOrderByDisplayOrderAsc(OrbitItem.OrbitType orbitType);
}
