package com.example.restygo.controller;

import com.example.restygo.dto.PopularDishDTO;
import com.example.restygo.model.Dish;
import com.example.restygo.repository.DishRepository;
import com.example.restygo.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicDishController {

    @Autowired
    private DishRepository dishRepository;

//    @GetMapping("/menu")
//    public List<Dish> getMenu() {
//        return dishRepository.findAll(); // Публічно віддаємо всі позиції
//    }
    @GetMapping("/menu")
    public ResponseEntity<List<Dish>> getMenu() {
        return ResponseEntity.ok(dishRepository.findByArchivedFalse());
    }

//    @GetMapping("/menu/{id}")
//    public ResponseEntity<?> getDishById(@PathVariable Long id) {
//        Dish dish = dishRepository.findById(id).orElse(null);
//        if (dish == null) {
//            return ResponseEntity.notFound().build();
//        }
//        return ResponseEntity.ok(dish);
//    }

    @GetMapping("/menu/{id}")
    public ResponseEntity<?> getDishById(@PathVariable Long id) {
        return dishRepository.findById(id)
                .filter(d -> !d.isArchived())
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).body("Страву не знайдено"));
    }


    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/popular-dishes")
    public ResponseEntity<List<PopularDishDTO>> getTopDishes() {
        List<PopularDishDTO> topDishes = orderRepository.findTopDishes(PageRequest.of(0, 5));
        return ResponseEntity.ok(topDishes);
    }

}
