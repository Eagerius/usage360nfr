import React from 'react';
import { KPIS } from '../data.js';
import Icon from './Icon.jsx';

function Sparkline({ values, color = "#3287C4", w = 80, h = 28 }) {
  const pad = 2;
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;
  const step = (w - pad * 2) / (values.length - 1);
  const pts = values.map((v, i) => [pad + i * step, h - pad - ((v - min) / range) * (h - pad * 2)]);
  const d = pts.map((p, i) => `${i ? "L" : "M"} ${p[0]} ${p[1]}`).join(" ");
  return (
    <svg width={w} height={h}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.5" fill={color} />
    </svg>
  );
}

function Delta({ dir, value }) {
  if (!value || value === "-") return <span className="delta flat">—</span>;
  const iconName = dir === "up" ? "arrow-up" : dir === "down" ? "arrow-down" : null;
  return <span className={"delta " + dir}>{iconName && <Icon name={iconName} size={10} stroke={3} />}{value}</span>;
}

export default function KPIStrip() {
  const sparks = [
    { vals: [55, 58, 57, 60, 61, 62], color: "#5AD767" },
    { vals: [1, 2, 2, 3, 3, 3], color: "#DB6C03" },
    { vals: [87, 88, 86, 85, 84, 83.5], color: "#B21111" },
    { vals: [38, 40, 42, 45, 48, 50], color: "#8D38FC" },
    { vals: [1080, 1090, 1100, 1110, 1140, 1150], color: "#686EFF" },
    { vals: [4.7, 4.9, 5.0, 5.1, 5.2, 5.3], color: "#DB6C03" },
  ];
  return (
    <div className="kpirow">
      {KPIS.map((k, i) => {
        const featured = i === 0;
        return (
          <div key={i} className={"kpi" + (featured ? " featured" : "")}>
            <div className="name">{k.name}</div>
            <div className="numrow">
              <span className="num">{k.num}</span>
              {k.num === "62" && <span className="unit" style={featured ? { color: "rgba(255,255,255,.7)" } : {}}>/100</span>}
              <Delta dir={k.deltaDir} value={k.delta} />
            </div>
            {k.sub && <div className="sub">{k.sub}</div>}
            <div className="spark"><Sparkline values={sparks[i].vals} color={featured ? "#5AD767" : sparks[i].color} /></div>
          </div>
        );
      })}
    </div>
  );
}
