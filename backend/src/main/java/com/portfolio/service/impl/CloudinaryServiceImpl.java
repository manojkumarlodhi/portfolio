package com.portfolio.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.portfolio.dto.response.UploadResponse;
import com.portfolio.exception.CloudinaryUploadException;
import com.portfolio.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    @Override
    public UploadResponse uploadPhoto(MultipartFile file) {
        if (file.isEmpty()) {
            throw new CloudinaryUploadException("Cannot upload empty image file");
        }

        try {
            String publicId = "portfolio/photos/photo_" + UUID.randomUUID().toString().substring(0, 8);
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "public_id", publicId,
                    "folder", "portfolio/photos",
                    "resource_type", "image",
                    "quality", "auto",
                    "fetch_format", "auto"
            ));

            String secureUrl = (String) uploadResult.get("secure_url");
            String format = (String) uploadResult.get("format");
            Long bytes = uploadResult.get("bytes") != null ? Long.valueOf(uploadResult.get("bytes").toString()) : null;

            log.info("Photo uploaded to Cloudinary: {}", secureUrl);
            return UploadResponse.builder()
                    .url(secureUrl)
                    .publicId(publicId)
                    .format(format)
                    .bytes(bytes)
                    .build();

        } catch (Exception e) {
            log.warn("Cloudinary photo upload failed ({}). Automatically saving file to local storage.", e.getMessage());
            return saveLocally(file, "photos", "photo");
        }
    }

    @Override
    public UploadResponse uploadResume(MultipartFile file) {
        if (file.isEmpty()) {
            throw new CloudinaryUploadException("Cannot upload empty PDF file");
        }

        try {
            String publicId = "portfolio/resumes/manoj_lodhi_resume_" + UUID.randomUUID().toString().substring(0, 8);
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "public_id", publicId,
                    "folder", "portfolio/resumes",
                    "resource_type", "raw"
            ));

            String secureUrl = (String) uploadResult.get("secure_url");
            String format = (String) uploadResult.get("format");
            Long bytes = uploadResult.get("bytes") != null ? Long.valueOf(uploadResult.get("bytes").toString()) : null;

            log.info("Resume PDF uploaded to Cloudinary: {}", secureUrl);
            return UploadResponse.builder()
                    .url(secureUrl)
                    .publicId(publicId)
                    .format(format != null ? format : "pdf")
                    .bytes(bytes)
                    .build();

        } catch (Exception e) {
            log.warn("Cloudinary resume upload failed ({}). Automatically saving file to local storage.", e.getMessage());
            return saveLocally(file, "resumes", "resume");
        }
    }

    private UploadResponse saveLocally(MultipartFile file, String subFolder, String prefix) {
        try {
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            } else {
                extension = subFolder.equals("photos") ? ".jpg" : ".pdf";
            }

            String filename = prefix + "_" + UUID.randomUUID().toString().substring(0, 8) + extension;
            Path uploadDir = Paths.get("uploads", subFolder);
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            Path targetPath = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl;
            try {
                fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/uploads/" + subFolder + "/" + filename)
                        .toUriString();
            } catch (Exception ex) {
                fileUrl = "http://localhost:8080/uploads/" + subFolder + "/" + filename;
            }

            log.info("Saved file locally at: {}", fileUrl);

            return UploadResponse.builder()
                    .url(fileUrl)
                    .publicId("local/" + subFolder + "/" + filename)
                    .format(extension.replace(".", ""))
                    .bytes(file.getSize())
                    .build();
        } catch (IOException e) {
            log.error("Local file storage failed", e);
            throw new CloudinaryUploadException("Failed to save file: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteAsset(String publicId, String resourceType) {
        if (publicId == null || publicId.trim().isEmpty()) return;
        if (publicId.startsWith("local/")) {
            try {
                String relativePath = publicId.substring("local/".length());
                Path path = Paths.get("uploads", relativePath);
                Files.deleteIfExists(path);
                log.info("Local file deleted: {}", path);
            } catch (Exception e) {
                log.warn("Failed to delete local asset {}: {}", publicId, e.getMessage());
            }
            return;
        }

        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.asMap(
                    "resource_type", resourceType != null ? resourceType : "image"
            ));
            log.info("Cloudinary asset deleted: {}", publicId);
        } catch (Exception e) {
            log.warn("Failed to delete Cloudinary asset {}: {}", publicId, e.getMessage());
        }
    }
}
