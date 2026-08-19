package com.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "project")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 100)
    private String category; // Full Stack, Java Backend, React Apps, etc.

    @Column(columnDefinition = "TEXT", nullable = false)
    private String summary;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_features", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "feature", columnDefinition = "TEXT")
    @OrderColumn(name = "feature_order")
    @Builder.Default
    private List<String> features = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_tech", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "tech", length = 100)
    @OrderColumn(name = "tech_order")
    @Builder.Default
    private List<String> tech = new ArrayList<>();

    @Column(nullable = false)
    @Builder.Default
    private Boolean featured = false;

    @Column(length = 255)
    @Builder.Default
    private String repo = "private";

    @Column(length = 255)
    @Builder.Default
    private String demo = "none";

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;
}
