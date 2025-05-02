// Наприклад, у DishPublicController.java або в існуючому DishController
package com.example.restygo.controller;

import com.example.restygo.model.Dish;
import com.example.restygo.repository.DishRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicDishController {

    @Autowired
    private DishRepository dishRepository;

    @GetMapping("/menu")
    public List<Dish> getMenu() {
        return dishRepository.findAll(); // Публічно віддаємо всі позиції
    }

    @GetMapping("/menu/{id}")
    public ResponseEntity<?> getDishById(@PathVariable Long id) {
        Dish dish = dishRepository.findById(id).orElse(null);
        if (dish == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dish);
    }

}
