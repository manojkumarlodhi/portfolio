package com.portfolio.dto.request;

import com.portfolio.entity.OrbitItem.OrbitType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrbitItemRequest {

    @NotBlank(message = "Technology name cannot be blank")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String name;

    @NotBlank(message = "Short label cannot be blank")
    @Size(max = 20, message = "Short label cannot exceed 20 characters")
    private String shortLabel;

    @NotNull(message = "Orbit type (OUTER or INNER) is required")
    private OrbitType orbitType;

    private Integer displayOrder;
}
