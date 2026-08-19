package com.portfolio.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReorderRequest {

    @NotEmpty(message = "Ordered ID list cannot be empty")
    private List<String> ids;
}
