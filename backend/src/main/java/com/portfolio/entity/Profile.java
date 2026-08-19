package com.portfolio.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "profile")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 150)
    private String role;

    @Column(length = 10)
    private String monogram;

    @Column(length = 255)
    private String tagline;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(length = 150)
    private String location;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(length = 50)
    private String phone;

    @Column(length = 255)
    private String linkedin;

    @Column(length = 255)
    private String github;

    @Column(name = "resume_url", length = 500)
    private String resumeUrl;

    @Column(name = "photo_url", length = 500)
    private String photoUrl;
}
