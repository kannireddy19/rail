package com.railway.admin;

import com.railway.admin.entity.Admin;
import com.railway.admin.exception.AdminNotFoundException;
import com.railway.admin.repository.AdminRepository;
import com.railway.admin.service.AdminService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminServiceApplicationTests {

    @Mock
    private AdminRepository adminRepository;

    @InjectMocks
    private AdminService adminService;

    private Admin admin;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        admin = new Admin(1L, "adminUser", "admin@example.com", encoder.encode("password123"));
    }

    // ✅ Positive Test Case - Register Admin
    @Test
    void registerAdmin_ShouldReturnAdmin_WhenValidDataProvided() {
        when(adminRepository.findByUsername(admin.getUsername())).thenReturn(Optional.empty());
        when(adminRepository.findByEmail(admin.getEmail())).thenReturn(Optional.empty());
        when(adminRepository.save(any(Admin.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Admin inputAdmin = new Admin(null, "adminUser", "admin@example.com", "password123");
        Admin savedAdmin = adminService.registerAdmin(inputAdmin);

        assertNotNull(savedAdmin);
        assertEquals("adminUser", savedAdmin.getUsername());
        assertEquals("admin@example.com", savedAdmin.getEmail());
    }

    // ❌ Negative Test Case - Register with Duplicate Username
    @Test
    void registerAdmin_ShouldThrowException_WhenUsernameExists() {
        when(adminRepository.findByUsername("adminUser")).thenReturn(Optional.of(admin));

        assertThrows(IllegalArgumentException.class, () -> adminService.registerAdmin(admin));
    }

    // ✅ Positive Test Case - Get Admin by ID
    @Test
    void getAdminById_ShouldReturnAdmin_WhenAdminExists() {
        when(adminRepository.findById(1L)).thenReturn(Optional.of(admin));

        Admin foundAdmin = adminService.getAdminById(1L);

        assertEquals("adminUser", foundAdmin.getUsername());
    }

    // ❌ Negative Test Case - Get Admin by Non-existent ID
    @Test
    void getAdminById_ShouldThrowException_WhenAdminNotFound() {
        when(adminRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(AdminNotFoundException.class, () -> adminService.getAdminById(99L));
    }

    // ✅ Positive Test Case - Login Admin
    @Test
    void loginAdmin_ShouldReturnSuccess_WhenValidCredentials() {
        when(adminRepository.findByUsername("adminUser")).thenReturn(Optional.of(admin));

        String result = adminService.loginAdmin("adminUser", "password123");

        assertNotNull(result);
        assertTrue(result.contains("token") || result.length() > 10); // basic check
    }

    // ❌ Negative Test Case - Login with Wrong Password
    @Test
    void loginAdmin_ShouldThrowException_WhenInvalidPassword() {
        when(adminRepository.findByUsername("adminUser")).thenReturn(Optional.of(admin));

        assertThrows(RuntimeException.class, () -> adminService.loginAdmin("adminUser", "wrongPassword"));
    }

    // ✅ Positive Test Case - Update Admin
    @Test
    void updateAdmin_ShouldReturnUpdatedAdmin_WhenValidDataProvided() {
        Admin updatedAdmin = new Admin(1L, "adminUserUpdated", "adminupdated@example.com", "newPassword123");
        when(adminRepository.findById(1L)).thenReturn(Optional.of(admin));
        when(adminRepository.save(any(Admin.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Admin result = adminService.updateAdmin(1L, updatedAdmin);

        assertEquals("adminUserUpdated", result.getUsername());
        assertEquals("adminupdated@example.com", result.getEmail());
    }

    // ❌ Negative Test Case - Update Admin with Non-existent ID
    @Test
    void updateAdmin_ShouldThrowException_WhenAdminNotFound() {
        Admin updatedAdmin = new Admin(1L, "adminUserUpdated", "adminupdated@example.com", "newPassword123");
        when(adminRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(AdminNotFoundException.class, () -> adminService.updateAdmin(1L, updatedAdmin));
    }

    // ✅ Positive Test Case - Delete Admin
    @Test
    void deleteAdmin_ShouldDeleteAdmin_WhenAdminExists() {
        when(adminRepository.findById(1L)).thenReturn(Optional.of(admin));

        assertDoesNotThrow(() -> adminService.deleteAdmin(1L));

        verify(adminRepository, times(1)).deleteById(1L);
    }

    // ❌ Negative Test Case - Delete Admin with Non-existent ID
    @Test
    void deleteAdmin_ShouldThrowException_WhenAdminNotFound() {
        when(adminRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(AdminNotFoundException.class, () -> adminService.deleteAdmin(99L));
    }
}
