import React, { useState, useMemo, useRef } from 'react';
import Icon from './Icon.jsx';
import DeepDivePopup from './DeepDivePopup.jsx';
import SimulatePlan from './SimulatePlan.jsx';
import Highcharts from '../charts/index.js';

const OBJECT_NAMES_ALL = [
  "Customer", "Customer Alignments", "Customer Address",
  "Explicit Customer Alignments", "Teams", "Employees",
  "Employee Alignments", "Business Rules", "Business Rule Categories",
  "Geos", "Geo Alignments", "Products",
  "Positions"
];

const OBJECT_TABS_MAP = {
  "All": OBJECT_NAMES_ALL,
  "Database": ["Customer", "Customer Address", "Employees", "Positions"],
  "Objects": ["Customer Alignments", "Explicit Customer Alignments", "Teams", "Products"],
  "Alignments": ["Customer Alignments", "Explicit Customer Alignments", "Employee Alignments", "Geo Alignments"],
  "Business Rules": ["Business Rules", "Business Rule Categories"],
};

function generateObjectsForInstance(instName) {
  let seed = 0;
  for (let i = 0; i < instName.length; i++) seed = ((seed << 5) - seed + instName.charCodeAt(i)) | 0;
  function rng() { seed = (seed * 16807 + 0) % 2147483647; return (seed & 0x7fffffff) / 2147483647; }

  const atRiskIndices = new Set([0, 4, 7, 10]);

  return OBJECT_NAMES_ALL.map((name, idx) => {
    const count = Math.round(rng() * 20000 + 5000);
    const delta = Math.round(rng() * 8 - 5);
    const threshold = Math.round(rng() * 8 + 18);
    const isAtRisk = atRiskIndices.has(idx);

    const bars = [];
    for (let m = 0; m < 5; m++) {
      const base = isAtRisk
        ? Math.round(rng() * 18 + threshold - 4)
        : Math.round(rng() * 20 + 5);
      bars.push(base);
    }
    const predBar = isAtRisk
      ? Math.round(rng() * 12 + threshold - 2)
      : Math.round(rng() * 15 + 8);
    bars.push(predBar);

    return { name, count, delta, isAtRisk, threshold, bars };
  });
}

