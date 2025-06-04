package com.example.restygo.tests;

import com.example.restygo.controller.CookOrderController;
import com.example.restygo.model.Order;
import com.example.restygo.model.OrderStatus;
import com.example.restygo.model.Users;
import com.example.restygo.repository.OrderRepository;
import com.example.restygo.repository.UsersRepository;
import com.example.restygo.strategy.OrderStatusStrategy;
import com.example.restygo.strategy.OrderStatusStrategyFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CookOrderControllerTest {

    @InjectMocks
    private CookOrderController cookOrderController;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UsersRepository usersRepository;

    @Mock
    private OrderStatusStrategyFactory strategyFactory;

    @Mock
    private OrderStatusStrategy strategy;

    @Mock
    private Authentication authentication;

    @Test
    void testChangeOrderStatus_success() {
        Long orderId = 1L;
        String newStatus = "IN_PROGRESS";

        Users cook = new Users();
        cook.setId(1L);
        cook.setFullName("Chef John");

        Order order = new Order();
        order.setId(orderId);
        order.setStatus(OrderStatus.NEW);

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
        when(authentication.getName()).thenReturn("cook@example.com");
        when(usersRepository.findByEmail("cook@example.com")).thenReturn(Optional.of(cook));
        when(strategyFactory.getStrategy(OrderStatus.NEW, OrderStatus.IN_PROGRESS)).thenReturn(strategy);

        ResponseEntity<?> response = cookOrderController.changeOrderStatus(orderId, newStatus, authentication);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Статус оновлено до IN_PROGRESS", response.getBody());
        verify(orderRepository).save(order);
        verify(strategy).updateStatus(order);
    }

    @Test
    void testChangeOrderStatus_orderNotFound() {
        when(orderRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = cookOrderController.changeOrderStatus(1L, "IN_PROGRESS", authentication);

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testChangeOrderStatus_invalidTransition() {
        Order order = new Order();
        order.setId(1L);
        order.setStatus(OrderStatus.NEW);

        Users cook = new Users();
        cook.setId(1L);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(authentication.getName()).thenReturn("cook@example.com");
        when(usersRepository.findByEmail("cook@example.com")).thenReturn(Optional.of(cook));
        when(strategyFactory.getStrategy(OrderStatus.NEW, OrderStatus.READY)).thenReturn(null);

        ResponseEntity<?> response = cookOrderController.changeOrderStatus(1L, "READY", authentication);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Перехід статусу не дозволений", response.getBody());
    }
}
