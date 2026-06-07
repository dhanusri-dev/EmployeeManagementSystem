package com.example.demo.services;
import com.example.demo.model.ResetToken;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;
@Service
public class AuthService {
    @Autowired private ResetTokenrepository tokenRepo;
    @Autowired private AdminRepository adminRepo;
    @Autowired private ManagerRepository mgrRepo;
    @Autowired private EmployeeRepository empRepo;
    @Autowired private EmailService emailService;
    @Transactional
    public String sendPasswordResetOtp(String email){
        boolean exists=adminRepo.findByEmail(email).isPresent()||mgrRepo.findByEmail(email).isPresent()||empRepo.findByEmail(email).isPresent();
        if(!exists)throw new RuntimeException("No account found with email: "+email);
        tokenRepo.findByEmail(email).ifPresent(t->tokenRepo.delete(t));
        String otp=String.valueOf((int)(Math.random()*900000)+100000);
        ResetToken t=new ResetToken();t.setToken(otp);t.setEmail(email);
        t.setCreatedAt(LocalDateTime.now());t.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        tokenRepo.save(t);
        emailService.sendEmail(email,"Password Reset OTP","Your OTP: "+otp+"\nValid for 10 minutes.");
        return "OTP sent to "+email;
    }
    public boolean validateOtp(String email,String otp){
        Optional<ResetToken> t=tokenRepo.findByEmail(email);
        return t.isPresent()&&t.get().getToken().equals(otp)&&t.get().getExpiresAt().isAfter(LocalDateTime.now());
    }
    @Transactional
    public String resetPassword(String email,String otp,String newPassword){
        if(!validateOtp(email,otp))throw new RuntimeException("Invalid or expired OTP");
        adminRepo.findByEmail(email).ifPresent(a->{a.setPassword(newPassword);adminRepo.save(a);});
        mgrRepo.findByEmail(email).ifPresent(m->{m.setPassword(newPassword);mgrRepo.save(m);});
        empRepo.findByEmail(email).ifPresent(e->{e.setPassword(newPassword);empRepo.save(e);});
        tokenRepo.deleteByEmail(email);
        return "Password reset successfully";
    }
}
