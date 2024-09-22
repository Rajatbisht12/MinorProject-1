package com.example.demo;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
@RestController
public class DeleteFile {
    public static final Logger logger = LoggerFactory.getLogger(DemoApplication.class);
    private static final String BASE_PATH = "/home/rajat-bisht11/Desktop/demo/src/main/resourcesMyFolder/";

    @PostMapping(value="/deleteF", produces = "text/plain")
    public ResponseEntity<String> deleteFile(@RequestBody InputData inputData) {
        if (inputData == null || inputData.getMessage() == null) {
            logger.error("Invalid input data");
            return ResponseEntity.badRequest().body("Invalid input data");
        }

        String fileName = inputData.getMessage();
        Path filePath = Paths.get(BASE_PATH, fileName);

        logger.info("Attempting to delete file: {}", filePath.toAbsolutePath());

        try {
            if (Files.deleteIfExists(filePath)) {
                logger.info("File deleted successfully: {}", fileName);
                return ResponseEntity.ok("File deleted successfully: " + fileName);
            } else {
                logger.error("File not found: {}", fileName);
                return ResponseEntity.status(404).body("File not found: " + fileName);
            }
        } catch (SecurityException e) {
            logger.error("Security exception while deleting file: {}", fileName, e);
            return ResponseEntity.status(403).body("Permission denied: " + e.getMessage());
        } catch (IOException e) {
            logger.error("I/O exception while deleting file: {}", fileName, e);
            return ResponseEntity.internalServerError().body("Error deleting file: " + e.getMessage());
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
