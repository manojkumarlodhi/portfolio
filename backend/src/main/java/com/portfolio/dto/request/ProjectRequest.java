package com.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectRequest {

    @NotBlank(message = "Project title cannot be blank")
    @Size(max = 150, message = "Title cannot exceed 150 characters")
    private String title;

    @NotBlank(message = "Category is required (e.g. Full Stack, Java Backend, React Apps)")
    @Size(max = 100, message = "Category cannot exceed 100 characters")
    private String category;

    @NotBlank(message = "Project summary cannot be blank")
    private String summary;

    @NotEmpty(message = "At least one project feature bullet point is required")
    private List<String> features;

    @NotEmpty(message = "At least one technology stack tag is required")
    private List<String> tech;

    @Builder.Default
    private Boolean featured = false;

    @Builder.Default
    private String repo = "private";

    @Builder.Default
    private String demo = "none";

    private Integer displayOrder;
}
