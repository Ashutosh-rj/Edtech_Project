package com.edtech.user.controller;

import com.edtech.user.entity.UserProfile;
import com.edtech.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService service;

    @PostMapping("/profile")
    public UserProfile saveProfile(@RequestBody UserProfile profile, @RequestHeader("loggedInUser") String loggedInUser) {
        // Enforce that a user can only update their own profile
        if (!profile.getEmail().equals(loggedInUser)) {
            throw new RuntimeException("Unauthorized to update this profile");
        }
        return service.saveProfile(profile);
    }

    @GetMapping("/profile")
    public UserProfile getProfile(@RequestHeader("loggedInUser") String loggedInUser) {
        return service.getProfile(loggedInUser);
    }

    /**
     * Admin-only: list all user profiles.
     */
    @GetMapping("/all")
    public List<UserProfile> getAllUsers(
            @RequestHeader(value = "X-User-Role", defaultValue = "STUDENT") String userRole) {
        if (!"ADMIN".equalsIgnoreCase(userRole)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can list all users");
        }
        return service.getAllProfiles();
    }

    @PostMapping("/profile/upload")
    public String uploadProfilePicture(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is empty");
        }

        try {
            Path uploadDir = Paths.get("uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String filename = UUID.randomUUID().toString() + extension;
            Path filePath = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Assuming API Gateway is running on localhost:8080
            return "http://localhost:8080/users/uploads/" + filename;

        } catch (IOException e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store file");
        }
    }
}
