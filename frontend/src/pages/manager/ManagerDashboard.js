import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { getEmployeesByManager, getLeavesByManager, getDutiesByManager } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ employees:0, duties:0, pendingLeaves:0, totalLeaves:0 });

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([
      getEmployeesByManager(user.id),
      getDutiesByManager(user.id),
      getLeavesByManager(user.id),
    ]).then(([empRes, dutyRes, lvRes]) => {
      const leaves = lvRes.data;
      setCounts({
        employees: empRes.data.length,
        duties: dutyRes.data.length,
        pendingLeaves: leaves.filter(l => l.status === 'PENDING').length,
        totalLeaves: leaves.length,
      });
    }).catch(() => {});
  }, [user]);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="top-bar">
          <h2>Manager Dashboard</h2>
          <div className="user-info">
            <div className="avatar" style={{background:'#10b981'}}>{(user?.name||'M')[0].toUpperCase()}</div>
            <div>
              <div style={{fontWeight:600,fontSize:14}}>{user?.name}</div>
              <div style={{fontSize:12,color:'#6b7280'}}>{user?.department}</div>
            </div>
          </div>
        </div>

        <div style={{marginBottom:24}}>
          <h1 style={{fontSize:22,fontWeight:600}}>Welcome, {user?.name}!</h1>
          <p style={{color:'#6b7280',marginTop:4}}>Here's your team overview</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="label">My Employees</div>
            <div className="value">{counts.employees}</div>
          </div>
          <div className="stat-card purple">
            <div className="label">Duties Assigned</div>
            <div className="value">{counts.duties}</div>
          </div>
          <div className="stat-card amber">
            <div className="label">Pending Leaves</div>
            <div className="value">{counts.pendingLeaves}</div>
          </div>
          <div className="stat-card green">
            <div className="label">Total Leave Requests</div>
            <div className="value">{counts.totalLeaves}</div>
          </div>
        </div>

        <div className="card">
          <h3 style={{marginBottom:12}}>Quick Actions</h3>
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            <a href="/manager/duties" style={{textDecoration:'none'}}>
              <button className="btn btn-primary">+ Assign Duty</button>
            </a>
            <a href="/manager/leaves" style={{textDecoration:'none'}}>
              <button className="btn btn-warning">📋 Review Leaves</button>
            </a>
            <a href="/manager/employees" style={{textDecoration:'none'}}>
              <button className="btn btn-secondary">👥 View Team</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
