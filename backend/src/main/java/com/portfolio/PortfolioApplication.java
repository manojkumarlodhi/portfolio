package com.portfolio;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class PortfolioApplication {

    public static void main(String[] args) {
        // Load .env variables into System properties if present
        try {
            Dotenv dotenv = Dotenv.configure()
                    .directory("./src/main/resources")
                    .ignoreIfMissing()
                    .load();
            dotenv.entries().forEach(entry -> {
                if (System.getProperty(entry.getKey()) == null && System.getenv(entry.getKey()) == null) {
                    System.setProperty(entry.getKey(), entry.getValue());
                }
            });
        } catch (Exception ignored) {
            // Fallback gracefully if directory is different or already in environment
        }

        SpringApplication.run(PortfolioApplication.class, args);
    }
}
