package com.example.demo.services;
import com.example.demo.model.Email;
import com.example.demo.repository.EmailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
@Service
public class EmailServiceImpl implements EmailService {
    @Autowired private JavaMailSender mailSender;
    @Autowired private EmailRepository emailRepository;
    public void sendEmail(String to, String subject, String body){
        Email r=new Email();r.setRecipient(to);r.setSubject(subject);r.setMessage(body);r.setSentAt(LocalDateTime.now());
        try{SimpleMailMessage m=new SimpleMailMessage();m.setTo(to);m.setSubject(subject);m.setText(body);mailSender.send(m);r.setStatus("SENT");}
        catch(Exception e){r.setStatus("FAILED");}
        emailRepository.save(r);
    }
    public List<Email> getAllEmails(){return emailRepository.findAll();}
}
