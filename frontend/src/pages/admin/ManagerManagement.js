import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { getAllManagers, createManager, updateManager, deleteManager } from '../../services/api';

const empty = { name: '', username: '', email: '', password: '', department: '', contact: '' };

export default function ManagerManagement() {
  const [managers, setManagers] = useState([]);
  const [form, setForm]         = useState(empty);
  const [editing, setEditing]   = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch]     = useState('');
  const [msg, setMsg]           = useState('');
  const [error, setError]       = useState('');

  const load = () => getAllManagers().then(r => setManagers(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(empty); setEditing(null); setShowModal(true); setMsg(''); setError(''); };
  const openEdit = (m) => { setForm({ ...m, password: '' }); setEditing(m.id); setShowModal(true); setMsg(''); setError(''); };
  const close    = () => { setShowModal(false); setForm(empty); setEditing(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMsg('');
    try {
      if (editing) { await updateManager(editing, form); setMsg('Manager updated successfully!'); }
      else         { await createManager(form);          setMsg('Manager added successfully!');   }
      load();
      setTimeout(close, 1200);
    } catch (err) { setError(err.response?.data?.message || 'Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this manager?')) return;
    try { await deleteManager(id); load(); } catch {}
  };

  const filtered = managers.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.username?.toLowerCase().includes(search.toLowerCase()) ||
    m.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="top-bar"><h2>Manager Management</h2></div>
        <div className="page-header">
          <h1>Managers</h1>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Manager</button>
        </div>
        <div className="card">
          <div className="search-bar">
            <input placeholder="Search by name, username or department..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr><th>ID</th><th>Name</th><th>Username</th><th>Email</th><th>Department</th><th>Contact</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan={7} style={{textAlign:'center',padding:32,color:'#9ca3af'}}>No managers found</td></tr>
                  : filtered.map(m => (
                    <tr key={m.id}>
                      <td>{m.id}</td>
                      <td><strong>{m.name}</strong></td>
                      <td>{m.username}</td>
                      <td>{m.email}</td>
                      <td><span className="badge badge-info">{m.department}</span></td>
                      <td>{m.contact}</td>
                      <td>
                        <div className="action-btns">
                          <button className="btn btn-warning btn-sm" onClick={() => openEdit(m)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.id)}>Delete</button>
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
              <h2>{editing ? 'Edit Manager' : 'Add New Manager'}</h2>
              {msg   && <div className="alert alert-success">{msg}</div>}
              {error && <div className="alert alert-error">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  {[
                    ['Full Name','text','name','Full name'],
                    ['Username','text','username','Username'],
                    ['Email','email','email','Email'],
                    ['Department','text','department','Department'],
                    ['Contact','text','contact','Phone number'],
                  ].map(([label,type,key,ph]) => (
                    <div className="form-group" key={key}>
                      <label>{label}</label>
                      <input type={type} value={form[key]} placeholder={ph} required
                        onChange={e => setForm({...form,[key]:e.target.value})} />
                    </div>
                  ))}
                  <div className="form-group">
                    <label>{editing ? 'New Password (blank = keep current)' : 'Password'}</label>
                    <input type="password" value={form.password} placeholder="Password"
                      required={!editing} onChange={e => setForm({...form,password:e.target.value})} />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Add'} Manager</button>
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
