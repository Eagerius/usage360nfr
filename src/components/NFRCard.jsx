import React, { useState } from 'react';
import Icon from './Icon.jsx';
import NFRAreaChart from '../charts/NFRAreaChart.jsx';
import { NFR_SERIES } from '../data.js';

function RiskRing({ value, max = 100, size = 96, stroke = 10, color = "#0A6E5E" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const dash = c;
  const offset = c * (1 - pct);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="ring-bg" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} stroke={color}
        strokeDasharray={dash} strokeDashoffset={offset} strokeLinecap="round"
        className="ring-fg" transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x={size / 2} y={size / 2 - 2} textAnchor="middle" fill="#1A1628" style={{ font: "800 22px 'Open Sans'", letterSpacing: "-0.02em" }}>{value}</text>
      <text x={size / 2} y={size / 2 + 16} textAnchor="middle" fill="#716E79" style={{ font: "600 10px Inter", letterSpacing: "0.04em" }}>OF {max}</text>
    </svg>
  );
}

export default function NFRCard() {
  const [range, setRange] = useState("6M");
  const ranges = [["3M", "3M"], ["6M", "6M"], ["12M", "12M"], ["YTD", "YTD"]];
  return (
    <div className="card">
      <div className="card-hdr">
        <h3>System NFR Health</h3>
        <span className="hint">Normalized Volume Index</span>
        <div className="spacer" />
        <span className="chip live"><span className="pulse" />Live</span>
      </div>
      <div className="nfrmain">
        <div className="nfrscore">
          <RiskRing value={62} max={100} color="#0A6E5E" />
          <div className="delta" style={{ marginTop: 10 }}><Icon name="arrow-up" size={10} stroke={3} />+3.2 vs last period</div>
          <div className="meta">
            <div><b>Status:</b> Healthy</div>
            <div><b>Threshold:</b> 75 / 100</div>
            <div><b>Next review:</b> May 15</div>
          </div>
        </div>
        <div className="nfrright">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div className="nfrtabs">
              {ranges.map(([v, l]) => (
                <button key={v} className={range === v ? "on" : ""} onClick={() => setRange(v)}>{l}</button>
              ))}
            </div>
            <div className="spacer" style={{ flex: 1 }} />
            <div className="legend">
              <span className="item"><span className="line" style={{ background: "#3287C4" }} />Observed Usage</span>
              <span className="item"><span className="line" style={{ background: "#8D38FC" }} />Approved Capacity</span>
            </div>
          </div>
          <NFRAreaChart observed={NFR_SERIES.observed} approved={NFR_SERIES.approved} />
        </div>
      </div>
    </div>
  );
}
