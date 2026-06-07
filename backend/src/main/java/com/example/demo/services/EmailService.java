package com.example.demo.services;
import com.example.demo.model.Email;
import java.util.List;
public interface EmailService {
    void sendEmail(String to, String subject, String body);
    List<Email> getAllEmails();
}
