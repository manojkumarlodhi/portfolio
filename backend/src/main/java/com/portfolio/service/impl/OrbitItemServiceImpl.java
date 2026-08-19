package com.portfolio.service.impl;

import com.portfolio.dto.request.OrbitItemRequest;
import com.portfolio.dto.request.ReorderRequest;
import com.portfolio.entity.OrbitItem;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.repository.OrbitItemRepository;
import com.portfolio.service.OrbitItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrbitItemServiceImpl implements OrbitItemService {

    private final OrbitItemRepository orbitItemRepository;

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "orbit")
    public List<OrbitItem> getAllOrbitItems() {
        return orbitItemRepository.findAllByOrderByDisplayOrderAsc();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrbitItem> getOuterOrbitItems() {
        return orbitItemRepository.findByOrbitTypeOrderByDisplayOrderAsc(OrbitItem.OrbitType.OUTER);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrbitItem> getInnerOrbitItems() {
        return orbitItemRepository.findByOrbitTypeOrderByDisplayOrderAsc(OrbitItem.OrbitType.INNER);
    }

    @Override
    @Transactional(readOnly = true)
    public OrbitItem getOrbitItemById(String id) {
        return orbitItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orbit item not found with ID: " + id));
    }

    @Override
    @Transactional
    @CacheEvict(value = {"orbit", "portfolio"}, allEntries = true)
    public OrbitItem createOrbitItem(OrbitItemRequest request) {
        int order = request.getDisplayOrder() != null ? request.getDisplayOrder() : (int) orbitItemRepository.count() + 1;
        OrbitItem item = OrbitItem.builder()
                .name(request.getName())
                .shortLabel(request.getShortLabel())
                .orbitType(request.getOrbitType())
                .displayOrder(order)
                .build();
        return orbitItemRepository.save(item);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"orbit", "portfolio"}, allEntries = true)
    public OrbitItem updateOrbitItem(String id, OrbitItemRequest request) {
        OrbitItem item = getOrbitItemById(id);
        item.setName(request.getName());
        item.setShortLabel(request.getShortLabel());
        item.setOrbitType(request.getOrbitType());
        if (request.getDisplayOrder() != null) {
            item.setDisplayOrder(request.getDisplayOrder());
        }
        return orbitItemRepository.save(item);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"orbit", "portfolio"}, allEntries = true)
    public void reorderOrbitItems(ReorderRequest request) {
        List<String> ids = request.getIds();
        for (int i = 0; i < ids.size(); i++) {
            final int order = i + 1;
            orbitItemRepository.findById(ids.get(i)).ifPresent(item -> {
                item.setDisplayOrder(order);
                orbitItemRepository.save(item);
            });
        }
    }

    @Override
    @Transactional
    @CacheEvict(value = {"orbit", "portfolio"}, allEntries = true)
    public void deleteOrbitItem(String id) {
        OrbitItem item = getOrbitItemById(id);
        orbitItemRepository.delete(item);
    }
}
