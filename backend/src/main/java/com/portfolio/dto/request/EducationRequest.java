package com.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EducationRequest {

    @NotBlank(message = "Education/degree title is required")
    @Size(max = 150, message = "Title cannot exceed 150 characters")
    private String title;

    @NotBlank(message = "Institute/organization name is required")
    @Size(max = 150, message = "Institute cannot exceed 150 characters")
    private String org;

    @Size(max = 100, message = "Grade/meta cannot exceed 100 characters")
    private String meta;

    private String note;

    private Integer displayOrder;
}
