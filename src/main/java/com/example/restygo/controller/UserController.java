package com.example.restygo.controller;

import com.example.restygo.dto.RegisterRequest;
import com.example.restygo.model.Role;
import com.example.restygo.model.Users;
import com.example.restygo.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@SessionAttributes("SPRING_SECURITY_CONTEXT")
public class UserController {

    @Autowired
    private UsersRepository usersRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        System.out.println("AUTH: " + authentication); // DEBUG!

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Не авторизовано");
        }

        String email = authentication.getName();
        Users user = usersRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).body("Користувача не знайдено");
        }

        return ResponseEntity.ok(Map.of(
                "fullName", user.getFullName(),
                "email", user.getEmail(),
                "role", user.getRole().name()
        ));
    }



}

