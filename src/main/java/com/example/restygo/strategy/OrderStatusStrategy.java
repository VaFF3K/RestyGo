package com.example.restygo.strategy;

import com.example.restygo.model.Order;

public interface OrderStatusStrategy {
    void updateStatus(Order order);
}
