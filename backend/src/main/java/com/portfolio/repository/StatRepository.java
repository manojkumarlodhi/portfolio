package com.portfolio.repository;

import com.portfolio.entity.Stat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StatRepository extends JpaRepository<Stat, String> {
    List<Stat> findAllByOrderByDisplayOrderAsc();
}
