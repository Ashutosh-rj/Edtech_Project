package com.edtech.user.service;

import com.edtech.user.entity.UserProfile;
import com.edtech.user.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserProfileRepository repository;

    public UserProfile saveProfile(UserProfile profile) {
        return repository.save(profile);
    }

    public UserProfile getProfile(String email) {
        Optional<UserProfile> profile = repository.findById(email);
        return profile.orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.NOT_FOUND, "User profile not found for email: " + email));
    }

    public List<UserProfile> getAllProfiles() {
        return repository.findAll();
    }
}
