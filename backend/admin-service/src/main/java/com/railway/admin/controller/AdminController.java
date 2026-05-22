package com.railway.admin.controller;

import com.railway.admin.dto.AdminResponseDTO;
import com.railway.admin.dto.LoginRequestDTO;

import com.railway.admin.entity.Admin;
import com.railway.admin.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/admins")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // Register Admin
    @PostMapping("/register")
    public ResponseEntity<AdminResponseDTO> registerAdmin(@Valid @RequestBody Admin admin) {
        Admin saved = adminService.registerAdmin(admin);
        AdminResponseDTO dto = new AdminResponseDTO(saved.getId(), saved.getUsername(), saved.getEmail(), "ADMIN");
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    // Login Admin (using DTO)
    @PostMapping("/login")
    public ResponseEntity<String> loginAdmin(@RequestBody LoginRequestDTO loginRequest) {
        String token = adminService.loginAdmin(loginRequest.getUsername(), loginRequest.getPassword());
        return ResponseEntity.ok(token); // This should return the JWT token
    }

    // Get Admin by ID
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<AdminResponseDTO> getAdminById(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        Long authenticatedAdminId = getAdminIdFromToken(authHeader);
        if (!authenticatedAdminId.equals(id)) {
            return ResponseEntity.status(403).build();
        }
        Admin admin = adminService.getAdminById(id);
        return ResponseEntity.ok(new AdminResponseDTO(admin.getId(), admin.getUsername(), admin.getEmail(), "ADMIN"));
    }

    // Update Admin
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<AdminResponseDTO> updateAdmin(@PathVariable Long id, @Valid @RequestBody Admin updatedAdmin, @RequestHeader("Authorization") String authHeader) {
        Long authenticatedAdminId = getAdminIdFromToken(authHeader);
        if (!authenticatedAdminId.equals(id)) {
            return ResponseEntity.status(403).build();
        }
        Admin updated = adminService.updateAdmin(id, updatedAdmin);
        AdminResponseDTO response = new AdminResponseDTO(updated.getId(), updated.getUsername(), updated.getEmail(), "ADMIN");
        return ResponseEntity.ok(response);
    }

    // Delete Admin
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAdmin(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        Long authenticatedAdminId = getAdminIdFromToken(authHeader);
        if (!authenticatedAdminId.equals(id)) {
            return ResponseEntity.status(403).build();
        }
        adminService.deleteAdmin(id);
        return ResponseEntity.ok("Admin deleted successfully");
    }

    // Get All Admins
    // Removed as per requirement

    private Long getAdminIdFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid Authorization header");
        }
        String token = authHeader.substring(7);
        return com.railway.admin.security.JwtUtil.extractAdminId(token);
    }
}
