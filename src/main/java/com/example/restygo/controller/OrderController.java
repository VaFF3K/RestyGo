package com.example.restygo.controller;

import com.example.restygo.dto.OrderItemDTO;
import com.example.restygo.dto.OrderRequestDTO;
import com.example.restygo.dto.OrderResponseDTO;
import com.example.restygo.model.*;
import com.example.restygo.repository.DishRepository;
import com.example.restygo.repository.OrderRepository;
import com.example.restygo.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private DishRepository dishRepository;

    @Autowired
    private UsersRepository usersRepository;

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequestDTO request, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Не авторизовано");
        }

        String email = authentication.getName();
        Users user = usersRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).body("Користувача не знайдено");
        }

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.NEW);
        order.setCreatedAt(LocalDateTime.now());
        order.setCustomerName(user.getFullName());
        order.setCustomerMail(user.getEmail());
        order.setComment(request.getComment()); // ✅ зберігаємо загальний коментар

        double totalPrice = 0;

        for (OrderItemDTO dto : request.getItems()) {
            Dish dish = dishRepository.findById(dto.getDishId()).orElse(null);
            if (dish != null) {
                OrderItem item = new OrderItem();
                item.setDish(dish);
                item.setQuantity(dto.getQuantity());
                item.setOrder(order);
                order.getItems().add(item);

                totalPrice += dish.getPrice() * dto.getQuantity();
            }
        }

        order.setTotalPrice(totalPrice);

        Order saved = orderRepository.save(order);
        return ResponseEntity.ok("Замовлення №" + saved.getId() + " оформлено успішно");
    }
    @GetMapping("/my")
    public ResponseEntity<?> getMyOrders(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Не авторизовано");
        }

        String email = authentication.getName();
        Users user = usersRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).body("Користувача не знайдено");
        }

        List<Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(user);

        List<OrderResponseDTO> dtos = orders.stream().map(order -> new OrderResponseDTO(
                order.getId(),
                order.getStatus().name(),
                order.getTotalPrice(),
                order.getComment(),
                order.getCreatedAt(),
                order.getItems().stream().map(item ->
                        new OrderResponseDTO.ItemDTO(
                                item.getDish().getName(),
                                item.getQuantity(),
                                item.getDish().getPrice()
                        )
                ).toList()
        )).toList();

        return ResponseEntity.ok(dtos);
    }






}
