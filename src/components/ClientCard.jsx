import React from 'react';
import Icon from './Icon.jsx';
import MultiLineChart from '../charts/MultiLineChart.jsx';
import BreachBarChart from '../charts/BreachBarChart.jsx';
import AdoptionLineChart from '../charts/AdoptionLineChart.jsx';

function Dtag({ dir, value }) {
  if (!value || value === "-") return <span className="dtag flat">—</span>;
  return <span className={"dtag " + dir}>{value}</span>;
}

function ChartCell({ title, hint, children }) {
  return (
    <div className="chartcell">
      <div className="cc-hdr">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div className="cc-ttl">{title}</div>
          <div style={{ fontSize: 11, color: "#716E79", fontFamily: "Inter,sans-serif" }}>{hint}</div>
        </div>
        <select className="cc-select" defaultValue="6M">
          <option>6M</option><option>3M</option><option>1Y</option><option>YTD</option>
        </select>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
}

export default function ClientCard({ c, expanded, onToggle }) {
  const mIcons = ["server", "layers", "users"];
  const mKinds = ["m-inst", "m-team", "m-user"];
  return (
    <div className={"clientcard" + (c.alert ? " alert" : "")}>
      <div className="ch-strip">
        <div className="ch-logo">{c.logo}</div>
        <div className="ch-meta">
          <div className="ch-name">
            <span>{c.name}</span>
            {c.alert && <span className="badge danger"><Icon name="alert" size={10} /> APPROACHING LIMIT</span>}
            {!c.alert && <span className="badge ok"><Icon name="check" size={10} /> HEALTHY</span>}
          </div>
          <div className="ch-tags">
            <span className="tag">ID: {c.id.toUpperCase()}</span>
            <span className="tag">Release R-2026.3</span>
            <span className="tag">{c.stats[0].n} instances</span>
            <span className="tag">Renewal: Q3 2026</span>
          </div>
        </div>
        <div className="ch-action">
          <button className="btn-ghost" onClick={onToggle}>
            More Details
            <Icon name="chevron-right" size={14} />
          </button>
        </div>
      </div>
      <div className="metricsrow">
        {c.stats.map((s, i) => (
          <div key={i} className={"metric " + mKinds[i]}>
            <div className="ico"><Icon name={mIcons[i]} size={18} /></div>
            <div className="tcol">
              <div className="tlbl">{s.l}</div>
              <div className="tval">
                <span className="tnum">{s.n}</span>
                <Dtag dir={s.dir} value={s.d} />
              </div>
              <div className="tsub">{s.s}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="chartsrow">
        <ChartCell title="Client Overview" hint="instances · teams · users">
          <MultiLineChart
            series={[c.overview.instances, c.overview.teams, c.overview.users]}
            colors={["#ED39DB", "#686EFF", "#DB6C03"]}
            labels={["Active Instances", "Active Teams", "Active Users"]}
            yLabel="Parameters"
          />
          <div className="legend" style={{ marginTop: 4, justifyContent: "center" }}>
            <span className="item"><span className="dot" style={{ background: "#ED39DB" }} />Instances</span>
            <span className="item"><span className="dot" style={{ background: "#686EFF" }} />Teams</span>
            <span className="item"><span className="dot" style={{ background: "#DB6C03" }} />Users</span>
          </div>
        </ChartCell>
        <ChartCell title="Breach Trend" hint="vs threshold">
          <BreachBarChart bars={c.breach.bars} threshold={c.breach.threshold} />
          <div className="legend" style={{ marginTop: 4, justifyContent: "center" }}>
            <span className="item"><span className="line" style={{ background: "#DB6C03" }} />Threshold</span>
            <span className="item"><span className="dot" style={{ background: "#3287C4" }} />Instance Health</span>
          </div>
        </ChartCell>
        <ChartCell title="Adoption Trend" hint="% active / licensed">
          <AdoptionLineChart values={c.adoption} />
          <div className="legend" style={{ marginTop: 4, justifyContent: "center" }}>
            <span className="item"><span className="dot" style={{ background: "#41AFFF" }} />Adoption Rate</span>
          </div>
        </ChartCell>
      </div>
      <div className="insightbar">
        <span className="ilab">Quick Insight</span>
        <span>{c.insight}</span>
      </div>
      {expanded && (
        <div className="expanded">
          <div className="xtile">
            <div className="tl">Capacity Headroom</div>
            <div className="tv">{Math.max(0, 100 - Math.round(c.adoption[c.adoption.length - 1]))}%</div>
            <div className="ts">Remaining before breach</div>
          </div>
          <div className="xtile">
            <div className="tl">Risk Factor</div>
            <div className="tv" style={{ color: c.alert ? "#B21111" : "#B58103" }}>{c.alert ? "High" : "Moderate"}</div>
            <div className="ts">{c.alert ? "Breach projected <14 days" : "Monitor closely"}</div>
          </div>
          <div className="xtile">
            <div className="tl">MoM Instance Δ</div>
            <div className="tv">{(c.overview.instances[5] - c.overview.instances[4] >= 0 ? "+" : "") + (c.overview.instances[5] - c.overview.instances[4])}</div>
            <div className="ts">vs prior month</div>
          </div>
          <div className="xtile">
            <div className="tl">Superseded Records</div>
            <div className="tv">72M</div>
            <div className="ts">Across tracked objects</div>
          </div>
        </div>
      )}
    </div>
  );
}
