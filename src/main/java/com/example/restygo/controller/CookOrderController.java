package com.example.restygo.controller;

import com.example.restygo.dto.CookOrderDTO;
import com.example.restygo.dto.OrderItemDTO;
import com.example.restygo.model.Order;
import com.example.restygo.model.OrderStatus;
import com.example.restygo.repository.OrderRepository;
import com.example.restygo.strategy.OrderStatusStrategy;
import com.example.restygo.strategy.OrderStatusStrategyFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cook/orders")
@PreAuthorize("hasRole('COOK')")
public class CookOrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderStatusStrategyFactory statusStrategyFactory;

    // Отримати всі замовлення для кухаря
    @GetMapping
    public List<CookOrderDTO> getOrdersForCook() {
        List<Order> orders = orderRepository.findByStatusIn(List.of(OrderStatus.NEW, OrderStatus.IN_PROGRESS));
        return orders.stream().map(order -> {
            CookOrderDTO dto = new CookOrderDTO();
            dto.setId(order.getId());
            dto.setCustomerName(order.getCustomerName());
            dto.setComment(order.getComment());
            dto.setCreatedAt(order.getCreatedAt());
            dto.setTotalPrice(order.getTotalPrice());
            dto.setStatus(order.getStatus().name());

            List<OrderItemDTO> itemDTOs = order.getItems().stream().map(item -> {
                OrderItemDTO i = new OrderItemDTO();
                i.setDishId(item.getDish().getId());
                i.setDishName(item.getDish().getName());
                i.setQuantity(item.getQuantity());
                return i;
            }).toList();

            dto.setItems(itemDTOs);
            return dto;
        }).toList();
    }


    // Змінити статус замовлення
    @PostMapping("/{orderId}/status")
    public ResponseEntity<?> changeOrderStatus(@PathVariable Long orderId, @RequestParam String newStatus) {
        Order order = orderRepository.findById(orderId).orElse(null);

        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        OrderStatusStrategy strategy = statusStrategyFactory.getStrategy(order.getStatus(), OrderStatus.valueOf(newStatus));
        if (strategy == null) {
            return ResponseEntity.badRequest().body("Перехід статусу не дозволений");
        }

        strategy.updateStatus(order);
        orderRepository.save(order);

        return ResponseEntity.ok("Статус оновлено до " + newStatus);
    }
}
