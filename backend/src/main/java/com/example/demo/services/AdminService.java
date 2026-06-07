package com.example.demo.services;
import com.example.demo.model.Admin;
import java.util.List;
import java.util.Optional;
public interface AdminService {
    Admin saveAdmin(Admin admin);
    List<Admin> getAllAdmins();
    Optional<Admin> getAdminById(int id);
    Optional<Admin> getAdminByUsername(String username);
    Admin updateAdmin(int id, Admin admin);
    void deleteAdmin(int id);
    boolean validateAdminLogin(String username, String password);
}
