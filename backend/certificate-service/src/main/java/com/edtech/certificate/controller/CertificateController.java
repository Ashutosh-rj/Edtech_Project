package com.edtech.certificate.controller;

import com.edtech.certificate.entity.Certificate;
import com.edtech.certificate.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/certificates")
public class CertificateController {

    @Autowired
    private CertificateService service;

    @PostMapping("/generate/{courseId}")
    public Certificate generateCertificate(
            @PathVariable Long courseId, 
            @RequestHeader("loggedInUser") String loggedInUser,
            @RequestHeader(value = "X-User-Role", defaultValue = "STUDENT") String userRole) {
            
        if (!"STUDENT".equalsIgnoreCase(userRole)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only students can generate certificates");
        }
        
        return service.generateCertificate(courseId, loggedInUser);
    }

    @GetMapping
    public List<Certificate> getMyCertificates(@RequestHeader("loggedInUser") String loggedInUser) {
        return service.getStudentCertificates(loggedInUser);
    }

    @GetMapping("/verify/{uniqueId}")
    public Certificate verifyCertificate(@PathVariable String uniqueId) {
        return service.verifyCertificate(uniqueId);
    }
}
