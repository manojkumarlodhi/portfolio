package com.portfolio.service;

import com.portfolio.dto.request.ProfileRequest;
import com.portfolio.entity.Profile;

public interface ProfileService {
    Profile getProfile();
    Profile updateProfile(ProfileRequest request);
    Profile updatePhotoUrl(String photoUrl);
    Profile updateResumeUrl(String resumeUrl);
    Profile deletePhoto();
    Profile deleteResume();
}
