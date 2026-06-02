package com.edtech.certificate.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${certificate.storage.path:./data/certificates/}")
    private String storagePath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Ensure the directory exists
        File directory = new File(storagePath);
        if (!directory.exists()) {
            directory.mkdirs();
        }
        
        // Map /certificates/files/** to the storage directory
        // Gateway will forward requests to /certificates/files/** here
        registry.addResourceHandler("/files/**")
                .addResourceLocations("file:" + new File(storagePath).getAbsolutePath() + File.separator);
    }
}
