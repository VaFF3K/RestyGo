package com.example.restygo.facade;

import com.example.restygo.dto.ReviewDTO;
import com.example.restygo.dto.ReviewResponseDTO;
import com.example.restygo.model.Dish;
import com.example.restygo.model.Review;
import com.example.restygo.model.Users;
import com.example.restygo.repository.DishRepository;
import com.example.restygo.repository.ReviewRepository;
import com.example.restygo.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewFacade {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private DishRepository dishRepository;

    @Autowired
    private UsersRepository usersRepository;

    public Review addReview(ReviewDTO reviewDTO, String userEmail) {
        Users user = usersRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));
        Dish dish = dishRepository.findById(reviewDTO.getDishId()).orElseThrow(() -> new RuntimeException("Dish not found"));

        Review review = new Review();
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());
        review.setUser(user);
        review.setDish(dish);

        return reviewRepository.save(review);
    }

    public List<ReviewResponseDTO> getAllReviews() {
        return reviewRepository.findAll().stream().map(review -> {
            ReviewResponseDTO dto = new ReviewResponseDTO();
            dto.setRating(review.getRating());
            dto.setComment(review.getComment());
            dto.setDishName(review.getDish().getName());
            dto.setUserName(review.getUser().getFullName());
            dto.setCreatedAt(LocalDateTime.parse(review.getCreatedAt().toString()));
            return dto;
        }).toList();
    }


    public List<ReviewResponseDTO> getReviewsForDishDTO(Long dishId) {
        Dish dish = dishRepository.findById(dishId).orElseThrow(() -> new RuntimeException("Dish not found"));
        return reviewRepository.findByDish(dish).stream()
                .map(review -> new ReviewResponseDTO(
                        review.getRating(),
                        review.getComment(),
                        review.getCreatedAt(),
                        review.getUser() != null ? review.getUser().getFullName() : "Анонім"
                ))
                .toList();
    }

}
