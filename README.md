# Employee Management System (EMS)
Full-stack application: **React + Spring Boot + PostgreSQL**

---

## Project Structure
```
ems/
├── backend/          ← Spring Boot (Maven)
│   └── src/main/java/com/example/demo/
│       ├── model/           (Admin, Employee, Manager, Leave, Duty, Email, ResetToken, ForgotPassword)
│       ├── repository/      (JPA repositories for all entities)
│       ├── services/        (AdminService, ManagerService, EmployeeService, LeaveService, DutyService, EmailService, AuthService)
│       ├── controller/      (AdminController, ManagerController, EmployeeController, LeaveController, DutyController, EmailController, AuthController)
│       └── config/          (CorsConfig)
└── frontend/         ← React (CRA)
    └── src/
        ├── pages/
        │   ├── auth/        (LoginPage, ForgotPasswordPage)
        │   ├── admin/       (AdminDashboard, ManagerManagement, EmployeeManagement, AllLeavesPage, AdminEmailPage)
        │   ├── manager/     (ManagerDashboard, MyEmployees, DutyManagement, LeaveApproval)
        │   └── employee/    (EmployeeDashboard, MyLeaves, MyDuties, MyProfile)
        ├── components/      (Sidebar)
        ├── context/         (AuthContext)
        └── services/        (api.js — all Axios calls)
```

---

## Setup Instructions

### 1. PostgreSQL Database
```sql
CREATE DATABASE employee_management_db;
```

### 2. Backend Setup
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/employee_management_db
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD

# For email OTP (Gmail):
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password   ← Generate at myaccount.google.com/apppasswords
```

Run the backend:
```bash
cd backend
mvn spring-boot:run
# Runs on http://localhost:8080
```

Tables are auto-created by Hibernate on first run.

### 3. Seed Admin Account
After the backend starts, manually insert an admin via psql or pgAdmin:
```sql
INSERT INTO admin_table (username, password, email)
VALUES ('admin', 'admin123', 'admin@company.com');
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

---

## Features by Role

### 🛡️ Admin
- Login at http://localhost:3000 (select ADMIN role)
- Dashboard with stats (employee/manager counts, pending leaves)
- Add / Edit / Delete Managers
- Add / Edit / Delete / Assign-Manager for Employees
- View and approve/reject all leave requests
- Send emails to employees/managers, view email log

### 👔 Manager
- Login (select MANAGER role)
- Dashboard with team stats
- View all employees in their team
- Assign duties to team members (with title + description)
- Review and approve/reject leave requests from their employees

### 👤 Employee
- Login (select EMPLOYEE role)
- Dashboard with personal info + stats
- Apply for leave, view leave history, withdraw pending leaves
- View assigned duties with full description
- Edit profile (name, age, designation, contact, password)

### 🔑 Forgot Password (all roles)
- Enter email → receive 6-digit OTP → verify → set new password
- OTP expires in 10 minutes

---

## API Endpoints Reference

| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/admin/login | Admin login |
| POST | /api/manager/login | Manager login |
| POST | /api/employee/login | Employee login |
| POST | /api/auth/forgot-password | Send OTP |
| POST | /api/auth/verify-otp | Verify OTP |
| POST | /api/auth/reset-password | Reset password |
| GET | /api/admin/all | Get all admins |
| POST | /api/admin/register | Create admin |
| GET | /api/manager/all | Get all managers |
| POST | /api/manager/add | Add manager |
| PUT | /api/manager/{id} | Update manager |
| DELETE | /api/manager/{id} | Delete manager |
| GET | /api/employee/all | Get all employees |
| POST | /api/employee/add | Add employee |
| PUT | /api/employee/{id} | Update employee |
| DELETE | /api/employee/{id} | Delete employee |
| PUT | /api/employee/{empId}/assign-manager/{managerId} | Assign manager |
| GET | /api/employee/by-manager/{managerId} | Employees by manager |
| POST | /api/leave/apply/{empId} | Apply for leave |
| GET | /api/leave/all | All leaves (admin) |
| GET | /api/leave/employee/{empId} | Leaves by employee |
| GET | /api/leave/manager/{managerId} | Leaves under manager |
| PUT | /api/leave/{id}/status | Approve/Reject leave |
| POST | /api/duty/assign/{empId}/{managerId} | Assign duty |
| GET | /api/duty/employee/{empId} | Duties for employee |
| GET | /api/duty/manager/{managerId} | Duties by manager |
| POST | /api/email/send | Send email |
| GET | /api/email/all | Email log |

---

## Tech Stack
- **Backend**: Spring Boot 3.2, Spring Data JPA, Spring Mail, PostgreSQL, Maven
- **Frontend**: React 18, React Router 6, Axios
- **Database**: PostgreSQL (Hibernate auto DDL)
- **Java**: 21
