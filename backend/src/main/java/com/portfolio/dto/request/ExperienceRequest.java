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
public class ExperienceRequest {

    @NotBlank(message = "Experience type (Employment or Training) is required")
    @Size(max = 50, message = "Type cannot exceed 50 characters")
    private String type;

    @NotBlank(message = "Company / organization name is required")
    @Size(max = 150, message = "Company cannot exceed 150 characters")
    private String company;

    @NotBlank(message = "Role title is required")
    @Size(max = 150, message = "Role cannot exceed 150 characters")
    private String role;

    @Size(max = 100, message = "Period cannot exceed 100 characters")
    private String period;

    @Size(max = 255, message = "Context cannot exceed 255 characters")
    private String context;

    @NotEmpty(message = "At least one descriptive bullet point is required")
    private List<String> points;

    private List<String> tech;

    private Integer displayOrder;
}
