import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { getLeavesByEmployee, getDutiesByEmployee, getEmployeeById } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [counts, setCounts]   = useState({ leaves:0, pending:0, approved:0, duties:0 });

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([
      getEmployeeById(user.id),
      getLeavesByEmployee(user.id),
      getDutiesByEmployee(user.id),
    ]).then(([profRes, lvRes, dutyRes]) => {
      setProfile(profRes.data);
      const leaves = lvRes.data;
      setCounts({
        leaves: leaves.length,
        pending: leaves.filter(l => l.status === 'PENDING').length,
        approved: leaves.filter(l => l.status === 'APPROVED').length,
        duties: dutyRes.data.length,
      });
    }).catch(() => {});
  }, [user]);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="top-bar">
          <h2>Employee Dashboard</h2>
          <div className="user-info">
            <div className="avatar" style={{background:'#8b5cf6'}}>{(user?.name||'E')[0].toUpperCase()}</div>
            <div>
              <div style={{fontWeight:600,fontSize:14}}>{user?.name}</div>
              <div style={{fontSize:12,color:'#6b7280'}}>{user?.designation}</div>
            </div>
          </div>
        </div>

        <div style={{marginBottom:24}}>
          <h1 style={{fontSize:22,fontWeight:600}}>Welcome, {user?.name}!</h1>
          <p style={{color:'#6b7280',marginTop:4}}>{user?.department} Department</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card purple">
            <div className="label">Total Leaves Applied</div>
            <div className="value">{counts.leaves}</div>
          </div>
          <div className="stat-card amber">
            <div className="label">Pending Leaves</div>
            <div className="value">{counts.pending}</div>
          </div>
          <div className="stat-card green">
            <div className="label">Approved Leaves</div>
            <div className="value">{counts.approved}</div>
          </div>
          <div className="stat-card blue">
            <div className="label">Assigned Duties</div>
            <div className="value">{counts.duties}</div>
          </div>
        </div>

        {profile && (
          <div className="card">
            <h3 style={{marginBottom:16}}>My Information</h3>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16}}>
              {[
                ['Employee ID', profile.id],
                ['Full Name', profile.name],
                ['Gender', profile.gender],
                ['Age', profile.age],
                ['Designation', profile.desigination],
                ['Department', profile.department],
                ['Salary', `₹${profile.salary?.toLocaleString()}`],
                ['Email', profile.email],
                ['Contact', profile.contact],
                ['Manager', profile.manager?.name || 'Not Assigned'],
              ].map(([label, value]) => (
                <div key={label} style={{background:'#f8fafc',borderRadius:8,padding:'12px 16px'}}>
                  <div style={{fontSize:12,color:'#6b7280',marginBottom:4}}>{label}</div>
                  <div style={{fontWeight:600,fontSize:15}}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card">
          <h3 style={{marginBottom:12}}>Quick Actions</h3>
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            <a href="/employee/leaves" style={{textDecoration:'none'}}>
              <button className="btn btn-primary">+ Apply for Leave</button>
            </a>
            <a href="/employee/duties" style={{textDecoration:'none'}}>
              <button className="btn btn-secondary">📝 View My Duties</button>
            </a>
            <a href="/employee/profile" style={{textDecoration:'none'}}>
              <button className="btn btn-secondary">👤 My Profile</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
