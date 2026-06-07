package com.example.demo.controller;
import com.example.demo.model.Manager;
import com.example.demo.services.ManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
@RestController @RequestMapping("/api/manager") @CrossOrigin(origins="http://localhost:3000")
public class ManagerController {
    @Autowired private ManagerService svc;
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> creds){
        boolean valid=svc.validateManagerLogin(creds.get("username"),creds.get("password"));
        if(valid){Manager m=svc.getManagerByUsername(creds.get("username")).orElseThrow();
            return ResponseEntity.ok(Map.of("message","Login successful","role","MANAGER","id",m.getId(),"username",m.getUsername(),"email",m.getEmail(),"name",m.getName(),"department",m.getDepartment()));}
        return ResponseEntity.status(401).body(Map.of("message","Invalid credentials"));
    }
    @PostMapping("/add") public ResponseEntity<?> add(@RequestBody Manager m){try{return ResponseEntity.ok(svc.saveManager(m));}catch(Exception e){return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));}}
    @GetMapping("/all") public ResponseEntity<List<Manager>> all(){return ResponseEntity.ok(svc.getAllManagers());}
    @GetMapping("/{id}") public ResponseEntity<?> getById(@PathVariable Long id){return svc.getManagerById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());}
    @PutMapping("/{id}") public ResponseEntity<?> update(@PathVariable Long id,@RequestBody Manager m){try{return ResponseEntity.ok(svc.updateManager(id,m));}catch(Exception e){return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));}}
    @DeleteMapping("/{id}") public ResponseEntity<?> delete(@PathVariable Long id){svc.deleteManager(id);return ResponseEntity.ok(Map.of("message","Deleted"));}
}
