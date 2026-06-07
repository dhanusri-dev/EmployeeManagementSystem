package com.example.demo.controller;
import com.example.demo.model.Admin;
import com.example.demo.services.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
@RestController @RequestMapping("/api/admin") @CrossOrigin(origins="http://localhost:3000")
public class AdminController {
    @Autowired private AdminService adminService;
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> creds){
        boolean valid=adminService.validateAdminLogin(creds.get("username"),creds.get("password"));
        if(valid){Admin a=adminService.getAdminByUsername(creds.get("username")).orElseThrow();
            return ResponseEntity.ok(Map.of("message","Login successful","role","ADMIN","id",a.getId(),"username",a.getUsername(),"email",a.getEmail()));}
        return ResponseEntity.status(401).body(Map.of("message","Invalid credentials"));
    }
    @PostMapping("/register") public ResponseEntity<?> register(@RequestBody Admin admin){
        try{return ResponseEntity.ok(adminService.saveAdmin(admin));}catch(Exception e){return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));}
    }
    @GetMapping("/all") public ResponseEntity<List<Admin>> all(){return ResponseEntity.ok(adminService.getAllAdmins());}
    @GetMapping("/{id}") public ResponseEntity<?> getById(@PathVariable int id){return adminService.getAdminById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());}
    @PutMapping("/{id}") public ResponseEntity<?> update(@PathVariable int id,@RequestBody Admin admin){
        try{return ResponseEntity.ok(adminService.updateAdmin(id,admin));}catch(Exception e){return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));}
    }
    @DeleteMapping("/{id}") public ResponseEntity<?> delete(@PathVariable int id){adminService.deleteAdmin(id);return ResponseEntity.ok(Map.of("message","Deleted"));}
}
