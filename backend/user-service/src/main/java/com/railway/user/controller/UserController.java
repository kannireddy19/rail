package com.railway.user.controller;

import com.railway.user.dto.UserResponseDTO;
import com.railway.user.entity.User;
import com.railway.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "User API", description = "User management endpoints")
public class UserController {

    private final UserService userService;

    // ✅ New Endpoint: Check if User Exists
    @GetMapping("/exists/{id}")
    public ResponseEntity<Boolean> isUserExists(@PathVariable Long id) {
        return ResponseEntity.ok(userService.existsById(id));
    }

    // Register User (open to all)
    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(@Valid @RequestBody User user) {
        User savedUser = userService.registerUser(user);
        UserResponseDTO response = new UserResponseDTO(
            savedUser.getId(),
            savedUser.getUsername(),
            savedUser.getEmail(),
            savedUser.getRole()
        );
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Login User (open to all)
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User loginRequest) {
        String token = userService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());
        return ResponseEntity.ok(token);
    }

    // Get User by ID (user can get own info, admin can get any)
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isSelf(#id, principal)")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        UserResponseDTO response = new UserResponseDTO(user.getId(), user.getUsername(), user.getEmail(), user.getRole());
        return ResponseEntity.ok(response);
    }

    // Update User (user can update own info, admin can update any)
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isSelf(#id, principal)")
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long id, @Valid @RequestBody User user) {
        User updated = userService.updateUser(id, user);
        UserResponseDTO response = new UserResponseDTO(updated.getId(), updated.getUsername(), updated.getEmail(), updated.getRole());
        return ResponseEntity.ok(response);
    }

    // Delete User (user can delete own account, admin can delete any)
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isSelf(#id, principal)")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    // Get All Users (admin only)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    @Operation(summary = "Get all users")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserResponseDTO> response = users.stream()
            .map(u -> new UserResponseDTO(u.getId(), u.getUsername(), u.getEmail(), u.getRole()))
            .toList();
        return ResponseEntity.ok(response);
    }
}
