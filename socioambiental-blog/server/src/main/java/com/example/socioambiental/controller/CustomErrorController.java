package com.example.socioambiental.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
public class CustomErrorController implements ErrorController {

    private static final String ERROR_PATH = "/error";

    @RequestMapping("/")
    public ResponseEntity<String> home() {
        return ResponseEntity.ok("Welcome to the Socioambiental API. Use /posts to access posts.");
    }

    @GetMapping(ERROR_PATH)
    public ResponseEntity<String> handleError(HttpServletRequest request) {
        Object status = request.getAttribute("javax.servlet.error.status_code");
        if (status != null) {
            Integer statusCode = Integer.valueOf(status.toString());
            if (statusCode == HttpStatus.NOT_FOUND.value()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Custom 404 - Resource Not Found");
            } else if (statusCode == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Custom 500 - Internal Server Error");
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Custom Error");
    }

    public String getErrorPath() {
        return ERROR_PATH;
    }
}
