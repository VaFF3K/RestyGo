package com.example.restygo.repository;

import com.example.restygo.model.Order;
import com.example.restygo.model.OrderStatus;
import com.example.restygo.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserEmailOrderByCreatedAtDesc(String email);
    List<Order> findByUserOrderByCreatedAtDesc(Users user);
    List<Order> findByStatusIn(List<OrderStatus> aNew);
}
