package com.example.demo.model;
import jakarta.persistence.*;
@Entity @Table(name="duty_leave")
public class Duty {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private int id;
    @Column(nullable=false) private String title;
    @Column(nullable=false,length=3000) private String description;
    @ManyToOne @JoinColumn(name="emp_id") private Employee employee;
    @ManyToOne @JoinColumn(name="assignedByManager") private Manager assignedByManager;
    public int getId(){return id;} public void setId(int id){this.id=id;}
    public String getTitle(){return title;} public void setTitle(String t){this.title=t;}
    public String getDescription(){return description;} public void setDescription(String d){this.description=d;}
    public Employee getEmployee(){return employee;} public void setEmployee(Employee e){this.employee=e;}
    public Manager getAssignedByManager(){return assignedByManager;} public void setAssignedByManager(Manager m){this.assignedByManager=m;}
}
