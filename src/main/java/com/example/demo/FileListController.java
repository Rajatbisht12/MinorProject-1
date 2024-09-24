package com.example.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@SpringBootApplication
@RestController
public class FileListController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @GetMapping("/list")
    public ResponseEntity<Map<String, List<String>>> listFilesAndFolders(@RequestParam String path) {
        try {
            File directory = new File(uploadDir + File.separator + path);
            
            if (!directory.exists() || !directory.isDirectory()) {
                return ResponseEntity.badRequest().body(Map.of("error", List.of("Invalid directory path")));
            }

            File[] files = directory.listFiles();
            if (files == null) {
                return ResponseEntity.ok(Map.of("files", List.of(), "folders", List.of()));
            }

            List<String> fileList = Arrays.stream(files)
                .filter(File::isFile)
                .map(File::getName)
                .collect(Collectors.toList());

            List<String> folderList = Arrays.stream(files)
                .filter(File::isDirectory)
                .map(File::getName)
                .collect(Collectors.toList());

            Map<String, List<String>> result = new HashMap<>();
            result.put("files", fileList);
            result.put("folders", folderList);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", List.of(e.getMessage())));
        }
    }
}
