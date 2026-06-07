import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { getLeavesByEmployee, applyLeave, deleteLeave } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const empty = { startDate:'', endDate:'', reason:'' };

export default function MyLeaves() {
  const { user } = useAuth();
  const [leaves, setLeaves]   = useState([]);
  const [form, setForm]       = useState(empty);
  const [showModal, setShowModal] = useState(false);
  const [msg, setMsg]         = useState('');
  const [error, setError]     = useState('');

  const load = () => {
    if (user?.id) getLeavesByEmployee(user.id).then(r => setLeaves(r.data)).catch(() => {});
  };
  useEffect(() => { load(); }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setMsg(''); setError('');
    if (new Date(form.endDate) < new Date(form.startDate)) { setError('End date cannot be before start date'); return; }
    try {
      await applyLeave(user.id, form);
      setMsg('Leave application submitted!');
      setForm(empty);
      load();
      setTimeout(() => setShowModal(false), 1500);
    } catch (err) { setError(err.response?.data?.message || 'Failed to apply'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Withdraw this leave request?')) return;
    try { await deleteLeave(id); load(); } catch {}
  };

  const statusClass = { PENDING:'badge-warning', APPROVED:'badge-success', REJECTED:'badge-danger' };

  const days = (l) => {
    const s = new Date(l.startDate), e = new Date(l.endDate);
    return Math.ceil((e - s) / (1000*60*60*24)) + 1;
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="top-bar"><h2>My Leaves</h2></div>
        <div className="page-header">
          <h1>My Leave Requests</h1>
          <button className="btn btn-primary" onClick={() => { setShowModal(true); setMsg(''); setError(''); }}>+ Apply Leave</button>
        </div>

        <div className="stats-grid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
          {[['Total',leaves.length,'blue'],
            ['Pending',leaves.filter(l=>l.status==='PENDING').length,'amber'],
            ['Approved',leaves.filter(l=>l.status==='APPROVED').length,'green'],
            ['Rejected',leaves.filter(l=>l.status==='REJECTED').length,'red']
          ].map(([label,count,color]) => (
            <div key={label} className={`stat-card ${color}`}>
              <div className="label">{label}</div>
              <div className="value">{count}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr><th>ID</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {leaves.length === 0
                  ? <tr><td colSpan={7} style={{textAlign:'center',padding:32,color:'#9ca3af'}}>No leave requests yet</td></tr>
                  : leaves.slice().reverse().map(l => (
                    <tr key={l.id}>
                      <td>{l.id}</td>
                      <td>{l.startDate}</td>
                      <td>{l.endDate}</td>
                      <td><span className="badge badge-info">{days(l)} days</span></td>
                      <td>{l.reason}</td>
                      <td><span className={`badge ${statusClass[l.status]||'badge-secondary'}`}>{l.status}</span></td>
                      <td>
                        {l.status === 'PENDING' && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(l.id)}>Withdraw</button>
                        )}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" style={{maxWidth:480}} onClick={e => e.stopPropagation()}>
              <h2>Apply for Leave</h2>
              {msg   && <div className="alert alert-success">{msg}</div>}
              {error && <div className="alert alert-error">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{marginBottom:16}}>
                  <label>Start Date</label>
                  <input type="date" value={form.startDate} required
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setForm({...form,startDate:e.target.value})} />
                </div>
                <div className="form-group" style={{marginBottom:16}}>
                  <label>End Date</label>
                  <input type="date" value={form.endDate} required
                    min={form.startDate || new Date().toISOString().split('T')[0]}
                    onChange={e => setForm({...form,endDate:e.target.value})} />
                </div>
                <div className="form-group" style={{marginBottom:16}}>
                  <label>Reason</label>
                  <textarea value={form.reason} placeholder="Reason for leave..." required rows={4}
                    onChange={e => setForm({...form,reason:e.target.value})} />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Submit Application</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
