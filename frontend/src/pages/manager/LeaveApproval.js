import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { getLeavesByManager, updateLeaveStatus } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function LeaveApproval() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState('ALL');

  const load = () => {
    if (user?.id) getLeavesByManager(user.id).then(r => setLeaves(r.data)).catch(() => {});
  };
  useEffect(() => { load(); }, [user]);

  const changeStatus = async (id, status) => {
    try { await updateLeaveStatus(id, status); load(); } catch {}
  };

  const statusClass = { PENDING:'badge-warning', APPROVED:'badge-success', REJECTED:'badge-danger' };
  const filtered = filter === 'ALL' ? leaves : leaves.filter(l => l.status === filter);

  const days = (l) => {
    const s = new Date(l.startDate), e = new Date(l.endDate);
    return Math.ceil((e - s) / (1000*60*60*24)) + 1;
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="top-bar"><h2>Leave Approval</h2></div>
        <div className="page-header"><h1>Leave Requests</h1></div>

        <div className="stats-grid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
          {[['ALL','Total',leaves.length,'blue'],
            ['PENDING','Pending',leaves.filter(l=>l.status==='PENDING').length,'amber'],
            ['APPROVED','Approved',leaves.filter(l=>l.status==='APPROVED').length,'green'],
            ['REJECTED','Rejected',leaves.filter(l=>l.status==='REJECTED').length,'red']
          ].map(([f,label,count,color]) => (
            <div key={f} className={`stat-card ${color}`} style={{cursor:'pointer'}}
              onClick={() => setFilter(f)}>
              <div className="label">{label}</div>
              <div className="value">{count}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Employee</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan={7} style={{textAlign:'center',padding:32,color:'#9ca3af'}}>No leave requests</td></tr>
                  : filtered.map(l => (
                    <tr key={l.id}>
                      <td><strong>{l.employee?.name}</strong><div style={{fontSize:12,color:'#6b7280'}}>{l.employee?.desigination}</div></td>
                      <td>{l.startDate}</td>
                      <td>{l.endDate}</td>
                      <td><span className="badge badge-info">{days(l)} days</span></td>
                      <td style={{maxWidth:200}}>{l.reason}</td>
                      <td><span className={`badge ${statusClass[l.status]||'badge-secondary'}`}>{l.status}</span></td>
                      <td>
                        {l.status === 'PENDING' && (
                          <div className="action-btns">
                            <button className="btn btn-success btn-sm" onClick={() => changeStatus(l.id,'APPROVED')}>✓ Approve</button>
                            <button className="btn btn-danger btn-sm"  onClick={() => changeStatus(l.id,'REJECTED')}>✗ Reject</button>
                          </div>
                        )}
                        {l.status !== 'PENDING' && <span style={{color:'#9ca3af',fontSize:13}}>Decided</span>}
                      </td>
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
