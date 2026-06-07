package com.example.demo.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity @Table(name="email_details")
public class Email {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private int id;
    @Column(nullable=false) private String recipient;
    @Column(nullable=false) private String subject;
    @Column(nullable=false,length=1000) private String message;
    @Column(nullable=false) private LocalDateTime sentAt;
    @Column(nullable=false) private String status;
    public int getId(){return id;} public void setId(int id){this.id=id;}
    public String getRecipient(){return recipient;} public void setRecipient(String r){this.recipient=r;}
    public String getSubject(){return subject;} public void setSubject(String s){this.subject=s;}
    public String getMessage(){return message;} public void setMessage(String m){this.message=m;}
    public LocalDateTime getSentAt(){return sentAt;} public void setSentAt(LocalDateTime s){this.sentAt=s;}
    public String getStatus(){return status;} public void setStatus(String s){this.status=s;}
}
