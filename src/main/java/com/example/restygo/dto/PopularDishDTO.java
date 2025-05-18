package com.example.restygo.dto;

public class PopularDishDTO {
    private Long dishId;
    private String name;
    private String description;
    private String imageName;

    private Long timesOrdered;

    public PopularDishDTO(Long dishId, String name, String description, String imageName,  Long timesOrdered) {
        this.dishId = dishId;
        this.name = name;
        this.description = description;
        this.imageName = imageName;
        this.timesOrdered = timesOrdered;
    }

    public Long getDishId() {
        return dishId;
    }

    public String getName() {
        return name;
    }
    public String getDescription() {
        return description;
    }

    public String getImageName() {
        return imageName;
    }



    public Long getTimesOrdered() {
        return timesOrdered;
    }


}
