import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { getDutiesByEmployee } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function MyDuties() {
  const { user } = useAuth();
  const [duties, setDuties] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (user?.id) getDutiesByEmployee(user.id).then(r => setDuties(r.data)).catch(() => {});
  }, [user]);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="top-bar"><h2>My Duties</h2></div>
        <div className="page-header"><h1>My Assigned Duties ({duties.length})</h1></div>

        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr><th>ID</th><th>Title</th><th>Assigned By</th><th>Description</th><th>Action</th></tr>
              </thead>
              <tbody>
                {duties.length === 0
                  ? <tr><td colSpan={5} style={{textAlign:'center',padding:32,color:'#9ca3af'}}>No duties assigned yet</td></tr>
                  : duties.map(d => (
                    <tr key={d.id}>
                      <td>{d.id}</td>
                      <td><strong>{d.title}</strong></td>
                      <td>{d.assignedByManager?.name || '—'}</td>
                      <td style={{maxWidth:300}}>
                        <div style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.description}</div>
                      </td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => setSelected(d)}>View Details</button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div className="modal-overlay" onClick={() => setSelected(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>{selected.title}</h2>
              <div style={{marginBottom:12}}>
                <span style={{fontSize:13,color:'#6b7280'}}>Assigned by: </span>
                <strong>{selected.assignedByManager?.name}</strong>
              </div>
              <div style={{background:'#f8fafc',borderRadius:8,padding:16,lineHeight:1.7,color:'#374151'}}>
                {selected.description}
              </div>
              <div style={{marginTop:20}}>
                <button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
