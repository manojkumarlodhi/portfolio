package com.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "skill_group")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillGroup extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String title;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "skill_group_items", joinColumns = @JoinColumn(name = "skill_group_id"))
    @Column(name = "item", nullable = false, length = 100)
    @OrderColumn(name = "item_order")
    @Builder.Default
    private List<String> items = new ArrayList<>();

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;
}
