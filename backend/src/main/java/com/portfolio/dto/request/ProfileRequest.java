package com.portfolio.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileRequest {

    @NotBlank(message = "Full name cannot be blank")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String name;

    @NotBlank(message = "Role title cannot be blank")
    @Size(max = 150, message = "Role title cannot exceed 150 characters")
    private String role;

    @Size(max = 10, message = "Monogram cannot exceed 10 characters")
    private String monogram;

    @Size(max = 255, message = "Tagline cannot exceed 255 characters")
    private String tagline;

    private String summary;

    @Size(max = 150, message = "Location cannot exceed 150 characters")
    private String location;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @Size(max = 50, message = "Phone cannot exceed 50 characters")
    private String phone;

    private String linkedin;

    private String github;

    private String resumeUrl;

    private String photoUrl;
}
