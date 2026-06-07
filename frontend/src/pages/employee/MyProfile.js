import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { getEmployeeById, updateEmployee } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function MyProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm]         = useState({});
  const [msg, setMsg]           = useState('');
  const [error, setError]       = useState('');

  useEffect(() => {
    if (user?.id) getEmployeeById(user.id).then(r => { setProfile(r.data); setForm(r.data); }).catch(() => {});
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault(); setMsg(''); setError('');
    try {
      const payload = { ...form, password: form.newPassword || undefined };
      await updateEmployee(user.id, payload);
      setMsg('Profile updated successfully!');
      setEditMode(false);
      getEmployeeById(user.id).then(r => setProfile(r.data));
    } catch (err) { setError(err.response?.data?.message || 'Update failed'); }
  };

  if (!profile) return <div className="layout"><Sidebar /><div className="main-content"><div className="loading">Loading...</div></div></div>;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="top-bar"><h2>My Profile</h2></div>
        <div className="page-header">
          <h1>My Profile</h1>
          {!editMode && <button className="btn btn-primary" onClick={() => setEditMode(true)}>Edit Profile</button>}
        </div>

        {!editMode ? (
          <div className="card">
            <div style={{display:'flex',alignItems:'center',gap:20,marginBottom:28}}>
              <div style={{width:72,height:72,borderRadius:'50%',background:'#8b5cf6',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:28,fontWeight:700}}>
                {profile.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h2 style={{fontSize:20}}>{profile.name}</h2>
                <p style={{color:'#6b7280'}}>{profile.desigination} · {profile.department}</p>
                <span className={`badge ${profile.accountstatus==='ACTIVE'?'badge-success':'badge-danger'}`}>{profile.accountstatus}</span>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16}}>
              {[
                ['Employee ID', profile.id],
                ['Full Name', profile.name],
                ['Gender', profile.gender],
                ['Age', profile.age],
                ['Designation', profile.desigination],
                ['Department', profile.department],
                ['Salary', `₹${profile.salary?.toLocaleString()}`],
                ['Username', profile.username],
                ['Email', profile.email],
                ['Contact', profile.contact],
                ['Manager', profile.manager?.name || 'Not Assigned'],
              ].map(([label, value]) => (
                <div key={label} style={{background:'#f8fafc',borderRadius:8,padding:'12px 16px'}}>
                  <div style={{fontSize:12,color:'#6b7280',marginBottom:4}}>{label}</div>
                  <div style={{fontWeight:600}}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="card">
            <h3 style={{marginBottom:16}}>Edit Profile</h3>
            {msg   && <div className="alert alert-success">{msg}</div>}
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleUpdate}>
              <div className="form-grid">
                {[['name','Full Name','text'],['age','Age','number'],['desigination','Designation','text'],['contact','Contact','text']].map(([key,label,type]) => (
                  <div className="form-group" key={key}>
                    <label>{label}</label>
                    <input type={type} value={form[key]||''} onChange={e => setForm({...form,[key]:e.target.value})} />
                  </div>
                ))}
                <div className="form-group">
                  <label>New Password (leave blank to keep)</label>
                  <input type="password" value={form.newPassword||''} placeholder="New password"
                    onChange={e => setForm({...form,newPassword:e.target.value})} />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button type="button" className="btn btn-secondary" onClick={() => { setEditMode(false); setForm(profile); }}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
