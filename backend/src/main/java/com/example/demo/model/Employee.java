package com.example.demo.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;
@Entity
@Table(name="employee_table")
public class Employee {
    @Id @Column(name="emp_id") private long id;
    @Column(name="emp_name",nullable=false) private String name;
    @Column(name="emp_gen",nullable=false) private String gender;
    @Column(name="emp_age",nullable=false) private int age;
    @Column(name="emp_desgn",nullable=false) private String desigination;
    @Column(name="emp_dept",nullable=false) private String department;
    @Column(name="emp_sal",nullable=false) private double salary;
    @Column(name="emp_user",nullable=false,unique=true) private String username;
    @Column(name="emp_email",nullable=false,unique=true) private String email;
    @Column(name="emp_pass",nullable=false) private String password;
    @Column(name="emp_cont",nullable=false,unique=true) private String contact;
    @Column(name="emp_status",nullable=false) private String accountstatus;
    @ManyToOne @JoinColumn(name="manager_id") @JsonIgnore private Manager manager;
    @OneToMany(mappedBy="employee",cascade=CascadeType.ALL) @JsonIgnore private List<Leave> leaves;
    @OneToMany(mappedBy="employee",cascade=CascadeType.ALL) @JsonIgnore private List<Duty> duties;
    public long getId(){return id;} public void setId(long id){this.id=id;}
    public String getName(){return name;} public void setName(String n){this.name=n;}
    public String getGender(){return gender;} public void setGender(String g){this.gender=g;}
    public int getAge(){return age;} public void setAge(int a){this.age=a;}
    public String getDesigination(){return desigination;} public void setDesigination(String d){this.desigination=d;}
    public String getDepartment(){return department;} public void setDepartment(String d){this.department=d;}
    public double getSalary(){return salary;} public void setSalary(double s){this.salary=s;}
    public String getUsername(){return username;} public void setUsername(String u){this.username=u;}
    public String getEmail(){return email;} public void setEmail(String e){this.email=e;}
    public String getPassword(){return password;} public void setPassword(String p){this.password=p;}
    public String getContact(){return contact;} public void setContact(String c){this.contact=c;}
    public String getAccountstatus(){return accountstatus;} public void setAccountstatus(String a){this.accountstatus=a;}
    public Manager getManager(){return manager;} public void setManager(Manager m){this.manager=m;}
    public List<Leave> getLeaves(){return leaves;} public void setLeaves(List<Leave> l){this.leaves=l;}
    public List<Duty> getDuties(){return duties;} public void setDuties(List<Duty> d){this.duties=d;}
}
