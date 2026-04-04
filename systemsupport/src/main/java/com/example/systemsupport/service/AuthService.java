package com.example.systemsupport.service;

import com.example.systemsupport.entity.User;
import com.example.systemsupport.repository.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Signup a new user with validated inputs.
     * Returns a map with userId, name, role on success.
     * Throws IllegalArgumentException on validation failure.
     */
    public Map<String, Object> signup(String name, String email, String password, String mobileNumber) {

        // Validate name
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }

        // Validate email
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Validate mobile number: exactly 10 digits
        if (mobileNumber == null || !mobileNumber.matches("^\\d{10}$")) {
            throw new IllegalArgumentException("Mobile number must be exactly 10 digits");
        }
        if (userRepository.existsByMobileNumber(mobileNumber)) {
            throw new IllegalArgumentException("Mobile number already exists");
        }

        // Validate password: min 8 chars, 1 uppercase, 1 lowercase, 1 number
        if (password == null || password.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters");
        }
        if (!password.matches(".*[A-Z].*")) {
            throw new IllegalArgumentException("Password must contain at least 1 uppercase letter");
        }
        if (!password.matches(".*[a-z].*")) {
            throw new IllegalArgumentException("Password must contain at least 1 lowercase letter");
        }
        if (!password.matches(".*\\d.*")) {
            throw new IllegalArgumentException("Password must contain at least 1 number");
        }

        // Hash password and save
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(BCrypt.hashpw(password, BCrypt.gensalt()));
        user.setMobileNumber(mobileNumber);
        user.setRole("USER");

        User saved = userRepository.save(user);

        Map<String, Object> result = new HashMap<>();
        result.put("userId", saved.getId());
        result.put("name", saved.getName());
        result.put("role", saved.getRole());
        return result;
    }

    /**
     * Login with email and password.
     * Returns user info on success.
     * Throws IllegalArgumentException on invalid credentials.
     */
    public Map<String, Object> login(String email, String password) {

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        User user = userOpt.get();
        if (!BCrypt.checkpw(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("userId", user.getId());
        result.put("name", user.getName());
        result.put("role", user.getRole());
        return result;
    }
}
