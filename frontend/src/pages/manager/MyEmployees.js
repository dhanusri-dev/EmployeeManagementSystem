import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { getEmployeesByManager } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function MyEmployees() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user?.id) getEmployeesByManager(user.id).then(r => setEmployees(r.data)).catch(() => {});
  }, [user]);

  const filtered = employees.filter(e =>
    e.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.desigination?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="top-bar"><h2>My Employees</h2></div>
        <div className="page-header"><h1>My Team ({employees.length})</h1></div>
        <div className="card">
          <div className="search-bar">
            <input placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr><th>ID</th><th>Name</th><th>Designation</th><th>Department</th><th>Email</th><th>Contact</th><th>Salary</th><th>Status</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan={8} style={{textAlign:'center',padding:32,color:'#9ca3af'}}>No employees in your team</td></tr>
                  : filtered.map(e => (
                    <tr key={e.id}>
                      <td>{e.id}</td>
                      <td><strong>{e.name}</strong><div style={{fontSize:12,color:'#6b7280'}}>{e.username}</div></td>
                      <td>{e.desigination}</td>
                      <td><span className="badge badge-info">{e.department}</span></td>
                      <td>{e.email}</td>
                      <td>{e.contact}</td>
                      <td>₹{e.salary?.toLocaleString()}</td>
                      <td><span className={`badge ${e.accountstatus==='ACTIVE'?'badge-success':'badge-danger'}`}>{e.accountstatus}</span></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
