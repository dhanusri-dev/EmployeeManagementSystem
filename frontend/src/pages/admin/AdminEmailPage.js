import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { sendEmail, getAllEmails, getAllEmployees, getAllManagers } from '../../services/api';

export default function AdminEmailPage() {
  const [emails, setEmails]     = useState([]);
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [form, setForm]         = useState({ to:'', subject:'', message:'' });
  const [msg, setMsg]           = useState('');
  const [error, setError]       = useState('');
  const [sending, setSending]   = useState(false);

  const load = () => {
    getAllEmails().then(r => setEmails(r.data)).catch(() => {});
    getAllEmployees().then(r => setEmployees(r.data)).catch(() => {});
    getAllManagers().then(r => setManagers(r.data)).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const handleSend = async (e) => {
    e.preventDefault(); setSending(true); setMsg(''); setError('');
    try {
      await sendEmail(form.to, form.subject, form.message);
      setMsg('Email sent successfully!');
      setForm({ to:'', subject:'', message:'' });
      load();
    } catch (err) { setError('Failed to send email'); }
    finally { setSending(false); }
  };

  const allContacts = [
    ...employees.map(e => ({ label:`${e.name} (Employee)`, value:e.email })),
    ...managers.map(m => ({ label:`${m.name} (Manager)`, value:m.email })),
  ];

  const statusClass = { SENT:'badge-success', FAILED:'badge-danger' };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="top-bar"><h2>Email Management</h2></div>
        <div className="page-header"><h1>Email Center</h1></div>

        <div className="card">
          <h3 style={{marginBottom:16}}>Compose Email</h3>
          {msg   && <div className="alert alert-success">{msg}</div>}
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSend}>
            <div className="form-grid">
              <div className="form-group">
                <label>To (Quick Select)</label>
                <select value={form.to} onChange={e => setForm({...form,to:e.target.value})}>
                  <option value="">-- Select contact --</option>
                  {allContacts.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Or Enter Email</label>
                <input type="email" value={form.to} placeholder="recipient@email.com"
                  onChange={e => setForm({...form,to:e.target.value})} required />
              </div>
              <div className="form-group" style={{gridColumn:'1/-1'}}>
                <label>Subject</label>
                <input value={form.subject} placeholder="Email subject" required
                  onChange={e => setForm({...form,subject:e.target.value})} />
              </div>
              <div className="form-group" style={{gridColumn:'1/-1'}}>
                <label>Message</label>
                <textarea value={form.message} placeholder="Email message..." required rows={5}
                  onChange={e => setForm({...form,message:e.target.value})} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={sending} style={{marginTop:8}}>
              {sending ? 'Sending...' : '📤 Send Email'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3 style={{marginBottom:16}}>Email Log ({emails.length})</h3>
          <div className="table-container">
            <table>
              <thead><tr><th>ID</th><th>To</th><th>Subject</th><th>Sent At</th><th>Status</th></tr></thead>
              <tbody>
                {emails.length === 0
                  ? <tr><td colSpan={5} style={{textAlign:'center',padding:32,color:'#9ca3af'}}>No emails sent yet</td></tr>
                  : emails.slice().reverse().map(e => (
                    <tr key={e.id}>
                      <td>{e.id}</td>
                      <td>{e.recipient}</td>
                      <td>{e.subject}</td>
                      <td>{new Date(e.sentAt).toLocaleString()}</td>
                      <td><span className={`badge ${statusClass[e.status]||'badge-secondary'}`}>{e.status}</span></td>
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
