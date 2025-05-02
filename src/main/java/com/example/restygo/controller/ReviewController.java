package com.example.restygo.controller;

import com.example.restygo.dto.ReviewDTO;
import com.example.restygo.dto.ReviewResponseDTO;
import com.example.restygo.facade.ReviewFacade;
import com.example.restygo.model.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewFacade reviewFacade;

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody ReviewDTO reviewDTO, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Не авторизовано");
        }

        String email = authentication.getName();
        Review saved = reviewFacade.addReview(reviewDTO, email);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public List<ReviewResponseDTO> getAllReviews() {
        return reviewFacade.getAllReviews();
    }


    @GetMapping("/dish/{dishId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsForDish(@PathVariable Long dishId) {
        List<ReviewResponseDTO> reviews = reviewFacade.getReviewsForDishDTO(dishId);
        return ResponseEntity.ok(reviews);
    }

}
