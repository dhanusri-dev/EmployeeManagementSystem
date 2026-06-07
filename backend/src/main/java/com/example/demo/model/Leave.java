package com.example.demo.model;
import jakarta.persistence.*;
import java.time.LocalDate;
@Entity @Table(name="leave_table")
public class Leave {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private int id;
    @Column(nullable=false) private LocalDate startDate;
    @Column(nullable=false) private LocalDate endDate;
    @Column(nullable=false) private String reason;
    @Column(nullable=false) private String status;
    @ManyToOne @JoinColumn(name="emp_id") private Employee employee;
    public int getId(){return id;} public void setId(int id){this.id=id;}
    public LocalDate getStartDate(){return startDate;} public void setStartDate(LocalDate s){this.startDate=s;}
    public LocalDate getEndDate(){return endDate;} public void setEndDate(LocalDate e){this.endDate=e;}
    public String getReason(){return reason;} public void setReason(String r){this.reason=r;}
    public String getStatus(){return status;} public void setStatus(String s){this.status=s;}
    public Employee getEmployee(){return employee;} public void setEmployee(Employee e){this.employee=e;}
}