function ObjectDataCard({ obj }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const [dotHover, setDotHover] = useState(false);
  const dotLeaveTimer = useRef(null);
  const deltaColor = obj.delta < 0 ? "var(--danger)" : "var(--teal-deep)";

  const atRiskColor = "#8B1010";
  const healthyColor = "#3287C4";
  const predAtRisk = "rgba(180,40,40,0.28)";
  const predHealthy = "rgba(50,135,196,0.28)";

  const barColors = obj.bars.map((val, i) => {
    const isLast = i === obj.bars.length - 1;
    if (isLast) return obj.isAtRisk ? predAtRisk : predHealthy;
    return val > obj.threshold ? atRiskColor : healthyColor;
  });

  React.useEffect(() => {
    if (!containerRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = Highcharts.chart(containerRef.current, {
      chart: { type: 'column', height: 185, spacing: [8, 6, 6, 6], backgroundColor: 'transparent' },
      title: { text: null },
      credits: { enabled: false },
      xAxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        lineColor: '#87848D', tickLength: 0,
        labels: { style: { color: '#716E79', fontSize: '10px' } }
      },
      yAxis: {
        title: { text: 'Count', style: { color: '#2F2C3C', fontSize: '10px', fontWeight: '700' } },
        min: 0, max: 50, tickInterval: 10,
        gridLineColor: '#EEEEEE', lineWidth: 1, lineColor: '#87848D',
        labels: { style: { color: '#716E79', fontSize: '10px' } },
        plotLines: [{
          value: obj.threshold, color: '#DB6C03', width: 2.5, zIndex: 5,
        }]
      },
      tooltip: {
        backgroundColor: '#022D42', borderColor: 'transparent', borderRadius: 6,
        style: { color: '#fff', fontSize: '11px', fontFamily: 'Inter, sans-serif' },
        headerFormat: '<b>{point.key}</b><br/>',
        pointFormat: '<span style="color:{point.color}">●</span> Instance Health: <b>{point.y}</b><br/>Threshold: <b>' + obj.threshold + '</b>'
      },
      legend: { enabled: false },
      plotOptions: {
        column: {
          borderRadius: 2,
          borderWidth: 0,
          pointWidth: 28,
          colorByPoint: true,
          colors: barColors,
          states: { hover: { brightness: 0.1 } }
        }
      },
      series: [{ name: 'Instance Health', data: obj.bars }]
    });
    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, [obj.name, obj.isAtRisk]);

  return (
    <div className="obj-data-card">
      <div className="obj-card-header">
        <div className="obj-card-left">
          <div className="obj-card-title">{obj.name}</div>
          <div className="obj-card-metrics">
            <span className="obj-card-count">{obj.count.toLocaleString()}</span>
            <span className="obj-card-delta" style={{ color: deltaColor }}>{obj.delta}%</span>
            {obj.isAtRisk && (
              <span style={{
                background: '#B21111', color: '#fff', fontSize: 10, fontWeight: 700,
                padding: '3px 10px', borderRadius: 12, letterSpacing: '0.06em',
                fontFamily: 'Inter,sans-serif', display: 'inline-flex', alignItems: 'center'
              }}>AT RISK</span>
            )}
          </div>
        </div>
        <div className="obj-card-right">
          <select className="cc-select" defaultValue="6M" style={{ fontSize: 12, padding: '5px 10px', minWidth: 130 }}>
            <option value="6M">Last 6 Months</option>
            <option value="3M">Last 3 Months</option>
            <option value="1Y">Last 1 Year</option>
            <option value="YTD">YTD</option>
          </select>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F2C3C" strokeWidth="1.8" style={{ cursor: 'pointer', flexShrink: 0 }}>
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
          </svg>
        </div>
      </div>
      <div ref={containerRef} style={{ width: '100%', height: 185 }}></div>
      <div className="obj-card-legend">
        <span className="legend-item"><span className="legend-dot" style={{ background: '#DB6C03' }}></span>Threshold</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: '#3287C4' }}></span>Instance Healths</span>
      </div>
      <div className="obj-card-divider"></div>
      <div className="obj-card-insight">
        <span className="obj-insight-text">• Insight with Min Max points of the data</span>
        <div className="ddp-wrap"
          onMouseEnter={e => { e.stopPropagation(); clearTimeout(dotLeaveTimer.current); setDotHover(true); }}
          onMouseLeave={e => { e.stopPropagation(); dotLeaveTimer.current = setTimeout(() => setDotHover(false), 80); }}
          onClick={e => e.stopPropagation()}>
          <div className="cl-inst-live-dot" title="Deep Dive Insights" style={{ opacity: dotHover ? 1 : 0.7, transition: "opacity .15s" }}>
            <svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="7" fill="none" stroke="#0A6E5E" strokeWidth="1.5" /><circle cx="9" cy="9" r="4" fill="#0A6E5E" /></svg>
          </div>
          <DeepDivePopup visible={dotHover} insight={{
            drop: Math.abs(obj.delta) + "%",
            projection: `If the current trend continues, this object count may stabilize over the next 2 weeks, assuming no further load spikes.`,
            factors: [
              { text: "Increased load on compute layer", dir: "up" },
              { text: "Capacity nearing threshold", dir: "up" },
              { text: "Query response time degraded", dir: "up" },
              { text: "Cache hit rate", dir: "down" },
            ]
          }}
            onKeepOpen={() => { clearTimeout(dotLeaveTimer.current); setDotHover(true); }}
            onClose={() => { dotLeaveTimer.current = setTimeout(() => setDotHover(false), 80); }} />
        </div>
      </div>
    </div>
  );
}

