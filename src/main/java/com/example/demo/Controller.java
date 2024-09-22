package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import java.nio.file.Files;
import java.io.IOException;


@RestController
public class Controller {

    @GetMapping(value = "/post", produces = MediaType.TEXT_HTML_VALUE)
    public String index() throws IOException {
        ClassPathResource htmlFile = new ClassPathResource("templates/index2.html");
        byte[] fileBytes = Files.readAllBytes(htmlFile.getFile().toPath());
        return new String(fileBytes);
    }

}