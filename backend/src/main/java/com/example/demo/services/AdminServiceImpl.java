package com.example.demo.services;
import com.example.demo.model.Admin;
import com.example.demo.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
public class AdminServiceImpl implements AdminService {
    @Autowired private AdminRepository adminRepository;
    public Admin saveAdmin(Admin admin){return adminRepository.save(admin);}
    public List<Admin> getAllAdmins(){return adminRepository.findAll();}
    public Optional<Admin> getAdminById(int id){return adminRepository.findById(id);}
    public Optional<Admin> getAdminByUsername(String u){return adminRepository.findByUsername(u);}
    public Admin updateAdmin(int id, Admin u){
        Admin a=adminRepository.findById(id).orElseThrow(()->new RuntimeException("Not found"));
        a.setUsername(u.getUsername()); a.setEmail(u.getEmail());
        if(u.getPassword()!=null&&!u.getPassword().isEmpty())a.setPassword(u.getPassword());
        return adminRepository.save(a);
    }
    public void deleteAdmin(int id){adminRepository.deleteById(id);}
    public boolean validateAdminLogin(String username, String password){
        Optional<Admin> a=adminRepository.findByUsername(username);
        return a.isPresent()&&a.get().getPassword().equals(password);
    }
}
