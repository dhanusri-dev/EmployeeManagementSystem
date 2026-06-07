package com.example.demo.services;
import com.example.demo.model.Employee;
import com.example.demo.model.Manager;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.repository.ManagerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
public class EmployeeServiceImpl implements EmployeeService {
    @Autowired private EmployeeRepository repo;
    @Autowired private ManagerRepository mgrRepo;
    public Employee saveEmployee(Employee e){e.setAccountstatus("ACTIVE");return repo.save(e);}
    public List<Employee> getAllEmployees(){return repo.findAll();}
    public Optional<Employee> getEmployeeById(Long id){return repo.findById(id);}
    public Optional<Employee> getEmployeeByUsername(String u){return repo.findByUsername(u);}
    public Employee updateEmployee(Long id, Employee u){
        Employee e=repo.findById(id).orElseThrow(()->new RuntimeException("Not found"));
        e.setName(u.getName());e.setGender(u.getGender());e.setAge(u.getAge());
        e.setDesigination(u.getDesigination());e.setDepartment(u.getDepartment());e.setSalary(u.getSalary());
        e.setUsername(u.getUsername());e.setEmail(u.getEmail());e.setContact(u.getContact());
        e.setAccountstatus(u.getAccountstatus());
        if(u.getPassword()!=null&&!u.getPassword().isEmpty())e.setPassword(u.getPassword());
        return repo.save(e);
    }
    public void deleteEmployee(Long id){repo.deleteById(id);}
    public boolean validateEmployeeLogin(String username, String password){
        Optional<Employee> e=repo.findByUsername(username);
        return e.isPresent()&&e.get().getPassword().equals(password)&&"ACTIVE".equals(e.get().getAccountstatus());
    }
    public List<Employee> getEmployeesByManager(Manager m){return repo.findByManager(m);}
    public Employee assignManager(Long empId, Long mgrId){
        Employee e=repo.findById(empId).orElseThrow(()->new RuntimeException("Employee not found"));
        Manager m=mgrRepo.findById(mgrId).orElseThrow(()->new RuntimeException("Manager not found"));
        e.setManager(m);return repo.save(e);
    }
}
