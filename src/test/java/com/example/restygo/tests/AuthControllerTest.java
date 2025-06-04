package com.example.restygo.tests;

import com.example.restygo.controller.AuthController;
import com.example.restygo.dto.LoginRequest;
import com.example.restygo.dto.RegisterRequest;
import com.example.restygo.model.Users;
import com.example.restygo.repository.UsersRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @Mock private PasswordEncoder passwordEncoder;
    @Mock private UsersRepository usersRepository;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private HttpServletRequest httpServletRequest;
    @Mock private HttpServletResponse httpServletResponse;
    @Mock private Authentication authentication;

    @InjectMocks private AuthController authController;

    public AuthControllerTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Test User");
        request.setEmail("test@example.com");
        request.setPassword("password");

        HttpSession mockSession = mock(HttpSession.class);

        when(usersRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(httpServletRequest.getSession(true)).thenReturn(mockSession);  // 🧩 ВАЖЛИВЕ ДОПОВНЕННЯ

        ResponseEntity<?> response = authController.register(request, httpServletRequest);

        assertEquals(200, response.getStatusCodeValue());
        verify(usersRepository).save(any(Users.class));
    }

    @Test
    void testRegisterUserAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@example.com");

        when(usersRepository.findByEmail("existing@example.com")).thenReturn(Optional.of(new Users()));

        ResponseEntity<?> response = authController.register(request, httpServletRequest);

        assertEquals(409, response.getStatusCodeValue());
    }

    @Test
    void testLoginFailure() {
        LoginRequest request = new LoginRequest();
        request.setEmail("user@example.com");
        request.setPassword("wrongpassword");

        when(authenticationManager.authenticate(any())).thenThrow(new RuntimeException("Invalid credentials"));

        ResponseEntity<?> response = authController.login(request, httpServletRequest, httpServletResponse);

        assertEquals(401, response.getStatusCodeValue());
    }
}
