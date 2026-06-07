package com.example.demo.model;
import jakarta.persistence.*;
@Entity
@Table(name="admin_table")
public class Admin {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;
    @Column(nullable=false,unique=true) private String username;
    @Column(nullable=false) private String password;
    @Column(nullable=false,unique=true) private String email;
    public int getId(){return id;} public void setId(int id){this.id=id;}
    public String getUsername(){return username;} public void setUsername(String u){this.username=u;}
    public String getPassword(){return password;} public void setPassword(String p){this.password=p;}
    public String getEmail(){return email;} public void setEmail(String e){this.email=e;}
}
