import React, { useState, useMemo, useEffect, useRef } from 'react';
import Icon from './Icon.jsx';
import GaugeChart from '../charts/GaugeChart.jsx';
import DeepDivePopup from './DeepDivePopup.jsx';
import { CLIENT_INSTANCES } from '../data.js';

function InstanceCard({ inst, onClick }) {
  const [dotHover, setDotHover] = useState(false);
  const dotLeaveTimer = useRef(null);
  const gaugeColor = inst.health >= 80 ? "#3287C4" : inst.health >= 50 ? "#DB6C03" : "#B21111";
  const deltaColor = inst.delta >= 0 ? "#0A6E5E" : "#B21111";

  const insightData = {
    drop: Math.abs(inst.delta) + "%",
    projection: `If the current trend continues, health may improve by ~${Math.abs(inst.delta)}% over the next 2 weeks, assuming no further load spikes.`,
    factors: [
      { text: "Increased load on compute layer", dir: "up" },
      { text: "Capacity nearing threshold", dir: "up" },
      { text: "Query response time degraded", dir: "up" },
      { text: "Cache hit rate", dir: "down" },
    ]
  };

  return (
    <div className="cl-inst-card">
      <div className="cl-inst-card-top" style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span className="cl-inst-type">{inst.type}</span>
          <span className="cl-inst-name">{inst.name}</span>
        </div>
        <button className="btn-ghost" style={{ height: 28, padding: "0 10px", fontSize: 12, flexShrink: 0, marginTop: 2 }} onClick={e => { e.stopPropagation(); onClick && onClick(); }}>
          View Details <Icon name="chevron-right" size={12} />
        </button>
      </div>
      <div className="cl-inst-gauge-wrap" style={{ position: "relative" }}>
        <GaugeChart value={inst.health} delta={inst.delta} size={410} strokeW={20} color={gaugeColor} />
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 2,
          display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none"
        }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span className="cl-inst-pct" style={{ color: gaugeColor, fontSize: 48, fontWeight: 800 }}>{inst.health}%</span>
            <span className="cl-inst-delta" style={{ color: deltaColor, fontSize: 18 }}>
              {inst.delta >= 0 ? "+" : ""}{inst.delta} %
            </span>
          </div>
          <div className="cl-inst-health-label" style={{ marginTop: 4, fontSize: 18, fontWeight: 600 }}>Instance Health</div>
        </div>
      </div>
      <div className="cl-inst-scale">
        <span>0</span>
        <span>14</span>
      </div>
      <div className="cl-inst-divider" />
      <div className="cl-inst-footer">
        <span className="cl-inst-insight">• {inst.insight}</span>
        <div className="ddp-wrap"
          onMouseEnter={e => { e.stopPropagation(); clearTimeout(dotLeaveTimer.current); setDotHover(true); }}
          onMouseLeave={e => { e.stopPropagation(); dotLeaveTimer.current = setTimeout(() => setDotHover(false), 80); }}
          onClick={e => e.stopPropagation()}>
          <div className="cl-inst-live-dot" title="Deep Dive Insights" style={{ opacity: dotHover ? 1 : 0.7, transition: "opacity .15s" }}>
            <svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="7" fill="none" stroke="#0A6E5E" strokeWidth="1.5" /><circle cx="9" cy="9" r="4" fill="#0A6E5E" /></svg>
          </div>
          <DeepDivePopup visible={dotHover} insight={insightData}
            onKeepOpen={() => { clearTimeout(dotLeaveTimer.current); setDotHover(true); }}
            onClose={() => { dotLeaveTimer.current = setTimeout(() => setDotHover(false), 80); }} />
        </div>
      </div>
    </div>
  );
}

