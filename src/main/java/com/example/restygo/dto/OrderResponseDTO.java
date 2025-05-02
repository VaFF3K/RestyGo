package com.example.restygo.dto;

import java.time.LocalDateTime;
import java.util.List;

public class OrderResponseDTO {
    private Long id;
    private String status;
    private double totalPrice;
    private String comment;
    private LocalDateTime createdAt;
    private List<ItemDTO> items;

    public static class ItemDTO {
        private String name;
        private int quantity;
        private double price;

        public ItemDTO(String name, int quantity, double price) {
            this.name = name;
            this.quantity = quantity;
            this.price = price;
        }

        // геттери
        public String getName() { return name; }
        public int getQuantity() { return quantity; }
        public double getPrice() { return price; }
    }

    public OrderResponseDTO(Long id, String status, double totalPrice, String comment, LocalDateTime createdAt, List<ItemDTO> items) {
        this.id = id;
        this.status = status;
        this.totalPrice = totalPrice;
        this.comment = comment;
        this.createdAt = createdAt;
        this.items = items;
    }

    // геттери
    public Long getId() { return id; }
    public String getStatus() { return status; }
    public double getTotalPrice() { return totalPrice; }
    public String getComment() { return comment; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<ItemDTO> getItems() { return items; }
}
