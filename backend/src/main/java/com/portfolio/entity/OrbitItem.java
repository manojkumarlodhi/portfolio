package com.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "orbit_item")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrbitItem extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "short_label", nullable = false, length = 20)
    private String shortLabel;

    @Enumerated(EnumType.STRING)
    @Column(name = "orbit_type", nullable = false, length = 10)
    private OrbitType orbitType; // OUTER or INNER

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;

    public enum OrbitType {
        OUTER,
        INNER
    }
}
