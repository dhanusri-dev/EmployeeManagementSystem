package com.example.demo.services;
import com.example.demo.model.Leave;
import com.example.demo.model.Employee;
import com.example.demo.repository.LeaveRepository;
import com.example.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
public class LeaveService {
    @Autowired private LeaveRepository leaveRepo;
    @Autowired private EmployeeRepository empRepo;
    public Leave applyLeave(Long empId, Leave leave){
        Employee e=empRepo.findById(empId).orElseThrow(()->new RuntimeException("Employee not found"));
        leave.setEmployee(e);leave.setStatus("PENDING");return leaveRepo.save(leave);
    }
    public List<Leave> getAllLeaves(){return leaveRepo.findAll();}
    public List<Leave> getLeavesByEmployee(Long empId){
        Employee e=empRepo.findById(empId).orElseThrow(()->new RuntimeException("Not found"));
        return leaveRepo.findByEmployee(e);
    }
    public List<Leave> getLeavesByManager(Long managerId){return leaveRepo.findByEmployee_Manager_Id(managerId);}
    public Leave updateLeaveStatus(int leaveId, String status){
        Leave l=leaveRepo.findById(leaveId).orElseThrow(()->new RuntimeException("Not found"));
        l.setStatus(status);return leaveRepo.save(l);
    }
    public void deleteLeave(int id){leaveRepo.deleteById(id);}
    public Optional<Leave> getLeaveById(int id){return leaveRepo.findById(id);}
}
