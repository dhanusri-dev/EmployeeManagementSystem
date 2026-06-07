package com.example.demo.controller;
import com.example.demo.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/email") @CrossOrigin(origins="http://localhost:3000")
public class EmailController {
    @Autowired private EmailService svc;
    @PostMapping("/send") public ResponseEntity<?> send(@RequestBody Map<String,String> body){try{svc.sendEmail(body.get("to"),body.get("subject"),body.get("message"));return ResponseEntity.ok(Map.of("message","Sent"));}catch(Exception e){return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));}}
    @GetMapping("/all") public ResponseEntity<?> all(){return ResponseEntity.ok(svc.getAllEmails());}
}
