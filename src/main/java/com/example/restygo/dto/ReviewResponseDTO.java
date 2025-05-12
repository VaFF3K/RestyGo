package com.example.restygo.dto;

import java.time.LocalDateTime;

public class ReviewResponseDTO {
    private long id;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;

    private String userName;
    private String dishName;

    public ReviewResponseDTO() {
    }

    public ReviewResponseDTO(int rating, String comment, LocalDateTime createdAt, String userName) {
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
        this.userName = userName;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getDishName() {
        return dishName;
    }

    public void setDishName(String dishName) {
        this.dishName = dishName;
    }
}
