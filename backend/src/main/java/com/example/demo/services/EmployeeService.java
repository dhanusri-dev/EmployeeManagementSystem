package com.example.demo.services;
import com.example.demo.model.Employee;
import com.example.demo.model.Manager;
import java.util.List;
import java.util.Optional;
public interface EmployeeService {
    Employee saveEmployee(Employee e);
    List<Employee> getAllEmployees();
    Optional<Employee> getEmployeeById(Long id);
    Optional<Employee> getEmployeeByUsername(String username);
    Employee updateEmployee(Long id, Employee e);
    void deleteEmployee(Long id);
    boolean validateEmployeeLogin(String username, String password);
    List<Employee> getEmployeesByManager(Manager manager);
    Employee assignManager(Long empId, Long managerId);
}
