package com.example.demo.repository;
import com.example.demo.model.Leave;
import com.example.demo.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface LeaveRepository extends JpaRepository<Leave,Integer> {
    List<Leave> findByEmployee(Employee employee);
    List<Leave> findByEmployee_Manager_Id(Long managerId);
}
