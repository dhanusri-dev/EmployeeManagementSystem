package com.example.demo.controller;
import com.example.demo.model.Leave;
import com.example.demo.services.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
@RestController @RequestMapping("/api/leave") @CrossOrigin(origins="http://localhost:3000")
public class LeaveController {
    @Autowired private LeaveService svc;
    @PostMapping("/apply/{empId}") public ResponseEntity<?> apply(@PathVariable Long empId,@RequestBody Leave leave){try{return ResponseEntity.ok(svc.applyLeave(empId,leave));}catch(Exception e){return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));}}
    @GetMapping("/all") public ResponseEntity<List<Leave>> all(){return ResponseEntity.ok(svc.getAllLeaves());}
    @GetMapping("/employee/{empId}") public ResponseEntity<List<Leave>> byEmp(@PathVariable Long empId){return ResponseEntity.ok(svc.getLeavesByEmployee(empId));}
    @GetMapping("/manager/{managerId}") public ResponseEntity<List<Leave>> byMgr(@PathVariable Long managerId){return ResponseEntity.ok(svc.getLeavesByManager(managerId));}
    @PutMapping("/{leaveId}/status") public ResponseEntity<?> status(@PathVariable int leaveId,@RequestBody Map<String,String> body){try{return ResponseEntity.ok(svc.updateLeaveStatus(leaveId,body.get("status")));}catch(Exception e){return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));}}
    @DeleteMapping("/{id}") public ResponseEntity<?> delete(@PathVariable int id){svc.deleteLeave(id);return ResponseEntity.ok(Map.of("message","Deleted"));}
}
