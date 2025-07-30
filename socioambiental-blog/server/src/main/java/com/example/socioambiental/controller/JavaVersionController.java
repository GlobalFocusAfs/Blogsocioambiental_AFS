package com.example.socioambiental.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JavaVersionController {

    @GetMapping("/java-version")
    public String getJavaVersion() {
        return System.getProperty("java.version") + " - " + System.getProperty("java.vendor");
    }
}
