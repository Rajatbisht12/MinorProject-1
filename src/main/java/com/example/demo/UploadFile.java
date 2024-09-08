package com.example.demo;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
@RestController
public class UploadFile {

    private static final Logger logger = LoggerFactory.getLogger(UploadFile.class);
    private static final String BASE_UPLOAD_DIR = "/home/rajat-bisht11/Downloads/demo/src/main/resourcesMyFolder/"; // Base directory for uploads

    @PutMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("folder") String folder) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file to upload");
        }

        // Sanitize the folder name to prevent directory traversal attacks
        String sanitizedFolder = folder.replaceAll("[^a-zA-Z0-9-_]", "_");

        try {
            String uploadDir = BASE_UPLOAD_DIR + sanitizedFolder + "/";
            logger.info("Upload directory: {}", uploadDir);

            // Get the file name
            String fileName = file.getOriginalFilename();
            logger.info("Uploading file: {}", fileName);

            // Create the upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Save the file to the upload directory
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            return ResponseEntity.ok("File uploaded successfully to folder '" + sanitizedFolder + "': " + fileName);
        } catch (IOException e) {
            logger.error("Could not upload the file", e);
            return ResponseEntity.internalServerError().body("Could not upload the file: " + e.getMessage());
        }
    }
}
