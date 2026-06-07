package com.example.demo.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity @Table(name="otp_details")
public class ResetToken {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false,unique=true) private String token;
    @Column(nullable=false) private String email;
    @Column(nullable=false) private LocalDateTime createdAt;
    @Column(nullable=false) private LocalDateTime expiresAt;
    public long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getToken(){return token;} public void setToken(String t){this.token=t;}
    public String getEmail(){return email;} public void setEmail(String e){this.email=e;}
    public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime c){this.createdAt=c;}
    public LocalDateTime getExpiresAt(){return expiresAt;} public void setExpiresAt(LocalDateTime e){this.expiresAt=e;}
}
