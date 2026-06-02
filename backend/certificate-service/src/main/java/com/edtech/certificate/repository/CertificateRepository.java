package com.edtech.certificate.repository;

import com.edtech.certificate.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    List<Certificate> findByStudentId(String studentId);
    Optional<Certificate> findByCourseIdAndStudentId(Long courseId, String studentId);
    Optional<Certificate> findByUniqueIdentifier(String uniqueIdentifier);
}
