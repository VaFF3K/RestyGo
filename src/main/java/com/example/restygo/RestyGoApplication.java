package com.example.restygo;

import com.example.restygo.model.Role;
import com.example.restygo.model.Users;
import com.example.restygo.repository.UsersRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class RestyGoApplication {

    public static void main(String[] args) {
        SpringApplication.run(RestyGoApplication.class, args);
    }
//    @Bean
//    CommandLineRunner init(UsersRepository repo, PasswordEncoder encoder) {
//        return args -> {
//            if (repo.findByEmail("admin@restygo.com").isEmpty()) {
//                Users admin = new Users();
//                admin.setFullName("Super Admin");
//                admin.setEmail("admin@restygo.com");
//                admin.setPassword(encoder.encode("admin123"));
//                admin.setRole(Role.ADMIN);
//                repo.save(admin);
//            }
//        };
//    }
}