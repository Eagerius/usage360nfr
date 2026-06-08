// Client Detail View - opened when "More Details" is clicked
const {useState: useState2, useMemo: useMemo2, useEffect: useEffect2, useRef: useRef2} = React;

// ─── GAUGE CHART (Highcharts solid gauge) ───
// Two-tone arc: full color for the base, lighter tint for the delta change.
// Flat (non-rounded) arc ends per user preference.
function GaugeChart({value, delta=0, size=200, strokeW=18, color}){
  const containerRef = useRef2(null);
  const chartRef = useRef2(null);
  const gaugeColor = color || (value >= 80 ? "#3287C4" : value >= 50 ? "#DB6C03" : "#B21111");

  // Lighter tint for the delta portion
  const lighten = (hex, amt=0.6) => {
    const m = hex.replace("#","").match(/.{2}/g);
    if(!m) return hex;
    const [r,g,b] = m.map(x => parseInt(x,16));
    const mix = c => Math.round(c + (255 - c) * amt);
    return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
  };
  const lightColor = lighten(gaugeColor, 0.6);

  const prior = Math.max(0, Math.min(100, value - delta));
  const bigVal = Math.max(value, prior);
  const smallVal = Math.min(value, prior);

  useEffect2(() => {
    if (!containerRef.current) return;
    chartRef.current = Highcharts.chart(containerRef.current, {
      chart: {
        type: 'solidgauge',
        height: size / 2 + 60,
        width: size,
        backgroundColor: 'transparent',
        margin: [0, 0, 0, 0],
      },
      title: { text: null },
      credits: { enabled: false },
      pane: {
        center: ['50%', '85%'],
        size: (size - 20) + 'px',
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor: '#E5E7EB',
          innerRadius: '70%',
          outerRadius: '100%',
          shape: 'arc',
          borderWidth: 0,
        }
      },
      yAxis: {
        min: 0, max: 100,
        lineWidth: 0,
        tickWidth: 0,
        minorTickInterval: null,
        labels: { enabled: false },
      },
      tooltip: { enabled: false },
      plotOptions: {
        solidgauge: {
          dataLabels: { enabled: false },
          rounded: false,
          innerRadius: '70%',
          radius: '100%',
        }
      },
      series: [
        { name: 'Range', data: [{ y: bigVal, color: lightColor }], enableMouseTracking: false },
        { name: 'Base', data: [{ y: smallVal, color: gaugeColor }], enableMouseTracking: false },
      ]
    });
    return () => { if(chartRef.current) chartRef.current.destroy(); };
  }, [value, delta, size, gaugeColor, lightColor, bigVal, smallVal]);

  return <div ref={containerRef} style={{width: size, height: size/2 + 60, marginBottom: -40, marginTop: 8}} />;
}

// ─── INSTANCE DATA (generated per client) ───
function generateInstances(clientName, clientId){
  const types = ["Production Instance", "Stage Instance"];
  const prefixes = clientId.split("_")[0];
  const names = [
    `${prefixes}-prod-app-01`, `${prefixes}-prod-app-02`,
    `${prefixes}-cache-edge-04`, `${prefixes}-analytics-07`,
    `${prefixes}-auth-svc-03`, `${prefixes}-api-node-09`,
    `${prefixes}-sched-task-05`, `${prefixes}-db-core-04`,
    `${prefixes}-auth-svc-05`, `${prefixes}-analytics-03`,
    `${prefixes}-prod-app-03`, `${prefixes}-stage-deploy-01`,
    `${prefixes}-queue-worker-02`, `${prefixes}-cache-warm-06`,
    `${prefixes}-metrics-agg-08`, `${prefixes}-log-ingest-10`,
    `${prefixes}-gateway-lb-11`, `${prefixes}-config-svc-12`,
    `${prefixes}-notif-push-13`, `${prefixes}-search-idx-14`,
  ];
  return names.map((name, i) => {
    const health = Math.round(Math.random() * 60 + 25);
    const delta = Math.round(Math.random() * 24 - 12);
    return {
      id: i,
      type: i < 6 ? types[0] : types[1],
      name: name,
      health: health,
      delta: delta,
      deltaDir: delta >= 0 ? "up" : "down",
      insight: `+${Math.abs(Math.round(Math.random()*12+2))} % Health improvement projection reasoning`,
      alignment: ["Alpha","Beta","Gamma","Delta"][i % 4],
      team: ["Core","Platform","Analytics","Infra"][i % 4],
    };
  });
}

