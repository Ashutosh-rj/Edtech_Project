package com.edtech.auth.service;

import com.edtech.auth.entity.UserCredential;
import com.edtech.auth.repository.UserCredentialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.edtech.auth.dto.UserDTO;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private UserCredentialRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired(required = false) // optional so service starts even without Kafka running
    private KafkaTemplate<String, String> kafkaTemplate;

    @org.springframework.transaction.annotation.Transactional
    public String saveUser(UserCredential credential) {
        if (repository.findByEmail(credential.getEmail()).isPresent()) {
            throw new RuntimeException("User with email " + credential.getEmail() + " already exists");
        }
        credential.setPassword(passwordEncoder.encode(credential.getPassword()));
        if (credential.getRole() == null || credential.getRole().isBlank()) {
            credential.setRole("STUDENT");
        }
        repository.save(credential);

        // HIGH-07: Publish registration event so notification-service can send welcome email
        if (kafkaTemplate != null) {
            try {
                kafkaTemplate.send("user-registration", credential.getEmail());
            } catch (Exception e) {
                System.err.println("Failed to send Kafka event, continuing without notification: " + e.getMessage());
            }
        }

        return "user added to the system";
    }

    /**
     * Generates a JWT that includes the user's role as a claim.
     * The api-gateway will forward this role as X-User-Role header to downstream services.
     */
    public String generateToken(String username) {
        UserCredential user = repository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        return jwtService.generateToken(username, user.getRole());
    }

    public void validateToken(String token) {
        jwtService.validateToken(token);
    }

    public io.jsonwebtoken.Claims getClaims(String token) {
        return jwtService.getClaims(token);
    }

    public List<UserDTO> getAllUsers() {
        return repository.findAll().stream()
                .map(user -> new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getRole()))
                .collect(Collectors.toList());
    }

    @org.springframework.transaction.annotation.Transactional
    public void updateUserRole(String email, String newRole) {
        UserCredential user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        user.setRole(newRole.toUpperCase());
        repository.save(user);
    }
}
