package com.example.demo.repository;
import com.example.demo.model.Employee;
import com.example.demo.model.Manager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface EmployeeRepository extends JpaRepository<Employee,Long> {
    Optional<Employee> findByUsername(String username);
    Optional<Employee> findByEmail(String email);
    List<Employee> findByManager(Manager manager);
}
