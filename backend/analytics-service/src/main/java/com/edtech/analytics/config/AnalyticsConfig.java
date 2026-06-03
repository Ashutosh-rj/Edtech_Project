package com.edtech.analytics.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AnalyticsConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
