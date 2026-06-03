package com.edtech.auth.controller;

import com.edtech.auth.dto.AuthRequest;
import com.edtech.auth.dto.RegisterRequest;
import com.edtech.auth.dto.UserDTO;
import com.edtech.auth.entity.UserCredential;
import com.edtech.auth.service.AuthService;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService service;

    @Autowired
    private AuthenticationManager authenticationManager;

    /**
     * LOW-06: Uses DTO (RegisterRequest) instead of raw entity.
     * LOW-04: DTO has @Valid bean validation.
     */
    @PostMapping("/register")
    public String addNewUser(@Valid @RequestBody RegisterRequest request) {
        UserCredential credential = new UserCredential();
        credential.setName(request.getName());
        credential.setEmail(request.getEmail());
        credential.setPassword(request.getPassword());
        // Always force role to STUDENT on registration to prevent self-promotion
        credential.setRole("STUDENT");
        return service.saveUser(credential);
    }

    @PostMapping("/login")
    public String getToken(@RequestBody AuthRequest authRequest) {
        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));
        if (authenticate.isAuthenticated()) {
            return service.generateToken(authRequest.getEmail());
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }

    /**
     * CRIT-03: Token is now read from the Authorization header (Bearer scheme),
     * NOT from a query parameter, to prevent token leakage in logs/history.
     */
    @GetMapping("/validate")
    public String validateToken(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7);
        service.validateToken(token);
        return "Token is valid";
    }

    /**
     * Admin-only: list all registered users directly from auth-service.
     * Manually validates the JWT since API Gateway passes /auth/** unfiltered.
     */
    @GetMapping("/users/all")
    public List<UserDTO> getAllUsers(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7);
        try {
            service.validateToken(token);
            Claims claims = service.getClaims(token);
            String role = claims.get("role", String.class);
            if (!"ADMIN".equalsIgnoreCase(role)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can list all registered users");
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
        }
        
        return service.getAllUsers();
    }

    /**
     * Admin-only: update a user's role.
     */
    @PutMapping("/users/{email}/role")
    public String updateUserRole(
            @PathVariable String email, 
            @RequestParam String role, 
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7);
        try {
            service.validateToken(token);
            Claims claims = service.getClaims(token);
            String tokenRole = claims.get("role", String.class);
            if (!"ADMIN".equalsIgnoreCase(tokenRole)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can update roles");
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
        }
        
        service.updateUserRole(email, role);
        return "Role updated successfully";
    }
}
