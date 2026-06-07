package com.example.demo.services;
import com.example.demo.model.Manager;
import java.util.List;
import java.util.Optional;
public interface ManagerService {
    Manager saveManager(Manager m);
    List<Manager> getAllManagers();
    Optional<Manager> getManagerById(Long id);
    Optional<Manager> getManagerByUsername(String username);
    Manager updateManager(Long id, Manager m);
    void deleteManager(Long id);
    boolean validateManagerLogin(String username, String password);
}
