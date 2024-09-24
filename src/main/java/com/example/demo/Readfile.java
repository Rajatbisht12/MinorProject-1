package com.example.demo;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Readfile {

    public static final Logger logger = LoggerFactory.getLogger(Readfile.class);
    private static final String BASE_PATH = "/home/rajat-bisht11/Desktop/demo/src/main/resourcesMyFolder";

    @PostMapping(value="/readF", produces = "text/plain")
    public ResponseEntity<String> readFile(@RequestBody InputData inputData) {
        if (inputData == null || inputData.getMessage() == null) {
            logger.error("Invalid input data");
            return ResponseEntity.badRequest().body("Invalid input data");
        }

        String fileName = inputData.getMessage();
        Path filePath = Paths.get(BASE_PATH, fileName);

        try {
            if (Files.exists(filePath)) {
                logger.info("File found: {}", fileName);
                
                // Read file content using FileInputStream
                StringBuilder fileContent = new StringBuilder();
                try (FileInputStream fis = new FileInputStream(filePath.toFile())) {
                    int character;
                    while ((character = fis.read()) != -1) {
                        fileContent.append((char) character);
                    }
                }
                
                return ResponseEntity.ok(fileContent.toString());
            } else {
                logger.error("File not found: {}", fileName);
                return ResponseEntity.status(404).body("File not found: " + fileName);
            }
        } catch (SecurityException e) {
            logger.error("Security exception while accessing file: {}", fileName, e);
            return ResponseEntity.status(403).body("Permission denied: " + e.getMessage());
        } catch (IOException e) {
            logger.error("I/O exception while reading file: {}", fileName, e);
            return ResponseEntity.internalServerError().body("Error reading file: " + e.getMessage());
        }
    }

    public static class InputData {
        private String message;

        public InputData() {}

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
