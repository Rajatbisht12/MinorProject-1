package com.example.demo;

import java.io.File;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class folderCreator {
    public static final Logger logger = LoggerFactory.getLogger(DemoApplication.class);


    @PostMapping(value="/createF")
    public ResponseEntity<String> createFolder(@RequestBody InputName inputName){
        if (inputName == null || inputName.getMessage() == null) {
            logger.error("Invalid input data");
            return ResponseEntity.badRequest().body("Invalid input data");
        }

        String folderName = inputName.getMessage().toUpperCase();
        logger.info("Attempting to create file: {}", folderName);
        String path = "/home/rajat-bisht11/Downloads/demo/src/main/resourcesMyFolder/";
        path = path + folderName;
        File f = new File(path);

        try {
            if(f.exists()){
                logger.info("Folder already exists: {}", folderName);
                return ResponseEntity.ok("Folder already exists: " + folderName);
            }

            if(f.mkdirs()){
                logger.info("Folder created successfully: {}", folderName);
                return ResponseEntity.ok("Folder created: " + folderName);
            }else {
                logger.error("Failed to create folder: {}", folderName);
                return ResponseEntity.internalServerError().body("Failed to create folder: " + folderName);
            }
        }catch (SecurityException e) {
            logger.error("Security exception when creating file: " + folderName, e);
            return ResponseEntity.status(403).body("Permission denied: " + e.getMessage());
        }
    }

    public static class InputName {
        private String message;
        public InputName(){}

        public String getMessage(){
            return message;
        }
        public void setMessage(String message){
            this.message = message;
        }
    }
}
