package com.example.demo.services;
import com.example.demo.model.Duty;
import com.example.demo.model.Employee;
import com.example.demo.model.Manager;
import com.example.demo.repository.DutyRepository;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.repository.ManagerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
public class DutyService {
    @Autowired private DutyRepository dutyRepo;
    @Autowired private EmployeeRepository empRepo;
    @Autowired private ManagerRepository mgrRepo;
    public Duty assignDuty(Long empId, Long mgrId, Duty duty){
        Employee e=empRepo.findById(empId).orElseThrow(()->new RuntimeException("Employee not found"));
        Manager m=mgrRepo.findById(mgrId).orElseThrow(()->new RuntimeException("Manager not found"));
        duty.setEmployee(e);duty.setAssignedByManager(m);return dutyRepo.save(duty);
    }
    public List<Duty> getAllDuties(){return dutyRepo.findAll();}
    public List<Duty> getDutiesByEmployee(Long empId){
        Employee e=empRepo.findById(empId).orElseThrow(()->new RuntimeException("Not found"));
        return dutyRepo.findByEmployee(e);
    }
    public List<Duty> getDutiesByManager(Long mgrId){
        Manager m=mgrRepo.findById(mgrId).orElseThrow(()->new RuntimeException("Not found"));
        return dutyRepo.findByAssignedByManager(m);
    }
    public Duty updateDuty(int id, Duty u){
        Duty d=dutyRepo.findById(id).orElseThrow(()->new RuntimeException("Not found"));
        d.setTitle(u.getTitle());d.setDescription(u.getDescription());return dutyRepo.save(d);
    }
    public void deleteDuty(int id){dutyRepo.deleteById(id);}
    public Optional<Duty> getDutyById(int id){return dutyRepo.findById(id);}
}
