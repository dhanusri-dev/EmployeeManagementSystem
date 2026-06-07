package com.example.demo.controller;
import com.example.demo.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/auth") @CrossOrigin(origins="http://localhost:3000")
public class AuthController {
    @Autowired private AuthService svc;
    @PostMapping("/forgot-password") public ResponseEntity<?> forgot(@RequestBody Map<String,String> body){try{return ResponseEntity.ok(Map.of("message",svc.sendPasswordResetOtp(body.get("email"))));}catch(Exception e){return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));}}
    @PostMapping("/verify-otp") public ResponseEntity<?> verify(@RequestBody Map<String,String> body){return svc.validateOtp(body.get("email"),body.get("otp"))?ResponseEntity.ok(Map.of("message","OTP verified")):ResponseEntity.badRequest().body(Map.of("message","Invalid OTP"));}
    @PostMapping("/reset-password") public ResponseEntity<?> reset(@RequestBody Map<String,String> body){try{return ResponseEntity.ok(Map.of("message",svc.resetPassword(body.get("email"),body.get("otp"),body.get("newPassword"))));}catch(Exception e){return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));}}
}
