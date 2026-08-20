package com.portfolio.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "stat")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stat extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String label;

    @Column(name = "stat_value", nullable = false, length = 100)
    private String value;

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;
}