export default function InstanceDetail({ inst, client, onBack, allClients }) {
  const [objTab, setObjTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [simObj, setSimObj] = useState(null);
  const [showSim, setShowSim] = useState(false);

  const objects = useMemo(() => generateObjectsForInstance(inst.name), [inst.name]);

  const filteredObjects = useMemo(() => {
    const tabObjects = OBJECT_TABS_MAP[objTab] || OBJECT_NAMES_ALL;
    let arr = objects.filter(o => tabObjects.includes(o.name));
    if (searchQuery) arr = arr.filter(o => o.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return arr;
  }, [objects, objTab, searchQuery]);

  const tabs = ["All", "Database", "Objects", "Alignments", "Business Rules"];

  const instType = inst.type === "Production Instance" ? "Production" : "Stage";
  const currentVersion = "R-2026." + (Math.abs(inst.name.charCodeAt(inst.name.length - 1) % 5) + 1);
  const upgradeVersion = "R-2026." + (Math.abs(inst.name.charCodeAt(inst.name.length - 1) % 5) + 2);
  const adoptionRate = inst.health + "%";

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand">USAGE360</div>
        <div className="crumbs">
          <span style={{ cursor: "pointer", color: "var(--ink-3)" }}>System Overview</span>
          <Icon name="chevron-right" size={12} color="#B2B0B6" />
          <span style={{ cursor: "pointer", color: "var(--ink-3)" }} onClick={onBack}>Client Information</span>
          <Icon name="chevron-right" size={12} color="#B2B0B6" />
          <span className="active">Instance Information</span>
        </div>
        <div className="spacer"></div>
        <div className="stamp">Updated on 05/07/2025 at 11:22:33</div>
        <button className="tbtn primary"><Icon name="sync" size={14} /> Sync Data</button>
        <button className="tbtn"><Icon name="eye" size={14} />Watchlist</button>
        <button className="tbtn"><Icon name="download" size={14} />Export</button>
        <div className="divider"></div>
        <div className="avatar">RK</div>
      </div>

      <div className="inst-header-section">
        <div className="inst-title-row">
          <button className="inst-back-btn" onClick={onBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ink-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <h1 className="inst-title">Instance Information</h1>
          <div className="spacer"></div>
          <button className="btn-ghost" style={{ gap: 8, marginLeft: 'auto' }} onClick={() => { setSimObj(null); setShowSim(true); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            Simulate Plan
          </button>
        </div>

        <div className="inst-filters-row">
          <div className="inst-filter-field">
            <label className="inst-filter-label">Instance Name</label>
            <div className="inst-filter-input">{inst.name}</div>
          </div>
          <div className="inst-filter-field">
            <label className="inst-filter-label">Instance Type</label>
            <div className="inst-filter-input">{instType}</div>
          </div>
          <div className="inst-filter-field">
            <label className="inst-filter-label">Current Version</label>
            <div className="inst-filter-input">{currentVersion}</div>
          </div>
          <div className="inst-filter-field">
            <label className="inst-filter-label">Available Upgradable Version</label>
            <div className="inst-filter-input">{upgradeVersion}</div>
          </div>
          <div className="inst-filter-field">
            <label className="inst-filter-label">Instance Adoption Rate</label>
            <div className="inst-filter-input">{adoptionRate}</div>
          </div>
        </div>
      </div>

      <div className="inst-divider-line"></div>

      <div className="inst-objects-section">
        <div className="inst-objects-header">
          <h2 className="inst-objects-title">Objects Data</h2>
          <div className="spacer"></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
            <span className="cl-showing">Showing All Results</span>
            <div className="searchbox" style={{ width: 260 }}>
              <Icon name="search" size={14} color="#B2B0B6" />
              <input placeholder="Search objects…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="inst-objects-tabs">
          {tabs.map(t => (
            <div key={t} className={"cl-inst-tab" + (objTab === t ? " active" : "")} onClick={() => setObjTab(t)}>
              {t}
            </div>
          ))}
        </div>

        <div className="inst-objects-grid">
          {filteredObjects.map((obj) => (
            <ObjectDataCard key={obj.name} obj={obj} />
          ))}
        </div>
      </div>

      {showSim && (
        <SimulatePlan
          inst={inst}
          obj={simObj}
          onClose={() => setShowSim(false)}
        />
      )}

      <div className="footer" style={{ margin: '0' }}>
        <div className="left">
          <span className="status"><span className="dot"></span>System Status: Operational</span>
          <span className="sep">•</span>
          <span>Data refreshed 2 mins ago</span>
        </div>
        <div className="left">
          <a href="#">Feedback</a>
          <span className="sep">|</span>
          <a href="#">Support</a>
          <span className="sep">|</span>
          <a href="#">Documentation</a>
        </div>
      </div>
      <div className="inst-copyright">
        © 2025 ZS | Internal Use Only • Data reflects observed system usage across client environments
      </div>
    </div>
  );
}
