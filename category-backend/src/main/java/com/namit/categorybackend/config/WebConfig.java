package com.namit.categorybackend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

        // Set ALLOWED_ORIGIN=https://<your-app>.vercel.app in Render dashboard.
        // Falls back to localhost for local dev.
        @Value("${allowed.origin:http://localhost:5173}")
        private String allowedOrigin;

        @Override
        public void addCorsMappings(CorsRegistry registry) {

                registry.addMapping("/api/**")
                                .allowedOrigins("http://localhost:5173", allowedOrigin)
                                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                                .allowedHeaders("*")
                                .allowCredentials(true)
                                .maxAge(3600);
        }
}
