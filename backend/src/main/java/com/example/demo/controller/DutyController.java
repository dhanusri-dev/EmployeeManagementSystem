package com.example.demo.controller;
import com.example.demo.model.Duty;
import com.example.demo.services.DutyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
@RestController @RequestMapping("/api/duty") @CrossOrigin(origins="http://localhost:3000")
public class DutyController {
    @Autowired private DutyService svc;
    @PostMapping("/assign/{empId}/{managerId}") public ResponseEntity<?> assign(@PathVariable Long empId,@PathVariable Long managerId,@RequestBody Duty duty){try{return ResponseEntity.ok(svc.assignDuty(empId,managerId,duty));}catch(Exception e){return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));}}
    @GetMapping("/all") public ResponseEntity<List<Duty>> all(){return ResponseEntity.ok(svc.getAllDuties());}
    @GetMapping("/employee/{empId}") public ResponseEntity<List<Duty>> byEmp(@PathVariable Long empId){return ResponseEntity.ok(svc.getDutiesByEmployee(empId));}
    @GetMapping("/manager/{managerId}") public ResponseEntity<List<Duty>> byMgr(@PathVariable Long managerId){return ResponseEntity.ok(svc.getDutiesByManager(managerId));}
    @PutMapping("/{id}") public ResponseEntity<?> update(@PathVariable int id,@RequestBody Duty duty){try{return ResponseEntity.ok(svc.updateDuty(id,duty));}catch(Exception e){return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));}}
    @DeleteMapping("/{id}") public ResponseEntity<?> delete(@PathVariable int id){svc.deleteDuty(id);return ResponseEntity.ok(Map.of("message","Deleted"));}
}
