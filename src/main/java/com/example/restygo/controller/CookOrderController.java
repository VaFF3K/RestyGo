package com.example.restygo.controller;

import com.example.restygo.dto.CookOrderDTO;
import com.example.restygo.dto.OrderItemDTO;
import com.example.restygo.model.Order;
import com.example.restygo.model.OrderStatus;
import com.example.restygo.model.Users;
import com.example.restygo.repository.OrderRepository;
import com.example.restygo.repository.UsersRepository;
import com.example.restygo.strategy.OrderStatusStrategy;
import com.example.restygo.strategy.OrderStatusStrategyFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/cook/orders")
@PreAuthorize("hasRole('COOK')")
public class CookOrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderStatusStrategyFactory statusStrategyFactory;

    @Autowired
    private UsersRepository usersRepository;

    @GetMapping
    public List<CookOrderDTO> getOrdersForCook(@RequestParam(defaultValue = "NEW,IN_PROGRESS") String status) {
        List<OrderStatus> statuses = Arrays.stream(status.split(","))
                .map(String::trim)
                .map(OrderStatus::valueOf)
                .toList();

        List<Order> orders = orderRepository.findByStatusIn(statuses);

        return orders.stream().map(order -> {
            CookOrderDTO dto = new CookOrderDTO();
            dto.setId(order.getId());
            dto.setCustomerName(order.getUser().getFullName());
            dto.setComment(order.getComment());
            dto.setCreatedAt(order.getCreatedAt());
            dto.setTotalPrice(order.getTotalPrice());
            dto.setStatus(order.getStatus().name());
            dto.setCookName(order.getCook() != null ? order.getCook().getFullName() : null);

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

    @PostMapping("/{orderId}/status")
    public ResponseEntity<?> changeOrderStatus(@PathVariable Long orderId,
                                               @RequestParam String newStatus,
                                               Authentication authentication) {

        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        Users currentCook = usersRepository.findByEmail(authentication.getName()).orElse(null);

        if (currentCook == null) {
            return ResponseEntity.status(401).body("Не вдалося визначити кухаря");
        }

        OrderStatus targetStatus = OrderStatus.valueOf(newStatus);

        // 🔒 Захист від чужих замовлень
        if (order.getStatus() == OrderStatus.IN_PROGRESS && order.getCook() != null
                && !order.getCook().getId().equals(currentCook.getId())) {
            return ResponseEntity.badRequest().body("За це замовлення вже взявся інший кухар: " +
                    order.getCook().getFullName());
        }


        // ✅ Присвоїти замовлення кухарю якщо тільки починає готувати
        if (targetStatus == OrderStatus.IN_PROGRESS) {
            order.setCook(currentCook);

        }

        OrderStatusStrategy strategy = statusStrategyFactory.getStrategy(order.getStatus(), targetStatus);
        if (strategy == null) {
            return ResponseEntity.badRequest().body("Перехід статусу не дозволений");
        }

        strategy.updateStatus(order);
        orderRepository.save(order);

        return ResponseEntity.ok("Статус оновлено до " + newStatus);
    }

}
