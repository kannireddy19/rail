package com.railway.user.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.railway.user.service.UserService;
import com.railway.user.entity.User;

@Component("userSecurity")
public class UserSecurity {
    @Autowired
    private UserService userService;

    public boolean isSelf(Long id, String principal) {
        User user = userService.getUserById(id);
        return user.getUsername().equals(principal);
    }
} 