package com.portfolio.service.impl;

import com.portfolio.dto.request.ReorderRequest;
import com.portfolio.dto.request.StatRequest;
import com.portfolio.entity.Stat;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.repository.StatRepository;
import com.portfolio.service.StatService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StatServiceImpl implements StatService {

    private final StatRepository statRepository;

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "stats")
    public List<Stat> getAllStats() {
        return statRepository.findAllByOrderByDisplayOrderAsc();
    }

    @Override
    @Transactional(readOnly = true)
    public Stat getStatById(String id) {
        return statRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stat card not found with ID: " + id));
    }

    @Override
    @Transactional
    @CacheEvict(value = {"stats", "portfolio"}, allEntries = true)
    public Stat createStat(StatRequest request) {
        int order = request.getDisplayOrder() != null ? request.getDisplayOrder() : (int) statRepository.count() + 1;
        Stat stat = Stat.builder()
                .label(request.getLabel())
                .value(request.getValue())
                .displayOrder(order)
                .build();
        return statRepository.save(stat);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"stats", "portfolio"}, allEntries = true)
    public Stat updateStat(String id, StatRequest request) {
        Stat stat = getStatById(id);
        stat.setLabel(request.getLabel());
        stat.setValue(request.getValue());
        if (request.getDisplayOrder() != null) {
            stat.setDisplayOrder(request.getDisplayOrder());
        }
        return statRepository.save(stat);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"stats", "portfolio"}, allEntries = true)
    public List<Stat> bulkUpdateStats(List<Stat> stats) {
        return statRepository.saveAll(stats);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"stats", "portfolio"}, allEntries = true)
    public void reorderStats(ReorderRequest request) {
        List<String> ids = request.getIds();
        for (int i = 0; i < ids.size(); i++) {
            final int order = i + 1;
            statRepository.findById(ids.get(i)).ifPresent(item -> {
                item.setDisplayOrder(order);
                statRepository.save(item);
            });
        }
    }

    @Override
    @Transactional
    @CacheEvict(value = {"stats", "portfolio"}, allEntries = true)
    public void deleteStat(String id) {
        Stat stat = getStatById(id);
        statRepository.delete(stat);
    }
}
