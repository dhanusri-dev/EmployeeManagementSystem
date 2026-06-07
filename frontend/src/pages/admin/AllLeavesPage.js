import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { getAllLeaves, updateLeaveStatus } from '../../services/api';

export default function AllLeavesPage() {
  const [leaves, setLeaves]   = useState([]);
  const [filter, setFilter]   = useState('ALL');
  const [search, setSearch]   = useState('');

  const load = () => getAllLeaves().then(r => setLeaves(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const changeStatus = async (id, status) => {
    try { await updateLeaveStatus(id, status); load(); } catch {}
  };

  const statusClass = { PENDING:'badge-warning', APPROVED:'badge-success', REJECTED:'badge-danger' };

  const filtered = leaves.filter(l => {
    const matchStatus = filter === 'ALL' || l.status === filter;
    const matchSearch = l.employee?.name?.toLowerCase().includes(search.toLowerCase()) || false;
    return matchStatus && matchSearch;
  });

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="top-bar"><h2>Leave Management</h2></div>
        <div className="page-header"><h1>All Leave Requests</h1></div>

        <div className="stats-grid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
          {[['ALL','Total',leaves.length,'blue'],
            ['PENDING','Pending',leaves.filter(l=>l.status==='PENDING').length,'amber'],
            ['APPROVED','Approved',leaves.filter(l=>l.status==='APPROVED').length,'green'],
            ['REJECTED','Rejected',leaves.filter(l=>l.status==='REJECTED').length,'red']
          ].map(([f,label,count,color]) => (
            <div key={f} className={`stat-card ${color}`} style={{cursor:'pointer',outline: filter===f?`2px solid currentColor`:'none'}}
              onClick={() => setFilter(f)}>
              <div className="label">{label}</div>
              <div className="value">{count}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="search-bar">
            <input placeholder="Search by employee name..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr><th>ID</th><th>Employee</th><th>Department</th><th>From</th><th>To</th><th>Reason</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan={8} style={{textAlign:'center',padding:32,color:'#9ca3af'}}>No leave requests</td></tr>
                  : filtered.map(l => (
                    <tr key={l.id}>
                      <td>{l.id}</td>
                      <td><strong>{l.employee?.name || '—'}</strong><div style={{fontSize:12,color:'#6b7280'}}>{l.employee?.desigination}</div></td>
                      <td>{l.employee?.department}</td>
                      <td>{l.startDate}</td>
                      <td>{l.endDate}</td>
                      <td style={{maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{l.reason}</td>
                      <td><span className={`badge ${statusClass[l.status]||'badge-secondary'}`}>{l.status}</span></td>
                      <td>
                        {l.status === 'PENDING' && (
                          <div className="action-btns">
                            <button className="btn btn-success btn-sm" onClick={() => changeStatus(l.id,'APPROVED')}>Approve</button>
                            <button className="btn btn-danger btn-sm"  onClick={() => changeStatus(l.id,'REJECTED')}>Reject</button>
                          </div>
                        )}
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
