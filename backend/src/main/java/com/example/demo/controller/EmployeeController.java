package com.example.demo.controller;
import com.example.demo.model.Employee;
import com.example.demo.model.Manager;
import com.example.demo.services.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
@RestController @RequestMapping("/api/employee") @CrossOrigin(origins="http://localhost:3000")
public class EmployeeController {
    @Autowired private EmployeeService svc;
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> creds){
        boolean valid=svc.validateEmployeeLogin(creds.get("username"),creds.get("password"));
        if(valid){Employee e=svc.getEmployeeByUsername(creds.get("username")).orElseThrow();
            return ResponseEntity.ok(Map.of("message","Login successful","role","EMPLOYEE","id",e.getId(),"username",e.getUsername(),"email",e.getEmail(),"name",e.getName(),"department",e.getDepartment(),"designation",e.getDesigination()));}
        return ResponseEntity.status(401).body(Map.of("message","Invalid credentials or account inactive"));
    }
    @PostMapping("/add") public ResponseEntity<?> add(@RequestBody Employee e){try{return ResponseEntity.ok(svc.saveEmployee(e));}catch(Exception ex){return ResponseEntity.badRequest().body(Map.of("message",ex.getMessage()));}}
    @GetMapping("/all") public ResponseEntity<List<Employee>> all(){return ResponseEntity.ok(svc.getAllEmployees());}
    @GetMapping("/{id}") public ResponseEntity<?> getById(@PathVariable Long id){return svc.getEmployeeById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());}
    @PutMapping("/{id}") public ResponseEntity<?> update(@PathVariable Long id,@RequestBody Employee e){try{return ResponseEntity.ok(svc.updateEmployee(id,e));}catch(Exception ex){return ResponseEntity.badRequest().body(Map.of("message",ex.getMessage()));}}
    @DeleteMapping("/{id}") public ResponseEntity<?> delete(@PathVariable Long id){svc.deleteEmployee(id);return ResponseEntity.ok(Map.of("message","Deleted"));}
    @PutMapping("/{empId}/assign-manager/{managerId}") public ResponseEntity<?> assign(@PathVariable Long empId,@PathVariable Long managerId){try{return ResponseEntity.ok(svc.assignManager(empId,managerId));}catch(Exception e){return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));}}
    @GetMapping("/by-manager/{managerId}") public ResponseEntity<?> byManager(@PathVariable Long managerId){Manager m=new Manager();m.setId(managerId);return ResponseEntity.ok(svc.getEmployeesByManager(m));}
}
