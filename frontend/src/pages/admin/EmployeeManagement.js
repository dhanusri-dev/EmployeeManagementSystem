import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { getAllEmployees, createEmployee, updateEmployee, deleteEmployee, getAllManagers, assignManager } from '../../services/api';

const empty = { id:'', name:'', gender:'Male', age:'', desigination:'', department:'', salary:'', username:'', email:'', password:'', contact:'', accountstatus:'ACTIVE' };

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers]   = useState([]);
  const [form, setForm]           = useState(empty);
  const [editing, setEditing]     = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [assignModal, setAssignModal] = useState(null);
  const [selectedMgr, setSelectedMgr] = useState('');
  const [search, setSearch]       = useState('');
  const [msg, setMsg]             = useState('');
  const [error, setError]         = useState('');

  const load = () => {
    getAllEmployees().then(r => setEmployees(r.data)).catch(() => {});
    getAllManagers().then(r => setManagers(r.data)).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(empty); setEditing(null); setShowModal(true); setMsg(''); setError(''); };
  const openEdit = (e) => { setForm({...e, password:''}); setEditing(e.id); setShowModal(true); setMsg(''); setError(''); };
  const close    = () => { setShowModal(false); setForm(empty); setEditing(null); };

  const handleSubmit = async (ev) => {
    ev.preventDefault(); setError(''); setMsg('');
    try {
      if (editing) { await updateEmployee(editing, form); setMsg('Employee updated!'); }
      else         { await createEmployee(form);           setMsg('Employee added!');   }
      load(); setTimeout(close, 1200);
    } catch (err) { setError(err.response?.data?.message || 'Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try { await deleteEmployee(id); load(); } catch {}
  };

  const doAssign = async () => {
    if (!selectedMgr) return;
    try { await assignManager(assignModal, selectedMgr); setAssignModal(null); load(); }
    catch {}
  };

  const statusBadge = (s) => s === 'ACTIVE' ? 'badge-success' : 'badge-danger';
  const filtered = employees.filter(e =>
    e.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.username?.toLowerCase().includes(search.toLowerCase()) ||
    e.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="top-bar"><h2>Employee Management</h2></div>
        <div className="page-header">
          <h1>Employees</h1>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Employee</button>
        </div>
        <div className="card">
          <div className="search-bar">
            <input placeholder="Search by name, username or department..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr><th>ID</th><th>Name</th><th>Designation</th><th>Dept</th><th>Salary</th><th>Manager</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan={8} style={{textAlign:'center',padding:32,color:'#9ca3af'}}>No employees found</td></tr>
                  : filtered.map(emp => (
                    <tr key={emp.id}>
                      <td>{emp.id}</td>
                      <td>
                        <div><strong>{emp.name}</strong></div>
                        <div style={{fontSize:12,color:'#6b7280'}}>{emp.username}</div>
                      </td>
                      <td>{emp.desigination}</td>
                      <td><span className="badge badge-info">{emp.department}</span></td>
                      <td>₹{emp.salary?.toLocaleString()}</td>
                      <td>{emp.manager ? emp.manager.name : <span style={{color:'#9ca3af'}}>Unassigned</span>}</td>
                      <td><span className={`badge ${statusBadge(emp.accountstatus)}`}>{emp.accountstatus}</span></td>
                      <td>
                        <div className="action-btns">
                          <button className="btn btn-warning btn-sm" onClick={() => openEdit(emp)}>Edit</button>
                          <button className="btn btn-primary btn-sm" onClick={() => { setAssignModal(emp.id); setSelectedMgr(''); }}>Assign</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(emp.id)}>Del</button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={close}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>{editing ? 'Edit Employee' : 'Add Employee'}</h2>
              {msg   && <div className="alert alert-success">{msg}</div>}
              {error && <div className="alert alert-error">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  {!editing && (
                    <div className="form-group">
                      <label>Employee ID</label>
                      <input type="number" value={form.id} placeholder="Unique ID"
                        onChange={e => setForm({...form,id:e.target.value})} required />
                    </div>
                  )}
                  <div className="form-group">
                    <label>Full Name</label>
                    <input value={form.name} placeholder="Full name" required onChange={e => setForm({...form,name:e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select value={form.gender} onChange={e => setForm({...form,gender:e.target.value})}>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Age</label>
                    <input type="number" value={form.age} placeholder="Age" required onChange={e => setForm({...form,age:e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Designation</label>
                    <input value={form.desigination} placeholder="Designation" required onChange={e => setForm({...form,desigination:e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <input value={form.department} placeholder="Department" required onChange={e => setForm({...form,department:e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Salary</label>
                    <input type="number" value={form.salary} placeholder="Salary" required onChange={e => setForm({...form,salary:e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Username</label>
                    <input value={form.username} placeholder="Username" required onChange={e => setForm({...form,username:e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={form.email} placeholder="Email" required onChange={e => setForm({...form,email:e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>{editing ? 'New Password (blank = keep)' : 'Password'}</label>
                    <input type="password" value={form.password} placeholder="Password"
                      required={!editing} onChange={e => setForm({...form,password:e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Contact</label>
                    <input value={form.contact} placeholder="Phone" required onChange={e => setForm({...form,contact:e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select value={form.accountstatus} onChange={e => setForm({...form,accountstatus:e.target.value})}>
                      <option>ACTIVE</option><option>INACTIVE</option>
                    </select>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Add'} Employee</button>
                  <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Assign Manager Modal */}
        {assignModal && (
          <div className="modal-overlay" onClick={() => setAssignModal(null)}>
            <div className="modal" style={{maxWidth:400}} onClick={e => e.stopPropagation()}>
              <h2>Assign Manager</h2>
              <div className="form-group" style={{marginBottom:20}}>
                <label>Select Manager</label>
                <select value={selectedMgr} onChange={e => setSelectedMgr(e.target.value)}>
                  <option value="">-- Select --</option>
                  {managers.map(m => <option key={m.id} value={m.id}>{m.name} ({m.department})</option>)}
                </select>
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" onClick={doAssign}>Assign</button>
                <button className="btn btn-secondary" onClick={() => setAssignModal(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
