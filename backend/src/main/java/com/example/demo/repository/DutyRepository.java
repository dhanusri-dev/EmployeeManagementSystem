package com.example.demo.repository;
import com.example.demo.model.Duty;
import com.example.demo.model.Employee;
import com.example.demo.model.Manager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface DutyRepository extends JpaRepository<Duty,Integer> {
    List<Duty> findByEmployee(Employee employee);
    List<Duty> findByAssignedByManager(Manager manager);
}
