package com.portfolio.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UploadResponse {

    private String url;
    private String publicId;
    private String format;
    private Long bytes;
}
