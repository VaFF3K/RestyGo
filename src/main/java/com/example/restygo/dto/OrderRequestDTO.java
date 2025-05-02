package com.example.restygo.dto;

import java.util.List;

public class OrderRequestDTO {
    private List<OrderItemDTO> items;
    private String comment;

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