export default function ClientDetail({ client, onBack, allClients, onSelectInstance }) {
  const [instTab, setInstTab] = useState("All");
  const [instQuery, setInstQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 9;

  const instances = CLIENT_INSTANCES[client.id] || [];
  const tabs = ["All", "Stage Instances", "Production Instances", "Teams", "Alignments"];

  const filtered = useMemo(() => {
    let arr = instances;
    if (instTab === "Stage Instances") arr = arr.filter(i => i.type === "Stage Instance");
    if (instTab === "Production Instances") arr = arr.filter(i => i.type === "Production Instance");
    if (instQuery) arr = arr.filter(i => i.name.toLowerCase().includes(instQuery.toLowerCase()));
    return arr;
  }, [instTab, instQuery, instances]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => { setPage(1); }, [instTab, instQuery]);

  const kpis = [
    { num: "63", delta: "-17", dir: "down", label: "Client Risk Score", sub: "Total Value: 100" },
    { num: "13", delta: "+2", dir: "up", label: "Active Stage Instances", sub: "Total Clients: 17" },
    { num: "125", delta: "-9", dir: "down", label: "Active Prod. Instances", sub: "Total Instances: 236" },
    { num: "47", delta: "-", dir: "flat", label: "Active Teams", sub: "Total Teams: 56" },
    { num: "5.3K", delta: "-0.7k", dir: "down", label: "Active Users", sub: "Total Users: 7,436" },
  ];

  const catchupItems = [
    "The number of user sessions increased by 45% compared to the previous week.",
    "NFR actual values breached threshold for 4 customers in the last 7 days.",
    "70% of user activity comes from just 3 out of 10 modules.",
  ];

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand">USAGE360</div>
        <div className="crumbs">
          <span style={{ cursor: "pointer", color: "var(--ink-3)" }} onClick={onBack}>System Overview</span>
          <Icon name="chevron-right" size={12} color="#B2B0B6" />
          <span className="active">Client Information</span>
        </div>
        <div className="spacer" />
        <div className="stamp">Updated on 05/07/2025 at 11:22:33</div>
        <button className="tbtn primary" onClick={() => { }}>
          <Icon name="sync" size={14} /> Sync Data
        </button>
        <button className="tbtn"><Icon name="eye" size={14} />Watchlist</button>
        <button className="tbtn"><Icon name="download" size={14} />Export</button>
        <div className="divider" />
        <div className="avatar">RK</div>
      </div>

      <div className="cl-header-strip">
        <button className="inst-back-btn" onClick={onBack} style={{ marginRight: 8 }} title="Back to System Overview">
          <Icon name="chevron-left" size={18} color="#716E79" />
        </button>
        <div className="cl-logo-main">
          <div className="cl-logo-circle">{client.logo}</div>
          <span className="cl-client-name">{client.name}</span>
        </div>
        <div style={{ flex: 1 }} />
        <div className="cl-client-nav">
          <div className="cl-nav-divider" />
          {allClients.filter(c => c.id !== client.id).map((c) => (
            <React.Fragment key={c.id}>
              <div className="cl-nav-logo" title={c.name} onClick={() => { }}>
                <span>{c.logo}</span>
              </div>
              <div className="cl-nav-divider" />
            </React.Fragment>
          ))}
        </div>
        <div className="spacer" />
        <button className="cl-dropdown-btn"><Icon name="chevron" size={20} /></button>
      </div>

      <div className="cl-kpi-section">
        <div className="cl-kpi-grid">
          <div className="cl-kpi-left">
            <div className="cl-kpi-card cl-kpi-big" style={{ borderColor: "var(--orange)" }}>
              <div className="cl-kpi-numrow">
                <span className="cl-kpi-num">{kpis[0].num}</span>
                <span className={"cl-kpi-delta " + kpis[0].dir}>{kpis[0].delta}</span>
              </div>
              <div className="cl-kpi-label">{kpis[0].label}</div>
              <div className="cl-kpi-sub">{kpis[0].sub}</div>
            </div>
            <div className="cl-kpi-card cl-kpi-big">
              <div className="cl-kpi-numrow">
                <span className="cl-kpi-num">83.5%</span>
                <span className="cl-kpi-delta down">-3%</span>
              </div>
              <div className="cl-kpi-label">Adoption Rate</div>
              <div className="cl-kpi-sub">Total Users: 7,436</div>
            </div>
          </div>
          <div className="cl-kpi-right">
            <div className="cl-kpi-row-4">
              {kpis.slice(1).map((k, i) => (
                <div key={i} className="cl-kpi-card cl-kpi-sm">
                  <div className="cl-kpi-numrow">
                    <span className="cl-kpi-num">{k.num}</span>
                    <span className={"cl-kpi-delta " + k.dir}>{k.delta}</span>
                  </div>
                  <div className="cl-kpi-label">{k.label}</div>
                  <div className="cl-kpi-sub">{k.sub}</div>
                </div>
              ))}
            </div>
            <div className="cl-catchup">
              <h3 className="cl-catchup-title">Quick Catchup</h3>
              <div className="cl-catchup-box">
                <ul>
                  {catchupItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cl-instance-section">
        <div className="cl-inst-header">
          <h2 className="cl-inst-title">Instance Data</h2>
          <div className="spacer" />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
            <span className="cl-showing">Showing All Results</span>
            <div className="searchbox" style={{ width: 260 }}>
              <Icon name="search" size={14} color="#B2B0B6" />
              <input placeholder="Search instances…" value={instQuery} onChange={e => setInstQuery(e.target.value)} />
            </div>
            <button className="iconbtn">
              <Icon name="filter" size={16} />
            </button>
            <button className="iconbtn">
              <Icon name="sort" size={16} />
            </button>
          </div>
        </div>
        <div className="cl-inst-tabs-row">
          <div className="cl-inst-tabs">
            {tabs.map(t => (
              <div key={t} className={"cl-inst-tab" + (instTab === t ? " active" : "")} onClick={() => setInstTab(t)}>
                {t}
              </div>
            ))}
          </div>
          <div className="spacer" style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
            <span className="cl-page-info">Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} of {filtered.length}</span>
            <div className="cl-pagination">
              <button className="cl-page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>‹</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                <button key={p} className={"cl-page-num" + (page === p ? " active" : "")} onClick={() => setPage(p)}>{p}</button>
              ))}
              {totalPages > 5 && <span style={{ color: "var(--ink-3)" }}>…</span>}
              <button className="cl-page-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>›</button>
            </div>
          </div>
        </div>

        <div className="cl-inst-grid">
          {paginated.map(inst => (
            <InstanceCard key={inst.id} inst={inst} onClick={() => onSelectInstance && onSelectInstance(inst)} />
          ))}
        </div>
      </div>

      <div className="footer">
        <div className="left">
          <span className="status"><span className="dot" />System Operational</span>
          <span className="sep">•</span>
          <span>Data refreshed 2 mins ago</span>
        </div>
        <div className="left">
          <a href="#">Feedback</a>
          <span className="sep">·</span>
          <a href="#">Support</a>
          <span className="sep">·</span>
          <a href="#">Documentation</a>
          <span className="sep">·</span>
          <span>© 2025 ZS · Internal Use</span>
        </div>
      </div>
    </div>
  );
}