// Seed instances per client deterministically
const CLIENT_INSTANCES = {};
CLIENTS.forEach(c => {
  // Use a simple seeded approach
  const saved = [];
  const prefixes = c.id.split("_")[0];
  const prodNames = [
    `${prefixes}-prod-app-01`, `${prefixes}-prod-app-02`, `${prefixes}-cache-edge-04`,
    `${prefixes}-analytics-07`, `${prefixes}-auth-svc-03`, `${prefixes}-api-node-09`,
  ];
  const stageNames = [
    `${prefixes}-sched-task-05`, `${prefixes}-db-core-04`, `${prefixes}-auth-svc-05`,
    `${prefixes}-analytics-03`, `${prefixes}-stage-deploy-01`, `${prefixes}-queue-worker-02`,
    `${prefixes}-cache-warm-06`, `${prefixes}-metrics-agg-08`,
  ];
  const healths = [98,72,48,82,58,90,32,46,28,78,64,55,88,42,71,36,67,53];
  const deltas =  [10,-8,6,10,-2,12,-16,-4,-10,4,2,-6,8,-3,5,-7,9,-1];
  const allNames = [...prodNames, ...stageNames];
  allNames.forEach((name, i) => {
    const h = healths[i % healths.length];
    const d = deltas[i % deltas.length];
    saved.push({
      id: i,
      type: i < prodNames.length ? "Production Instance" : "Stage Instance",
      name,
      health: h,
      delta: d,
      deltaDir: d >= 0 ? "up" : "down",
      insight: `+8 % Health improvement projection reasoning`,
      alignment: ["Alpha","Beta","Gamma","Delta"][i % 4],
      team: ["Core","Platform","Analytics","Infra"][i % 4],
    });
  });
  CLIENT_INSTANCES[c.id] = saved;
});

