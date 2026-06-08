import React, { useState, useEffect } from 'react';

export default function DeepDivePopup({ visible, insight, onKeepOpen, onClose }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => { if (!visible) setExpanded(false); }, [visible]);

  if (!visible) return null;

  const drop = insight && insight.drop ? insight.drop : "8%";
  const factors = insight && insight.factors ? insight.factors : [
    { text: "Increased load on compute layer", dir: "up" },
    { text: "Capacity nearing threshold", dir: "up" },
    { text: "Query response time degraded", dir: "up" },
    { text: "Cache hit rate", dir: "down" },
  ];
  const projection = insight && insight.projection
    ? insight.projection
    : "If the current trend continues, health may improve by ~8% over the next 2 weeks, assuming no further load spikes.";

  const W = 288, H = 64;
  const pts = [
    [0, 10], [40, 12], [80, 14], [120, 18], [160, 24], [200, 32], [250, 46], [W, 56]
  ];
  const pathD = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");

  return (
    <div className="ddp-popup" onMouseEnter={onKeepOpen} onMouseLeave={onClose} onMouseDown={e => e.stopPropagation()} onClick={e => e.stopPropagation()}>
      <div className="ddp-head">
        <div className="ddp-title-row">
          <div className="ddp-title">
            <span className="ddp-title-dot"></span>
            Health Degradation Detected
          </div>
          <span className="ddp-anomaly-badge">ANOMALY</span>
        </div>
        <div className="ddp-severity">
          <span className="ddp-sev-dot"></span>
          Moderate severity
          <span style={{ color: "var(--muted)" }}>·</span>
          Detected 2 days ago
        </div>
      </div>

      <div className="ddp-summary">
        Instance health dropped by <b>{drop}</b> compared to its recent baseline.
      </div>

      <div className="ddp-why">
        <div className="ddp-why-title">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2A71A4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
          Why This Matters
        </div>
        <div className="ddp-why-text">
          The drop exceeded normal variation observed over the past 14 days, suggesting a systemic rather than transient issue.
        </div>
      </div>

      <button className="ddp-view-btn" onClick={() => setExpanded(e => !e)}>
        {expanded ? "Hide Analysis" : "View Analysis"}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          {expanded
            ? <polyline points="18 15 12 9 6 15" />
            : <polyline points="6 9 12 15 18 9" />}
        </svg>
      </button>

      {expanded && (
        <div className="ddp-analysis">
          <div className="ddp-section-label">Contributing Factors</div>
          <div className="ddp-factors">
            {factors.map((f, i) => (
              <div key={i} className="ddp-factor">
                <div className="ddp-factor-left">
                  <span className="ddp-factor-dot"></span>
                  {f.text}
                </div>
                {f.dir === "up"
                  ? <span className="ddp-arr-up">↑</span>
                  : <span className="ddp-arr-down">↓</span>}
              </div>
            ))}
          </div>

          <div className="ddp-behaviour">
            <div className="ddp-beh-hdr">
              <span className="ddp-section-label" style={{ marginBottom: 0 }}>Behaviour Over Time</span>
              <span className="ddp-beh-hint">14-day window</span>
            </div>
            <svg viewBox={`0 0 ${W} ${H + 8}`} style={{ width: "100%", height: 72, display: "block" }}>
              <path d={pathD} fill="none" stroke="#2A8A7A" strokeWidth="2" strokeLinejoin="round" />
              <circle cx={W} cy={56} r="5" fill="#B21111" />
            </svg>
            <div className="ddp-spark-legend">
              <span><span className="ld" style={{ background: "#2A8A7A" }}></span>Health index</span>
              <span><span className="ld" style={{ background: "#B21111" }}></span>Anomaly point</span>
            </div>
          </div>

          <div className="ddp-projection">
            <div className="ddp-proj-title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0A6E5E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
              Projection
            </div>
            <div className="ddp-proj-text">{projection}</div>
          </div>

          <div className="ddp-confidence">Confidence: Moderate · Model: Trend Extrapolation</div>
        </div>
      )}
    </div>
  );
}
