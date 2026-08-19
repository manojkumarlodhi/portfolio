package com.portfolio.service;

import com.portfolio.dto.request.ReorderRequest;
import com.portfolio.dto.request.StatRequest;
import com.portfolio.entity.Stat;

import java.util.List;

public interface StatService {
    List<Stat> getAllStats();
    Stat getStatById(String id);
    Stat createStat(StatRequest request);
    Stat updateStat(String id, StatRequest request);
    List<Stat> bulkUpdateStats(List<Stat> stats);
    void reorderStats(ReorderRequest request);
    void deleteStat(String id);
}
