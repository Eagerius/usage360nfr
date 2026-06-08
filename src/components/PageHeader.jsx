import React from 'react';
import { DEPARTMENTS } from '../data.js';

export default function PageHeader({ active, onChange }) {
  const curr = DEPARTMENTS.find(d => d.id === active);
  return (
    <div className="pageheader">
      <div className="depttabs tabs-top">
        {DEPARTMENTS.map(d => (
          <div key={d.id} className={"depttab" + (active === d.id ? " active" : "")} onClick={() => onChange(d.id)}>
            <span className="code">{d.id}</span>
            <span>{d.label}</span>
          </div>
        ))}
      </div>
      <div className="titlerow" style={{ marginTop: 18, marginBottom: 18 }}>
        <h1>{curr.label}</h1>
        <span className="sub">Real-time visibility across <b>62 clients</b> and <b>236 instances</b></span>
      </div>
    </div>
  );
}
