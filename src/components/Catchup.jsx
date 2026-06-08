import React, { useState } from 'react';
import Icon from './Icon.jsx';

export default function Catchup() {
  const [tab, setTab] = useState("alerts");
  const alerts = [
    { kind: "danger", title: "<b>Lilly_001</b> projected to breach in ~9 days.", meta: "NFR threshold · high severity" },
    { kind: "warn", title: "<b>3 clients</b> likely to breach within 14 days.", meta: "Projected usage trend" },
    { kind: "warn", title: "<b>2 new clients</b> entered high-risk zone.", meta: "Crossed 80% capacity" },
    { kind: "info", title: "Customer address table superseded records growing 12% WoW.", meta: "Optimization recommended" },
    { kind: "info", title: "<b>205M</b> inactive custom-field records flagged for cleanup.", meta: "Resolves API timeouts" },
  ];
  const activity = [
    { kind: "info", title: "<b>Sanofi</b> added 95 active users last 7 days.", meta: "+5.3% MoM" },
    { kind: "info", title: "<b>Boehringer</b> users rose by 70.", meta: "Returning cohort" },
    { kind: "info", title: "Release <b>R-2026.3</b> deployed to 12 stage instances.", meta: "2h ago" },
  ];
  const items = tab === "alerts" ? alerts : activity;
  return (
    <div className="card catchup">
      <div className="card-hdr" style={{ paddingBottom: 0 }}>
        <h3>Quick Catchup</h3>
        <div className="spacer" />
        <button className="btn-ghost" style={{ height: 28, padding: "0 10px", fontSize: 12 }}>View all <Icon name="chevron-right" size={12} /></button>
      </div>
      <div className="tablist">
        <div className={"tab" + (tab === "alerts" ? " on" : "")} onClick={() => setTab("alerts")}>
          Alerts <span className="count">{alerts.length}</span>
        </div>
        <div className={"tab" + (tab === "activity" ? " on" : "")} onClick={() => setTab("activity")}>
          Activity <span className="count">{activity.length}</span>
        </div>
      </div>
      <div className="alertlist" style={{ maxHeight: 260, overflow: "auto" }}>
        {items.map((a, i) => (
          <div key={i} className={"alertitem " + a.kind}>
            <div className="icon">
              <Icon name={a.kind === "danger" ? "alert" : a.kind === "warn" ? "alert" : "info"} size={14} />
            </div>
            <div className="txt">
              <div className="title" dangerouslySetInnerHTML={{ __html: a.title }} />
              <div className="meta">{a.meta}</div>
            </div>
            <Icon name="chevron-right" size={14} color="#B2B0B6" />
          </div>
        ))}
      </div>
    </div>
  );
}
