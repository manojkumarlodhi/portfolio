package com.portfolio.service;

import com.portfolio.dto.request.OrbitItemRequest;
import com.portfolio.dto.request.ReorderRequest;
import com.portfolio.entity.OrbitItem;

import java.util.List;

public interface OrbitItemService {
    List<OrbitItem> getAllOrbitItems();
    List<OrbitItem> getOuterOrbitItems();
    List<OrbitItem> getInnerOrbitItems();
    OrbitItem getOrbitItemById(String id);
    OrbitItem createOrbitItem(OrbitItemRequest request);
    OrbitItem updateOrbitItem(String id, OrbitItemRequest request);
    void reorderOrbitItems(ReorderRequest request);
    void deleteOrbitItem(String id);
}
