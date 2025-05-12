package com.example.restygo.controller;

import com.example.restygo.dto.OrderItemDTO;
import com.example.restygo.dto.OrderRequestDTO;
import com.example.restygo.dto.OrderResponseDTO;
import com.example.restygo.model.*;
import com.example.restygo.repository.DishRepository;
import com.example.restygo.repository.OrderRepository;
import com.example.restygo.repository.UsersRepository;
import com.example.restygo.strategy.OrderStatusStrategy;
import com.example.restygo.strategy.OrderStatusStrategyFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private DishRepository dishRepository;

    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private OrderStatusStrategyFactory orderStatusStrategyFactory;

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
//    @DeleteMapping("/{orderId}")
//    public ResponseEntity<?> cancelOrder(@PathVariable Long orderId, Authentication authentication) {
//        if (authentication == null || !authentication.isAuthenticated()) {
//            return ResponseEntity.status(401).body("Не авторизовано");
//        }
//
//        String email = authentication.getName();
//        Users user = usersRepository.findByEmail(email).orElse(null);
//
//        if (user == null) {
//            return ResponseEntity.status(404).body("Користувача не знайдено");
//        }
//
//        Order order = orderRepository.findById(orderId).orElse(null);
//        if (order == null || !order.getUser().getId().equals(user.getId())) {
//            return ResponseEntity.status(404).body("Замовлення не знайдено або не ваше");
//        }
//
//        if (order.getStatus() != OrderStatus.NEW) {
//            return ResponseEntity.badRequest().body("Скасування можливе лише для замовлень зі статусом NEW");
//        }
//
//        orderRepository.delete(order);
//        return ResponseEntity.ok("Замовлення №" + orderId + " було скасовано");
//    }
@PutMapping("/{orderId}/issue")
public ResponseEntity<String> issueOrder(@PathVariable Long orderId) {
    Optional<Order> optionalOrder = orderRepository.findById(orderId);
    if (optionalOrder.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    Order order = optionalOrder.get();

    if (order.getStatus() != OrderStatus.NEW) {
        return ResponseEntity.badRequest().body("Замовлення не є новим і більше не може бути скасованим");
    }

    OrderStatusStrategy strategy = orderStatusStrategyFactory.getStrategy(order.getStatus(), OrderStatus.CANCELLED);
    if (strategy == null) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("No strategy defined for this status transition.");
    }

    strategy.updateStatus(order);
    orderRepository.save(order);

    return ResponseEntity.ok("Замовлення №" + orderId + " було скасовано");
}



    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping
    public ResponseEntity<?> getAllOrders() {
        List<Order> orders = orderRepository.findAll();

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
