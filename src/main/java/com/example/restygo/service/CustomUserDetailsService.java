package com.example.restygo.service;

import com.example.restygo.model.Users;
import com.example.restygo.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsersRepository usersRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//        Users user = usersRepository.findByEmail(email)
//                .orElseThrow(() -> new UsernameNotFoundException("Користувача не знайдено"));
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Користувача не знайдено"));

        if (!user.isAvailable()) {
            throw new UsernameNotFoundException("Акаунт деактивовано або архівовано");
        }

//        return User.builder()
//                .username(user.getEmail())
//                .password(user.getPassword())
//                .roles(String.valueOf(Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))))
//                .build();
        return User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }
}
