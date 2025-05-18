package com.example.restygo.repository;

import com.example.restygo.model.Dish;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DishRepository extends JpaRepository<Dish, Long> {
    List<Dish> findByArchivedFalse();

}
