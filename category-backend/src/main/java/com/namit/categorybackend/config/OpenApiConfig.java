package com.namit.categorybackend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI categoryApi(){

        return new OpenAPI()
                .info(new Info()
                        .title("Category Management API")
                        .description("Category module for e-commerce backend")
                        .version("v1.0"));
    }
}
