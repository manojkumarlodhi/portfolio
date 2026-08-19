package com.portfolio.service;

import com.portfolio.dto.response.UploadResponse;
import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {
    UploadResponse uploadPhoto(MultipartFile file);
    UploadResponse uploadResume(MultipartFile file);
    void deleteAsset(String publicId, String resourceType);
}
 