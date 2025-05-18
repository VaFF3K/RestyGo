package com.example.restygo.repository;

import com.example.restygo.dto.PopularDishDTO;
import com.example.restygo.model.Order;
import com.example.restygo.model.OrderStatus;
import com.example.restygo.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.domain.Pageable;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserEmailOrderByCreatedAtDesc(String email);
    List<Order> findByUserOrderByCreatedAtDesc(Users user);
    List<Order> findByStatusIn(List<OrderStatus> aNew);

//    @Query("SELECT new com.example.restygo.dto.PopularDishDTO(oi.dish.id, oi.dish.name, oi.dish.description, oi.dish.imageName, SUM(oi.quantity)) " +
//            "FROM OrderItem oi GROUP BY oi.dish.id, oi.dish.name, oi.dish.description, oi.dish.imageName " +
//            "ORDER BY SUM(oi.quantity) DESC")
//    List<PopularDishDTO> findTopDishes(Pageable pageable);
@Query("SELECT new com.example.restygo.dto.PopularDishDTO(oi.dish.id, oi.dish.name, oi.dish.description, oi.dish.imageName, SUM(oi.quantity)) " +
        "FROM OrderItem oi " +
        "WHERE oi.dish.archived = false " +
        "GROUP BY oi.dish.id, oi.dish.name, oi.dish.description, oi.dish.imageName " +
        "ORDER BY SUM(oi.quantity) DESC")
List<PopularDishDTO> findTopDishes(Pageable pageable);


}
