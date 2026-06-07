import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { getDutiesByManager, assignDuty, updateDuty, deleteDuty, getEmployeesByManager } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const empty = { title:'', description:'' };

export default function DutyManagement() {
  const { user } = useAuth();
  const [duties, setDuties]       = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm]           = useState(empty);
  const [selectedEmp, setSelectedEmp] = useState('');
  const [editing, setEditing]     = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [msg, setMsg]             = useState('');
  const [error, setError]         = useState('');

  const load = () => {
    if (!user?.id) return;
    getDutiesByManager(user.id).then(r => setDuties(r.data)).catch(() => {});
    getEmployeesByManager(user.id).then(r => setEmployees(r.data)).catch(() => {});
  };
  useEffect(() => { load(); }, [user]);

  const openAdd  = () => { setForm(empty); setSelectedEmp(''); setEditing(null); setShowModal(true); setMsg(''); setError(''); };
  const openEdit = (d) => { setForm({title:d.title,description:d.description}); setEditing(d.id); setShowModal(true); setMsg(''); setError(''); };
  const close    = () => { setShowModal(false); setForm(empty); setEditing(null); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setMsg('');
    try {
      if (editing) {
        await updateDuty(editing, form);
        setMsg('Duty updated!');
      } else {
        if (!selectedEmp) { setError('Please select an employee'); return; }
        await assignDuty(selectedEmp, user.id, form);
        setMsg('Duty assigned!');
      }
      load(); setTimeout(close, 1200);
    } catch (err) { setError(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this duty?')) return;
    try { await deleteDuty(id); load(); } catch {}
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="top-bar"><h2>Duty Management</h2></div>
        <div className="page-header">
          <h1>Duty Assignments</h1>
          <button className="btn btn-primary" onClick={openAdd}>+ Assign Duty</button>
        </div>
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr><th>ID</th><th>Title</th><th>Assigned To</th><th>Description</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {duties.length === 0
                  ? <tr><td colSpan={5} style={{textAlign:'center',padding:32,color:'#9ca3af'}}>No duties assigned yet</td></tr>
                  : duties.map(d => (
                    <tr key={d.id}>
                      <td>{d.id}</td>
                      <td><strong>{d.title}</strong></td>
                      <td>{d.employee?.name || '—'}</td>
                      <td style={{maxWidth:300}}>
                        <div style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.description}</div>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="btn btn-warning btn-sm" onClick={() => openEdit(d)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={close}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>{editing ? 'Edit Duty' : 'Assign New Duty'}</h2>
              {msg   && <div className="alert alert-success">{msg}</div>}
              {error && <div className="alert alert-error">{error}</div>}
              <form onSubmit={handleSubmit}>
                {!editing && (
                  <div className="form-group" style={{marginBottom:16}}>
                    <label>Assign To Employee</label>
                    <select value={selectedEmp} onChange={e => setSelectedEmp(e.target.value)} required>
                      <option value="">-- Select employee --</option>
                      {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.desigination})</option>)}
                    </select>
                  </div>
                )}
                <div className="form-group" style={{marginBottom:16}}>
                  <label>Title</label>
                  <input value={form.title} placeholder="Duty title" required onChange={e => setForm({...form,title:e.target.value})} />
                </div>
                <div className="form-group" style={{marginBottom:16}}>
                  <label>Description</label>
                  <textarea value={form.description} placeholder="Detailed description..." required rows={5}
                    onChange={e => setForm({...form,description:e.target.value})} />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Assign'} Duty</button>
                  <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
