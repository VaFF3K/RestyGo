package com.example.restygo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Шлях до локальної директорії, де зберігаються файли
        registry.addResourceHandler("/assets/**")
                .addResourceLocations("file:assets/")
                .setCachePeriod(3600);
    }
}