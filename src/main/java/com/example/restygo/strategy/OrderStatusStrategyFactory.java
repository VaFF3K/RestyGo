package com.example.restygo.strategy;

import com.example.restygo.model.OrderStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class OrderStatusStrategyFactory {

    private final Map<String, OrderStatusStrategy> strategies = new HashMap<>();

    @Autowired
    public OrderStatusStrategyFactory(NewToInProgressStrategy newToInProgress,
                                      InProgressToReadyStrategy inProgressToReady) {
        strategies.put("NEW->IN_PROGRESS", newToInProgress);
        strategies.put("IN_PROGRESS->READY", inProgressToReady);
    }

    public OrderStatusStrategy getStrategy(OrderStatus current, OrderStatus target) {
        return strategies.get(current.name() + "->" + target.name());
    }
}
