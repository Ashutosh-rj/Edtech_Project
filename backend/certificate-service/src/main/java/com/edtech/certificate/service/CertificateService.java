package com.edtech.certificate.service;

import com.edtech.certificate.entity.Certificate;
import com.edtech.certificate.repository.CertificateRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CertificateService {

    @Autowired
    private CertificateRepository repository;

    @org.springframework.beans.factory.annotation.Value("${certificate.storage.path:./data/certificates/}")
    private String storagePath;

    @org.springframework.beans.factory.annotation.Value("${certificate.gateway.url:http://localhost:8080}")
    private String gatewayUrl;

    public Certificate generateCertificate(Long courseId, String studentId) {
        Optional<Certificate> existing = repository.findByCourseIdAndStudentId(courseId, studentId);
        if (existing.isPresent()) {
            return existing.get();
        }

        String uniqueId = UUID.randomUUID().toString();
        String fileName = "certificate_" + uniqueId + ".pdf";
        
        // Generate PDF using PDFBox
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 24);
                contentStream.newLineAtOffset(100, 700);
                contentStream.showText("Certificate of Completion");
                
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 16);
                contentStream.newLineAtOffset(0, -50);
                contentStream.showText("This certifies that " + studentId);
                contentStream.newLineAtOffset(0, -30);
                contentStream.showText("has successfully completed Course ID: " + courseId);
                contentStream.newLineAtOffset(0, -50);
                contentStream.showText("Verification ID: " + uniqueId);
                contentStream.endText();
            }
            
            // HIGH-04: Save to a persistent, configured directory instead of JVM CWD
            File directory = new File(storagePath);
            if (!directory.exists()) {
                directory.mkdirs();
            }
            document.save(new File(directory, fileName));
        } catch (IOException e) {
            throw new RuntimeException("Error generating certificate PDF", e);
        }

        Certificate certificate = new Certificate();
        certificate.setCourseId(courseId);
        certificate.setStudentId(studentId);
        certificate.setUniqueIdentifier(uniqueId);
        // HIGH-04: Generate correct URL using the gateway route
        certificate.setCertificateUrl(gatewayUrl + "/certificates/files/" + fileName);
        
        return repository.save(certificate);
    }

    public List<Certificate> getStudentCertificates(String studentId) {
        return repository.findByStudentId(studentId);
    }

    public Certificate verifyCertificate(String uniqueIdentifier) {
        return repository.findByUniqueIdentifier(uniqueIdentifier)
                .orElseThrow(() -> new RuntimeException("Invalid certificate"));
    }
}
