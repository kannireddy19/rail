package com.railway.admin.service;

import com.railway.admin.entity.Admin;
import com.railway.admin.exception.AdminNotFoundException;
import com.railway.admin.repository.AdminRepository;
import com.railway.admin.security.JwtUtil;
import feign.FeignException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Register Admin
    public Admin registerAdmin(@Valid Admin admin) {
        if (adminRepository.findByUsername(admin.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }

        if (adminRepository.findByEmail(admin.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        return adminRepository.save(admin);
    }

    // Login Admin (returns JWT token)
    public String loginAdmin(String username, String password) {
        Admin admin = adminRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Admin not found"));

        // Use passwordEncoder to check the password
        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Generate JWT with adminId, username and role "ADMIN"
        return JwtUtil.generateToken(admin.getId(), admin.getUsername(), "ADMIN");
    }

    // Get Admin by ID
    public Admin getAdminById(Long id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new AdminNotFoundException("Admin not found with ID: " + id));
    }

    // Update Admin
    public Admin updateAdmin(Long id, @Valid Admin updatedAdmin) {
        Admin existingAdmin = getAdminById(id);
        existingAdmin.setUsername(updatedAdmin.getUsername());
        existingAdmin.setEmail(updatedAdmin.getEmail());

        if (updatedAdmin.getPassword() != null && !updatedAdmin.getPassword().isBlank()) {
            existingAdmin.setPassword(passwordEncoder.encode(updatedAdmin.getPassword()));
        }

        return adminRepository.save(existingAdmin);
    }

    // Delete Admin
    public void deleteAdmin(Long id) {
        getAdminById(id);
        adminRepository.deleteById(id);
    }

    // Get All Admins
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }
}
