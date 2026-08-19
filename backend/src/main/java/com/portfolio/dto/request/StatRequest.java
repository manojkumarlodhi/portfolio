package com.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatRequest {

    @NotBlank(message = "Label cannot be blank")
    @Size(max = 100, message = "Label cannot exceed 100 characters")
    private String label;

    @NotBlank(message = "Value cannot be blank")
    @Size(max = 100, message = "Value cannot exceed 100 characters")
    private String value;

    private Integer displayOrder;
}
