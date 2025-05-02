package com.example.restygo.repository;

import com.example.restygo.model.Review;
import com.example.restygo.model.Dish;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByDish(Dish dish);
}
