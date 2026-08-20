package com.portfolio.service.impl;

import com.portfolio.dto.request.ProfileRequest;
import com.portfolio.entity.Profile;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.repository.ProfileRepository;
import com.portfolio.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository profileRepository;

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "profile")
    public Profile getProfile() {
        return profileRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Profile record not initialized"));
    }

    @Override
    @Transactional
    @CacheEvict(value = {"profile", "portfolio"}, allEntries = true)
    public Profile updateProfile(ProfileRequest request) {
        Profile profile = profileRepository.findAll().stream().findFirst()
                .orElseGet(Profile::new);

        profile.setName(request.getName());
        profile.setRole(request.getRole());
        profile.setMonogram(request.getMonogram());
        profile.setTagline(request.getTagline());
        profile.setSummary(request.getSummary());
        profile.setLocation(request.getLocation());
        profile.setEmail(request.getEmail());
        profile.setPhone(request.getPhone());
        profile.setLinkedin(request.getLinkedin());
        profile.setGithub(request.getGithub());

        if (request.getResumeUrl() != null && !request.getResumeUrl().trim().isEmpty()) {
            profile.setResumeUrl(request.getResumeUrl().trim());
        }
        if (request.getPhotoUrl() != null && !request.getPhotoUrl().trim().isEmpty()) {
            profile.setPhotoUrl(request.getPhotoUrl().trim());
        }

        return profileRepository.save(profile);
    }

    private Profile getOrCreateProfile() {
        return profileRepository.findAll().stream().findFirst()
                .orElseGet(Profile::new);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"profile", "portfolio"}, allEntries = true)
    public Profile updatePhotoUrl(String photoUrl) {
        Profile profile = getOrCreateProfile();
        profile.setPhotoUrl(photoUrl);
        return profileRepository.save(profile);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"profile", "portfolio"}, allEntries = true)
    public Profile updateResumeUrl(String resumeUrl) {
        Profile profile = getOrCreateProfile();
        profile.setResumeUrl(resumeUrl);
        return profileRepository.save(profile);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"profile", "portfolio"}, allEntries = true)
    public Profile deletePhoto() {
        Profile profile = getOrCreateProfile();
        profile.setPhotoUrl(null);
        return profileRepository.save(profile);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"profile", "portfolio"}, allEntries = true)
    public Profile deleteResume() {
        Profile profile = getOrCreateProfile();
        profile.setResumeUrl("#");
        return profileRepository.save(profile);
    }
}
