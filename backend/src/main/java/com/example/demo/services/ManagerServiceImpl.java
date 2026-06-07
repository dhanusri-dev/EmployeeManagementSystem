package com.example.demo.services;
import com.example.demo.model.Manager;
import com.example.demo.repository.ManagerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
public class ManagerServiceImpl implements ManagerService {
    @Autowired private ManagerRepository repo;
    public Manager saveManager(Manager m){return repo.save(m);}
    public List<Manager> getAllManagers(){return repo.findAll();}
    public Optional<Manager> getManagerById(Long id){return repo.findById(id);}
    public Optional<Manager> getManagerByUsername(String u){return repo.findByUsername(u);}
    public Manager updateManager(Long id, Manager u){
        Manager m=repo.findById(id).orElseThrow(()->new RuntimeException("Not found"));
        m.setName(u.getName());m.setUsername(u.getUsername());m.setEmail(u.getEmail());
        m.setDepartment(u.getDepartment());m.setContact(u.getContact());
        if(u.getPassword()!=null&&!u.getPassword().isEmpty())m.setPassword(u.getPassword());
        return repo.save(m);
    }
    public void deleteManager(Long id){repo.deleteById(id);}
    public boolean validateManagerLogin(String username, String password){
        Optional<Manager> m=repo.findByUsername(username);
        return m.isPresent()&&m.get().getPassword().equals(password);
    }
}
