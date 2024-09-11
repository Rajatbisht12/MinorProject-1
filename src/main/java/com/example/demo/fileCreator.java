package com.example.demo;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@SpringBootApplication
@RestController
public class fileCreator {
    public static final Logger logger = LoggerFactory.getLogger(DemoApplication.class);

    @PostMapping(value = "/createf")
    public ResponseEntity<String> createFile(@RequestBody InputData inputData) {
        if (inputData == null || inputData.getMessage() == null) {
            logger.error("Invalid input data");
            return ResponseEntity.badRequest().body("Invalid input data");
        }

        String fileName = inputData.getMessage().toUpperCase();
        logger.info("Attempting to create file: {}", fileName);

        File file = new File(fileName);
        
        try {
            if (file.exists()) {
                logger.info("File already exists: {}", fileName);
                return ResponseEntity.ok("File already exists: " + fileName);
            }
            
            if (file.createNewFile()) {
                logger.info("File created successfully: {}", fileName);
                return ResponseEntity.ok("File created: " + fileName);
            } else {
                logger.error("Failed to create file: {}", fileName);
                return ResponseEntity.internalServerError().body("Failed to create file: " + fileName);
            }
        } catch (IOException e) {
            logger.error("Error creating file: " + fileName, e);
            return ResponseEntity.internalServerError().body("Error creating file: " + e.getMessage());
        } catch (SecurityException e) {
            logger.error("Security exception when creating file: " + fileName, e);
            return ResponseEntity.status(403).body("Permission denied: " + e.getMessage());
        }
    }
    public static class InputData {
        private String message;
        
        public InputData(){}
        public String getMessage() {
            return message;
        }
    
        public void setMessage(String message) {
            this.message = message;
        }
    }
}