// ─── CLIENT DETAIL VIEW ───
function ClientDetailView({client, onBack, allClients, onSelectInstance}){
  const [instTab, setInstTab] = useState2("All");
  const [instQuery, setInstQuery] = useState2("");
  const [instSort, setInstSort] = useState2(false);
  const [instFilter, setInstFilter] = useState2(false);
  const [page, setPage] = useState2(1);
  const perPage = 9;

  const instances = CLIENT_INSTANCES[client.id] || [];
  const tabs = ["All", "Stage Instances", "Production Instances", "Teams", "Alignments"];

  const filtered = useMemo2(() => {
    let arr = instances;
    if(instTab === "Stage Instances") arr = arr.filter(i => i.type === "Stage Instance");
    if(instTab === "Production Instances") arr = arr.filter(i => i.type === "Production Instance");
    if(instQuery) arr = arr.filter(i => i.name.toLowerCase().includes(instQuery.toLowerCase()));
    return arr;
  }, [instTab, instQuery, instances]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page-1)*perPage, page*perPage);

  useEffect2(() => { setPage(1); }, [instTab, instQuery]);

  // KPI data for this client
  const kpis = [
    {num: "63", delta: "-17", dir: "down", label: "Client Risk Score", sub: "Total Value: 100"},
    {num: "13", delta: "+2", dir: "up", label: "Active Stage Instances", sub: "Total Clients: 17"},
    {num: "125", delta: "-9", dir: "down", label: "Active Prod. Instances", sub: "Total Instances: 236"},
    {num: "47", delta: "-", dir: "flat", label: "Active Teams", sub: "Total Teams: 56"},
    {num: "5.3K", delta: "-0.7k", dir: "down", label: "Active Users", sub: "Total Users: 7,436"},
  ];

  const catchupItems = [
    "The number of user sessions increased by 45% compared to the previous week.",
    "NFR actual values breached threshold for 4 customers in the last 7 days.",
    "70% of user activity comes from just 3 out of 10 modules.",
  ];

  return (
    <div className="app">
      {/* Top Bar */}
      <div className="topbar">
        <div className="brand">USAGE360</div>
        <div className="crumbs">
          <span style={{cursor:"pointer",color:"var(--ink-3)"}} onClick={onBack}>System Overview</span>
          <Icon name="chevron-right" size={12} color="#B2B0B6"/>
          <span className="active">Client Information</span>
        </div>
        <div className="spacer"/>
        <div className="stamp">Updated on 05/07/2025 at 11:22:33</div>
        <button className="tbtn primary" onClick={()=>{}}>
          <Icon name="sync" size={14}/> Sync Data
        </button>
        <button className="tbtn"><Icon name="eye" size={14}/>Watchlist</button>
        <button className="tbtn"><Icon name="download" size={14}/>Export</button>
        <div className="divider"/>
        <div className="avatar">RK</div>
      </div>

      {/* Client Header Strip */}
      <div className="cl-header-strip">
        <button className="inst-back-btn" onClick={onBack} style={{marginRight:8}} title="Back to System Overview">
          <Icon name="chevron-left" size={18} color="#716E79"/>
        </button>
        <div className="cl-logo-main">
          <div className="cl-logo-circle">{client.logo}</div>
          <span className="cl-client-name">{client.name}</span>
        </div>
        <div style={{flex:1}}/>
        <div className="cl-client-nav">
          <div className="cl-nav-divider"/>
          {allClients.filter(c=>c.id!==client.id).map((c,i) => (
            <React.Fragment key={c.id}>
              <div className="cl-nav-logo" title={c.name} onClick={()=>{}}>
                <span>{c.logo}</span>
              </div>
              <div className="cl-nav-divider"/>
            </React.Fragment>
          ))}
        </div>
        <div className="spacer"/>
        <button className="cl-dropdown-btn"><Icon name="chevron" size={20}/></button>
      </div>

      {/* KPI Section */}
      <div className="cl-kpi-section">
        <div className="cl-kpi-grid">
          {/* Left column: Risk Score + Adoption */}
          <div className="cl-kpi-left">
            <div className="cl-kpi-card cl-kpi-big" style={{borderColor:"var(--orange)"}}>
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
          {/* Right: 4 KPIs + Quick Catchup */}
          <div className="cl-kpi-right">
            <div className="cl-kpi-row-4">
              {kpis.slice(1).map((k,i) => (
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
                  {catchupItems.map((item,i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instance Data Section */}
      <div className="cl-instance-section">
        <div className="cl-inst-header">
          <h2 className="cl-inst-title">Instance Data</h2>
          <div className="spacer"/>
          <div style={{display:"flex",alignItems:"center",gap:10,marginLeft:"auto"}}>
            <span className="cl-showing">Showing All Results</span>
            <div className="searchbox" style={{width:260}}>
              <Icon name="search" size={14} color="#B2B0B6"/>
              <input placeholder="Search instances…" value={instQuery} onChange={e=>setInstQuery(e.target.value)}/>
            </div>
            <button className="iconbtn" onClick={()=>setInstFilter(f=>!f)}>
              <Icon name="filter" size={16}/>
            </button>
            <button className="iconbtn" onClick={()=>setInstSort(s=>!s)}>
              <Icon name="sort" size={16}/>
            </button>
          </div>
        </div>
        <div className="cl-inst-tabs-row">
          <div className="cl-inst-tabs">
            {tabs.map(t => (
              <div key={t} className={"cl-inst-tab"+(instTab===t?" active":"")} onClick={()=>setInstTab(t)}>
                {t}
              </div>
            ))}
          </div>
          <div className="spacer" style={{flex:1}}/>
          <div style={{display:"flex",alignItems:"center",gap:8,marginLeft:"auto"}}>
            <span className="cl-page-info">Showing {(page-1)*perPage+1}-{Math.min(page*perPage, filtered.length)} of {filtered.length}</span>
            <div className="cl-pagination">
              <button className="cl-page-btn" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>‹</button>
              {Array.from({length: Math.min(totalPages,5)}, (_,i) => i+1).map(p => (
                <button key={p} className={"cl-page-num"+(page===p?" active":"")} onClick={()=>setPage(p)}>{p}</button>
              ))}
              {totalPages > 5 && <span style={{color:"var(--ink-3)"}}>…</span>}
              <button className="cl-page-btn" disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)}>›</button>
            </div>
          </div>
        </div>

        {/* Instance Cards Grid */}
        <div className="cl-inst-grid">
          {paginated.map(inst => (
            <InstanceCard key={inst.id} inst={inst} onClick={()=>onSelectInstance && onSelectInstance(inst)}/>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="left">
          <span className="status"><span className="dot"/>System Operational</span>
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

// ─── DEEP DIVE POPUP ───
function DeepDivePopup({visible, insight, onKeepOpen, onClose}){
  const [expanded, setExpanded] = useState2(false);

  // Reset expand state when popup closes
  React.useEffect(() => { if(!visible) setExpanded(false); }, [visible]);

  if(!visible) return null;

  const drop = insight && insight.drop ? insight.drop : "8%";
  const factors = insight && insight.factors ? insight.factors : [
    {text:"Increased load on compute layer", dir:"up"},
    {text:"Capacity nearing threshold", dir:"up"},
    {text:"Query response time degraded", dir:"up"},
    {text:"Cache hit rate", dir:"down"},
  ];
  const projection = insight && insight.projection
    ? insight.projection
    : "If the current trend continues, health may improve by ~8% over the next 2 weeks, assuming no further load spikes.";

  // Simple SVG sparkline: a downward curve ending with anomaly dot
  const W = 288, H = 64;
  const pts = [
    [0,10],[40,12],[80,14],[120,18],[160,24],[200,32],[250,46],[W,56]
  ];
  const pathD = pts.map((p,i)=> (i===0?`M${p[0]},${p[1]}`:`L${p[0]},${p[1]}`)).join(" ");

  return (
    <div className="ddp-popup" onMouseEnter={onKeepOpen} onMouseLeave={onClose} onMouseDown={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()}>
      {/* Header */}
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
          <span style={{color:"var(--muted)"}}>·</span>
          Detected 2 days ago
        </div>
      </div>

      {/* Summary */}
      <div className="ddp-summary">
        Instance health dropped by <b>{drop}</b> compared to its recent baseline.
      </div>

      {/* Why this matters */}
      <div className="ddp-why">
        <div className="ddp-why-title">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2A71A4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          Why This Matters
        </div>
        <div className="ddp-why-text">
          The drop exceeded normal variation observed over the past 14 days, suggesting a systemic rather than transient issue.
        </div>
      </div>

      {/* View / Hide Analysis button */}
      <button className="ddp-view-btn" onClick={()=>setExpanded(e=>!e)}>
        {expanded ? "Hide Analysis" : "View Analysis"}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          {expanded
            ? <polyline points="18 15 12 9 6 15"/>
            : <polyline points="6 9 12 15 18 9"/>}
        </svg>
      </button>

      {/* Expanded analysis */}
      {expanded && (
        <div className="ddp-analysis">
          {/* Contributing Factors */}
          <div className="ddp-section-label">Contributing Factors</div>
          <div className="ddp-factors">
            {factors.map((f,i)=>(
              <div key={i} className="ddp-factor">
                <div className="ddp-factor-left">
                  <span className="ddp-factor-dot"></span>
                  {f.text}
                </div>
                {f.dir==="up"
                  ? <span className="ddp-arr-up">↑</span>
                  : <span className="ddp-arr-down">↓</span>}
              </div>
            ))}
          </div>

          {/* Behaviour Over Time */}
          <div className="ddp-behaviour">
            <div className="ddp-beh-hdr">
              <span className="ddp-section-label" style={{marginBottom:0}}>Behaviour Over Time</span>
              <span className="ddp-beh-hint">14-day window</span>
            </div>
            <svg viewBox={`0 0 ${W} ${H+8}`} className="ddp-spark-svg" style={{width:"100%",height:72,display:"block"}}>
              <path d={pathD} fill="none" stroke="#2A8A7A" strokeWidth="2" strokeLinejoin="round"/>
              <circle cx={W} cy={56} r="5" fill="#B21111"/>
            </svg>
            <div className="ddp-spark-legend">
              <span><span className="ld" style={{background:"#2A8A7A"}}></span>Health index</span>
              <span><span className="ld" style={{background:"#B21111"}}></span>Anomaly point</span>
            </div>
          </div>

          {/* Projection */}
          <div className="ddp-projection">
            <div className="ddp-proj-title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0A6E5E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
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

// ─── INSTANCE CARD ───
function InstanceCard({inst, onClick}){
  const [dotHover, setDotHover] = useState2(false);
  const dotLeaveTimer = React.useRef(null);
  const gaugeColor = inst.health >= 80 ? "#3287C4" : inst.health >= 50 ? "#DB6C03" : "#B21111";
  const deltaColor = inst.delta >= 0 ? "#0A6E5E" : "#B21111";

  const insightData = {
    drop: Math.abs(inst.delta) + "%",
    projection: `If the current trend continues, health may improve by ~${Math.abs(inst.delta)}% over the next 2 weeks, assuming no further load spikes.`,
    factors: [
      {text:"Increased load on compute layer", dir:"up"},
      {text:"Capacity nearing threshold", dir:"up"},
      {text:"Query response time degraded", dir:"up"},
      {text:"Cache hit rate", dir:"down"},
    ]
  };

  return (
    <div className="cl-inst-card">
      <div className="cl-inst-card-top" style={{flexDirection:"row",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
        <div style={{display:"flex",flexDirection:"column",gap:2}}>
          <span className="cl-inst-type">{inst.type}</span>
          <span className="cl-inst-name">{inst.name}</span>
        </div>
        <button className="btn-ghost" style={{height:28,padding:"0 10px",fontSize:12,flexShrink:0,marginTop:2}} onClick={e=>{e.stopPropagation();onClick && onClick();}}>
          View Details <Icon name="chevron-right" size={12}/>
        </button>
      </div>
      <div className="cl-inst-gauge-wrap" style={{position:"relative"}}>
        <GaugeChart value={inst.health} delta={inst.delta} size={410} strokeW={20} color={gaugeColor}/>
        {/* Labels positioned inside the gauge arc — bottom-aligned to arc base */}
        <div style={{
          position:"absolute", left:0, right:0, bottom:2,
          display:"flex", flexDirection:"column", alignItems:"center", pointerEvents:"none"
        }}>
          <div style={{display:"flex", alignItems:"baseline", gap:8}}>
            <span className="cl-inst-pct" style={{color: gaugeColor, fontSize:48, fontWeight:800}}>{inst.health}%</span>
            <span className="cl-inst-delta" style={{color: deltaColor, fontSize:18}}>
              {inst.delta >= 0 ? "+" : ""}{inst.delta} %
            </span>
          </div>
          <div className="cl-inst-health-label" style={{marginTop:4, fontSize:18, fontWeight:600}}>Instance Health</div>
        </div>
      </div>
      <div className="cl-inst-scale">
        <span>0</span>
        <span>14</span>
      </div>
      <div className="cl-inst-divider"/>
      <div className="cl-inst-footer">
        <span className="cl-inst-insight">• {inst.insight}</span>
        <div className="ddp-wrap"
             onMouseEnter={e=>{e.stopPropagation();clearTimeout(dotLeaveTimer.current);setDotHover(true);}}
             onMouseLeave={e=>{e.stopPropagation();dotLeaveTimer.current=setTimeout(()=>setDotHover(false),80);}}
             onClick={e=>e.stopPropagation()}>
          <div className="cl-inst-live-dot" title="Deep Dive Insights" style={{opacity: dotHover ? 1 : 0.7, transition:"opacity .15s"}}>
            <svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="7" fill="none" stroke="#0A6E5E" strokeWidth="1.5"/><circle cx="9" cy="9" r="4" fill="#0A6E5E"/></svg>
          </div>
          <DeepDivePopup visible={dotHover} insight={insightData}
            onKeepOpen={()=>{clearTimeout(dotLeaveTimer.current);setDotHover(true);}}
            onClose={()=>{dotLeaveTimer.current=setTimeout(()=>setDotHover(false),80);}}/>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {ClientDetailView, GaugeChart, InstanceCard, CLIENT_INSTANCES, DeepDivePopup});
