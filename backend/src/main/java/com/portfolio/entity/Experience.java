package com.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "experience")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Experience extends BaseEntity {

    @Column(nullable = false, length = 50)
    private String type; // Employment or Training

    @Column(nullable = false, length = 150)
    private String company;

    @Column(nullable = false, length = 150)
    private String role;

    @Column(length = 100)
    private String period;

    @Column(length = 255)
    private String context;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "experience_points", joinColumns = @JoinColumn(name = "experience_id"))
    @Column(name = "point", columnDefinition = "TEXT")
    @OrderColumn(name = "point_order")
    @Builder.Default
    private List<String> points = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "experience_tech", joinColumns = @JoinColumn(name = "experience_id"))
    @Column(name = "tech", length = 100)
    @OrderColumn(name = "tech_order")
    @Builder.Default
    private List<String> tech = new ArrayList<>();

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;
}
