package com.example.demo.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;
@Entity
@Table(name="manager_table")
public class Manager {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="manager_id") private Long id;
    @Column(name="emp_name",nullable=false) private String name;
    @Column(name="emp_username",nullable=false,unique=true) private String username;
    @Column(name="emp_email",nullable=false,unique=true) private String email;
    @Column(name="emp_pass",nullable=false) private String password;
    @Column(name="emp_dept",nullable=false) private String department;
    @Column(name="emp_cont",nullable=false,unique=true) private String contact;
    @OneToMany(mappedBy="manager",cascade=CascadeType.ALL) @JsonIgnore private List<Employee> employees;
    @OneToMany(mappedBy="assignedByManager",cascade=CascadeType.ALL) @JsonIgnore private List<Duty> dutiesAssigned;
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getName(){return name;} public void setName(String n){this.name=n;}
    public String getUsername(){return username;} public void setUsername(String u){this.username=u;}
    public String getEmail(){return email;} public void setEmail(String e){this.email=e;}
    public String getPassword(){return password;} public void setPassword(String p){this.password=p;}
    public String getDepartment(){return department;} public void setDepartment(String d){this.department=d;}
    public String getContact(){return contact;} public void setContact(String c){this.contact=c;}
    public List<Employee> getEmployees(){return employees;} public void setEmployees(List<Employee> e){this.employees=e;}
    public List<Duty> getDutiesAssigned(){return dutiesAssigned;} public void setDutiesAssigned(List<Duty> d){this.dutiesAssigned=d;}
}
