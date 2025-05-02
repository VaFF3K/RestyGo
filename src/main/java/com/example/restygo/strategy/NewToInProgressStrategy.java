package com.example.restygo.strategy;

import com.example.restygo.model.Order;
import com.example.restygo.model.OrderStatus;
import org.springframework.stereotype.Component;

@Component
public class NewToInProgressStrategy implements OrderStatusStrategy {
    @Override
    public void updateStatus(Order order) {
        order.setStatus(OrderStatus.IN_PROGRESS);
    }
}
