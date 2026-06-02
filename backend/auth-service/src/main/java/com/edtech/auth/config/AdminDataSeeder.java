package com.edtech.auth.config;

import com.edtech.auth.entity.UserCredential;
import com.edtech.auth.repository.UserCredentialRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds a default ADMIN account on first startup if one does not already exist.
 *
 * Credentials are read from environment variables (with safe defaults for dev):
 *   ADMIN_EMAIL    — defaults to  admin@edtech.com
 *   ADMIN_PASSWORD — defaults to  Admin@12345
 *   ADMIN_NAME     — defaults to  Platform Admin
 *
 * In production, override these via your docker-compose / k8s secrets.
 */
@Component
public class AdminDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminDataSeeder.class);

    private final UserCredentialRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email:admin@edtech.com}")
    private String adminEmail;

    @Value("${admin.password:Admin@12345}")
    private String adminPassword;

    @Value("${admin.name:Platform Admin}")
    private String adminName;

    public AdminDataSeeder(UserCredentialRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (repository.findByEmail(adminEmail).isPresent()) {
            log.info("Admin account '{}' already exists — skipping seed.", adminEmail);
            return;
        }

        UserCredential admin = new UserCredential();
        admin.setName(adminName);
        admin.setEmail(adminEmail);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRole("ADMIN");

        repository.save(admin);
        log.info("✅  Default admin account created: {}", adminEmail);
        log.warn("⚠️   Change the default admin password immediately in production!");
    }
}
