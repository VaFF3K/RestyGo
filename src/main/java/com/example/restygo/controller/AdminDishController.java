package com.example.restygo.controller;

import com.example.restygo.model.Dish;
import com.example.restygo.repository.DishRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dishes")
public class AdminDishController {

    @Autowired
    private DishRepository dishRepository;

    // 📄 Всі страви
    @GetMapping()
    public List<Dish> getAllDishes() {
        return dishRepository.findAll();
    }

    // ➕ Додати страву
    @PostMapping
    public ResponseEntity<?> addDish(@RequestBody Dish dish, Authentication authentication) {
        Dish savedDish = dishRepository.save(dish);
        System.out.println("Хто додає: " + authentication.getName());
        System.out.println(dish.getName());
        System.out.println(dish.getDescription());
        System.out.println(dish.getCategory());
        System.out.println(dish.getPrice());
        return ResponseEntity.ok(savedDish);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String uploadDir = "assets/";
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            Path path = Paths.get(uploadDir + fileName);
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());

            return ResponseEntity.ok(Map.of("fileName", fileName)); // ⬅️ ось це має бути!
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Помилка при завантаженні"));
        }
    }

//    @GetMapping("/assets/{filename}")
//    public ResponseEntity<Resource> getImage(@PathVariable String filename) throws IOException {
//        Path filePath = Paths.get("assets", filename);
//        Resource file = new UrlResource(filePath.toUri());
//
//        if (file.exists() || file.isReadable()) {
//            return ResponseEntity.ok().body(file);
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }

    // 🗑 Видалити страву
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDish(@PathVariable Long id) {
        if (!dishRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        dishRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
