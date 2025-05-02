package com.example.restygo.controller;

import com.example.restygo.dto.RegisterRequest;
import com.example.restygo.model.Role;
import com.example.restygo.model.Users;
import com.example.restygo.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminUserController {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/cooks")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Users> getAllCooks() {
        return usersRepository.findByRole(Role.COOK);
    }

    @PostMapping("/cooks")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> registerCook(@RequestBody RegisterRequest request) {
        if (usersRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(409).body("Користувач з таким email вже існує");
        }

        Users user = new Users();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.COOK);

        usersRepository.save(user);
        return ResponseEntity.ok("Кухар успішно зареєстрований");
    }
    @DeleteMapping("/cooks/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCook(@PathVariable Long id) {
        if (!usersRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        usersRepository.deleteById(id);
        return ResponseEntity.ok("Кухаря видалено");
    }
}
