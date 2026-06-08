// v2 - improved hierarchy & layout
const {useState: uS, useEffect: uE, useMemo: uM, useRef: uR} = React;

function Icon({name, size=16, color="currentColor", stroke=2}){
  const s = size;
  const common = {width:s, height:s, viewBox:"0 0 24 24", fill:"none", stroke:color, strokeWidth:stroke, strokeLinecap:"round", strokeLinejoin:"round"};
  switch(name){
    case "sync": return <svg {...common}><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0115-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 01-15 6.7L3 16"/></svg>;
    case "eye": return <svg {...common}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "download": return <svg {...common}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
    case "plus": return <svg {...common} strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    case "search": return <svg {...common}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
    case "filter": return <svg {...common}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
    case "sort": return <svg {...common}><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="9" y2="18"/></svg>;
    case "chevron": return <svg {...common}><polyline points="6 9 12 15 18 9"/></svg>;
    case "chevron-right": return <svg {...common}><polyline points="9 18 15 12 9 6"/></svg>;
    case "chevron-left": return <svg {...common}><polyline points="15 18 9 12 15 6"/></svg>;
    case "calendar": return <svg {...common}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
    case "arrow-up": return <svg {...common} strokeWidth="2.5"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>;
    case "arrow-down": return <svg {...common} strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>;
    case "close": return <svg {...common}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
    case "alert": return <svg {...common} strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
    case "info": return <svg {...common}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
    case "trend-up": return <svg {...common}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
    case "users": return <svg {...common}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
    case "server": return <svg {...common}><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>;
    case "layers": return <svg {...common}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;
    case "external": return <svg {...common}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
    case "check": return <svg {...common} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>;
    case "dots": return <svg {...common}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>;
    default: return null;
  }
}

function Delta({dir, value}){
  if(!value || value==="-") return <span className="delta flat">—</span>;
  const iconName = dir==="up"?"arrow-up":dir==="down"?"arrow-down":null;
  return <span className={"delta "+dir}>{iconName && <Icon name={iconName} size={10} stroke={3}/>}{value}</span>;
}
function Dtag({dir, value}){
  if(!value || value==="-") return <span className="dtag flat">—</span>;
  return <span className={"dtag "+dir}>{value}</span>;
}

// ─── RISK RING ───
function RiskRing({value, max=100, size=96, stroke=10, color="#0A6E5E"}){
  const r = (size - stroke) / 2;
  const c = 2*Math.PI*r;
  const pct = Math.min(value/max, 1);
  const dash = c;
  const offset = c*(1-pct);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" strokeWidth={stroke} className="ring-bg"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" strokeWidth={stroke} stroke={color}
              strokeDasharray={dash} strokeDashoffset={offset} strokeLinecap="round"
              className="ring-fg" transform={`rotate(-90 ${size/2} ${size/2})`}/>
      <text x={size/2} y={size/2-2} textAnchor="middle" fill="#1A1628" style={{font:"800 22px 'Open Sans'",letterSpacing:"-0.02em"}}>{value}</text>
      <text x={size/2} y={size/2+16} textAnchor="middle" fill="#716E79" style={{font:"600 10px Inter",letterSpacing:"0.04em"}}>OF {max}</text>
    </svg>
  );
}

// ─── MINI SPARKLINE ───
function Sparkline({values, color="#3287C4", w=80, h=28}){
  const pad=2;
  const min=Math.min(...values), max=Math.max(...values);
  const range = max-min || 1;
  const step = (w-pad*2)/(values.length-1);
  const pts = values.map((v,i)=>[pad+i*step, h-pad-((v-min)/range)*(h-pad*2)]);
  const d = pts.map((p,i)=>`${i?"L":"M"} ${p[0]} ${p[1]}`).join(" ");
  return (
    <svg width={w} height={h}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="2.5" fill={color}/>
    </svg>
  );
}

// ─── TOPBAR ───
function TopBar({onSync, stamp, syncing}){
  return (
    <div className="topbar">
      <div className="brand">USAGE360</div>
      <div className="crumbs">
        <span>NFR Monitor</span>
        <Icon name="chevron-right" size={12} color="#B2B0B6"/>
        <span className="active">System Overview</span>
      </div>
      <div className="spacer"/>
      <div className="stamp">Last sync: {stamp}</div>
      <button className="tbtn primary" onClick={onSync} style={syncing?{opacity:.7}:{}}>
        <div style={{display:"inline-flex",animation:syncing?"spin 1s linear infinite":"none"}}>
          <Icon name="sync" size={14}/>
        </div>
        {syncing?"Syncing…":"Sync Data"}
      </button>
      <button className="tbtn"><Icon name="eye" size={14}/>Watchlist</button>
      <button className="tbtn"><Icon name="download" size={14}/>Export</button>
      <div className="divider"/>
      <div className="avatar" title="Account">RK</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ─── PAGE HEADER + TABS ───
function PageHeader({active, onChange}){
  const curr = DEPARTMENTS.find(d=>d.id===active);
  return (
    <div className="pageheader">
      <div className="depttabs tabs-top">
        {DEPARTMENTS.map(d=>(
          <div key={d.id} className={"depttab"+(active===d.id?" active":"")} onClick={()=>onChange(d.id)}>
            <span className="code">{d.id}</span>
            <span>{d.label}</span>
          </div>
        ))}
      </div>
      <div className="titlerow" style={{marginTop:18,marginBottom:18}}>
        <h1>{curr.label}</h1>
        <span className="sub">Real-time visibility across <b>62 clients</b> and <b>236 instances</b></span>
      </div>
    </div>
  );
}

// ─── KPI STRIP ───
function KPIStrip(){
  const icons = {
    "System Health Score":"alert",
    "Clients At Risk":"alert",
    "Cumm. Adoption Rate":"trend-up",
    "Active Instances":"server",
    "Active Teams":"layers",
    "Active Users":"users",
  };
  const sparks = [
    {vals:[55,58,57,60,61,62], color:"#5AD767"},
    {vals:[1,2,2,3,3,3], color:"#DB6C03"},
    {vals:[87,88,86,85,84,83.5], color:"#B21111"},
    {vals:[38,40,42,45,48,50], color:"#8D38FC"},
    {vals:[1080,1090,1100,1110,1140,1150], color:"#686EFF"},
    {vals:[4.7,4.9,5.0,5.1,5.2,5.3], color:"#DB6C03"},
  ];
  return (
    <div className="kpirow">
      {KPIS.map((k,i)=>{
        const featured = i===0;
        return (
          <div key={i} className={"kpi"+(featured?" featured":"")}>
            <div className="name">{k.name}</div>
            <div className="numrow">
              <span className="num">{k.num}</span>
              {k.num==="62"&&<span className="unit" style={featured?{color:"rgba(255,255,255,.7)"}:{}}>/100</span>}
              <Delta dir={k.deltaDir} value={k.delta}/>
            </div>
            {k.sub && <div className="sub">{k.sub}</div>}
            <div className="spark"><Sparkline values={sparks[i].vals} color={featured?"#5AD767":sparks[i].color}/></div>
          </div>
        );
      })}
    </div>
  );
}

// ─── NFR CARD (new) ───
function NFRCard(){
  const [range, setRange] = uS("6M");
  const ranges = [["3M","3M"],["6M","6M"],["12M","12M"],["YTD","YTD"]];
  return (
    <div className="card">
      <div className="card-hdr">
        <h3>System NFR Health</h3>
        <span className="hint">Normalized Volume Index</span>
        <div className="spacer"/>
        <span className="chip live"><span className="pulse"/>Live</span>
      </div>
      <div className="nfrmain">
        <div className="nfrscore">
          <RiskRing value={62} max={100} color="#0A6E5E"/>
          <div className="delta" style={{marginTop:10}}><Icon name="arrow-up" size={10} stroke={3}/>+3.2 vs last period</div>
          <div className="meta">
            <div><b>Status:</b> Healthy</div>
            <div><b>Threshold:</b> 75 / 100</div>
            <div><b>Next review:</b> May 15</div>
          </div>
        </div>
        <div className="nfrright">
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
            <div className="nfrtabs">
              {ranges.map(([v,l])=>(
                <button key={v} className={range===v?"on":""} onClick={()=>setRange(v)}>{l}</button>
              ))}
            </div>
            <div className="spacer" style={{flex:1}}/>
            <div className="legend">
              <span className="item"><span className="line" style={{background:"#3287C4"}}/>Observed Usage</span>
              <span className="item"><span className="line" style={{background:"#8D38FC"}}/>Approved Capacity</span>
            </div>
          </div>
          <NFRAreaChart observed={NFR_SERIES.observed} approved={NFR_SERIES.approved}/>
        </div>
      </div>
    </div>
  );
}

// ─── CATCHUP ───
function Catchup(){
  const [tab, setTab] = uS("alerts");
  const alerts = [
    {kind:"danger", title:"<b>Lilly_001</b> projected to breach in ~9 days.", meta:"NFR threshold · high severity"},
    {kind:"warn",   title:"<b>3 clients</b> likely to breach within 14 days.", meta:"Projected usage trend"},
    {kind:"warn",   title:"<b>2 new clients</b> entered high-risk zone.", meta:"Crossed 80% capacity"},
    {kind:"info",   title:"Customer address table superseded records growing 12% WoW.", meta:"Optimization recommended"},
    {kind:"info",   title:"<b>205M</b> inactive custom-field records flagged for cleanup.", meta:"Resolves API timeouts"},
  ];
  const activity = [
    {kind:"info", title:"<b>Sanofi</b> added 95 active users last 7 days.", meta:"+5.3% MoM"},
    {kind:"info", title:"<b>Boehringer</b> users rose by 70.", meta:"Returning cohort"},
    {kind:"info", title:"Release <b>R-2026.3</b> deployed to 12 stage instances.", meta:"2h ago"},
  ];
  const items = tab==="alerts"?alerts:activity;
  return (
    <div className="card catchup">
      <div className="card-hdr" style={{paddingBottom:0}}>
        <h3>Quick Catchup</h3>
        <div className="spacer"/>
        <button className="btn-ghost" style={{height:28,padding:"0 10px",fontSize:12}}>View all <Icon name="chevron-right" size={12}/></button>
      </div>
      <div className="tablist">
        <div className={"tab"+(tab==="alerts"?" on":"")} onClick={()=>setTab("alerts")}>
          Alerts <span className="count">{alerts.length}</span>
        </div>
        <div className={"tab"+(tab==="activity"?" on":"")} onClick={()=>setTab("activity")}>
          Activity <span className="count">{activity.length}</span>
        </div>
      </div>
      <div className="alertlist" style={{maxHeight:260,overflow:"auto"}}>
        {items.map((a,i)=>(
          <div key={i} className={"alertitem "+a.kind}>
            <div className="icon">
              <Icon name={a.kind==="danger"?"alert":a.kind==="warn"?"alert":"info"} size={14}/>
            </div>
            <div className="txt">
              <div className="title" dangerouslySetInnerHTML={{__html:a.title}}/>
              <div className="meta">{a.meta}</div>
            </div>
            <Icon name="chevron-right" size={14} color="#B2B0B6"/>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CLIENT CARD ───
function ClientCard({c, expanded, onToggle}){
  const mIcons = ["server","layers","users"];
  const mKinds = ["m-inst","m-team","m-user"];
  return (
    <div className={"clientcard"+(c.alert?" alert":"")}>
      <div className="ch-strip">
        <div className="ch-logo">{c.logo}</div>
        <div className="ch-meta">
          <div className="ch-name">
            <span>{c.name}</span>
            {c.alert && <span className="badge danger"><Icon name="alert" size={10}/> APPROACHING LIMIT</span>}
            {!c.alert && <span className="badge ok"><Icon name="check" size={10}/> HEALTHY</span>}
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
            {expanded?"Hide Details":"More Details"}
            <Icon name={expanded?"chevron":"chevron-right"} size={14}/>
          </button>
        </div>
      </div>
      <div className="metricsrow">
        {c.stats.map((s,i)=>(
          <div key={i} className={"metric "+mKinds[i]}>
            <div className="ico"><Icon name={mIcons[i]} size={18}/></div>
            <div className="tcol">
              <div className="tlbl">{s.l}</div>
              <div className="tval">
                <span className="tnum">{s.n}</span>
                <Dtag dir={s.dir} value={s.d}/>
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
            colors={["#ED39DB","#686EFF","#DB6C03"]}
            labels={["Active Instances","Active Teams","Active Users"]}
            yLabel="Parameters"
          />
          <div className="legend" style={{marginTop:4,justifyContent:"center"}}>
            <span className="item"><span className="dot" style={{background:"#ED39DB"}}/>Instances</span>
            <span className="item"><span className="dot" style={{background:"#686EFF"}}/>Teams</span>
            <span className="item"><span className="dot" style={{background:"#DB6C03"}}/>Users</span>
          </div>
        </ChartCell>
        <ChartCell title="Breach Trend" hint="vs threshold">
          <BreachBarChart bars={c.breach.bars} threshold={c.breach.threshold}/>
          <div className="legend" style={{marginTop:4,justifyContent:"center"}}>
            <span className="item"><span className="line" style={{background:"#DB6C03"}}/>Threshold</span>
            <span className="item"><span className="dot" style={{background:"#3287C4"}}/>Instance Health</span>
          </div>
        </ChartCell>
        <ChartCell title="Adoption Trend" hint="% active / licensed">
          <AdoptionLineChart values={c.adoption}/>
          <div className="legend" style={{marginTop:4,justifyContent:"center"}}>
            <span className="item"><span className="dot" style={{background:"#41AFFF"}}/>Adoption Rate</span>
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
            <div className="tv">{Math.max(0,100-Math.round(c.adoption[c.adoption.length-1]))}%</div>
            <div className="ts">Remaining before breach</div>
          </div>
          <div className="xtile">
            <div className="tl">Risk Factor</div>
            <div className="tv" style={{color:c.alert?"#B21111":"#B58103"}}>{c.alert?"High":"Moderate"}</div>
            <div className="ts">{c.alert?"Breach projected <14 days":"Monitor closely"}</div>
          </div>
          <div className="xtile">
            <div className="tl">MoM Instance Δ</div>
            <div className="tv">{(c.overview.instances[5]-c.overview.instances[4]>=0?"+":"")+(c.overview.instances[5]-c.overview.instances[4])}</div>
            <div className="ts">vs prior month</div>
          </div>
          <div className="xtile">
            <div className="tl">Superseded Records</div>
            <div className="tv">{(Math.round(Math.random()*80+40))}M</div>
            <div className="ts">Across tracked objects</div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChartCell({title, hint, children}){
  return (
    <div className="chartcell">
      <div className="cc-hdr">
        <div style={{display:"flex",flexDirection:"column"}}>
          <div className="cc-ttl">{title}</div>
          <div style={{fontSize:11,color:"#716E79",fontFamily:"Inter,sans-serif"}}>{hint}</div>
        </div>
        <select className="cc-select" defaultValue="6M">
          <option>6M</option><option>3M</option><option>1Y</option><option>YTD</option>
        </select>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center"}}>
        {children}
      </div>
    </div>
  );
}

// ─── APP ───
function App(){
  const [t, setTweak] = useTweaks(window.__TWEAK_DEFAULTS__);
  React.useEffect(()=>{
    document.body.dataset.mood = t.mood==="default" ? "" : t.mood;
    document.body.dataset.density = t.density;
    document.body.dataset.emphasis = t.emphasis;
  },[t.mood,t.density,t.emphasis]);
  const [activeDept, setActiveDept] = uS("ZFP");
  const [query, setQuery] = uS("");
  const [expanded, setExpanded] = uS({});
  const [sortOpen, setSortOpen] = uS(false);
  const [filterOpen, setFilterOpen] = uS(false);
  const [sortBy, setSortBy] = uS("risk");
  const [filterRisk, setFilterRisk] = uS("all");
  const [toast, setToast] = uS(null);
  const [syncing, setSyncing] = uS(false);
  const [stamp, setStamp] = uS("Apr 18, 2026 · 11:22");
  const [selectedClient, setSelectedClient] = uS(null);
  const [selectedInstance, setSelectedInstance] = uS(null);

  uE(()=>{
    const onClick = ()=>{ setSortOpen(false); setFilterOpen(false); };
    document.addEventListener("click", onClick);
    return ()=>document.removeEventListener("click", onClick);
  },[]);

  function doSync(){
    setSyncing(true);
    setTimeout(()=>{
      const d = new Date();
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const pad = n=>String(n).padStart(2,"0");
      setStamp(`${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} · ${pad(d.getHours())}:${pad(d.getMinutes())}`);
      setSyncing(false);
      showToast("Data synced successfully");
    }, 900);
  }
  function showToast(msg){
    setToast(msg);
    setTimeout(()=>setToast(null), 2400);
  }

  const filtered = uM(()=>{
    let arr = CLIENTS.filter(c=>c.name.toLowerCase().includes(query.toLowerCase()));
    if(filterRisk==="at-risk") arr = arr.filter(c=>c.alert);
    if(filterRisk==="healthy") arr = arr.filter(c=>!c.alert);
    arr = [...arr].sort((a,b)=>{
      if(sortBy==="name-asc") return a.name.localeCompare(b.name);
      if(sortBy==="name-desc") return b.name.localeCompare(a.name);
      if(sortBy==="risk") return (b.alert?1:0)-(a.alert?1:0);
      if(sortBy==="users") return parseInt(b.stats[2].n.replace(/[^\d]/g,""))-parseInt(a.stats[2].n.replace(/[^\d]/g,""));
      return 0;
    });
    return arr;
  },[query, sortBy, filterRisk]);

  const filterActive = filterRisk !== "all";

  // If an instance is selected, show instance detail view
  if(selectedInstance && selectedClient){
    return <InstanceDetailView
      inst={selectedInstance}
      client={selectedClient}
      onBack={()=>{ setSelectedInstance(null); window.scrollTo(0,0); }}
      allClients={CLIENTS}
    />;
  }

  // If a client is selected, show detail view
  if(selectedClient){
    return <ClientDetailView
      client={selectedClient}
      onBack={()=>{ setSelectedClient(null); window.scrollTo(0,0); }}
      allClients={CLIENTS}
      onSelectInstance={(inst)=>{ setSelectedInstance(inst); window.scrollTo(0,0); }}
    />;
  }

  return (
    <div className="app">
      <TopBar onSync={doSync} stamp={stamp} syncing={syncing}/>
      <PageHeader active={activeDept} onChange={(id)=>{setActiveDept(id); showToast(`Switched to ${DEPARTMENTS.find(d=>d.id===id).label}`);}}/>
      <div className="main">
        <KPIStrip/>
        <div className="split">
          <NFRCard/>
          <Catchup/>
        </div>
        <div className="clientheader">
          <h2>Client Data</h2>
          <span className="count-pill">{filtered.length} of {CLIENTS.length}</span>
          <div className="spacer"/>
          <div className="searchbox">
            <Icon name="search" size={14} color="#B2B0B6"/>
            <input placeholder="Search clients…" value={query} onChange={e=>setQuery(e.target.value)}/>
            {query && <Icon name="close" size={14} color="#716E79"/>}
          </div>
          <div style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
            <button className={"iconbtn"+(filterActive?" active":"")} onClick={()=>{setFilterOpen(o=>!o); setSortOpen(false);}}>
              <Icon name="filter" size={16}/>
              {filterActive && <span className="dot"/>}
            </button>
            {filterOpen && (
              <div className="menu">
                <div className="sectlabel">Filter by Risk</div>
                {[{k:"all",l:"All clients"},{k:"at-risk",l:"At risk only"},{k:"healthy",l:"Healthy only"}].map(o=>(
                  <div key={o.k} className={"item"+(filterRisk===o.k?" sel":"")} onClick={()=>{setFilterRisk(o.k); setFilterOpen(false);}}>
                    <span>{o.l}</span>
                    <span className="chk">{filterRisk===o.k && <Icon name="check" size={10} color="#fff" stroke={3}/>}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
            <button className="iconbtn" onClick={()=>{setSortOpen(o=>!o); setFilterOpen(false);}}>
              <Icon name="sort" size={16}/>
            </button>
            {sortOpen && (
              <div className="menu">
                <div className="sectlabel">Sort by</div>
                {[{k:"risk",l:"Risk (high first)"},{k:"name-asc",l:"Name (A → Z)"},{k:"name-desc",l:"Name (Z → A)"},{k:"users",l:"Active Users"}].map(o=>(
                  <div key={o.k} className={"item"+(sortBy===o.k?" sel":"")} onClick={()=>{setSortBy(o.k); setSortOpen(false);}}>
                    <span>{o.l}</span>
                    <span className="chk">{sortBy===o.k && <Icon name="check" size={10} color="#fff" stroke={3}/>}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {filtered.length===0 && (
          <div style={{padding:40,textAlign:"center",color:"#716E79",border:"1px dashed #DEDCDE",borderRadius:8,background:"#fff"}}>
            No clients match your search.
          </div>
        )}
        {filtered.map(c=>(
          <ClientCard key={c.id} c={c}
            expanded={!!expanded[c.id]}
            onToggle={()=>{ setSelectedClient(c); window.scrollTo(0,0); }}/>
        ))}
      </div>
      <div className="footer">
        <div className="left">
          <span className="status"><span className="dot"/>System Operational</span>
          <span className="sep">•</span>
          <span>Data refreshed 2 mins ago</span>
          <span className="sep">•</span>
          <span>62 clients · 236 instances tracked</span>
        </div>
        <div className="left">
          <a href="#">Feedback</a>
          <span className="sep">·</span>
          <a href="#">Support</a>
          <span className="sep">·</span>
          <a href="#">Documentation</a>
          <span className="sep">·</span>
          <span>© 2026 ZS · Internal Use</span>
        </div>
      </div>
      {toast && <div className="toast"><span className="dot"/>{toast}</div>}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Mood"/>
        <TweakRadio label="" value={t.mood} options={[
          {value:"default",label:"Default"},
          {value:"signal",label:"Signal"},
          {value:"calm",label:"Calm"},
          {value:"command",label:"Command"},
        ]} onChange={v=>setTweak("mood",v)}/>
        <div style={{fontSize:11,color:"rgba(41,38,27,.55)",lineHeight:1.4,marginTop:-2}}>
          {t.mood==="signal"&&"Risk-forward — alert cards pulse, danger states shout."}
          {t.mood==="calm"&&"Desaturated palette, softer borders, alerts muted."}
          {t.mood==="command"&&"Dark ops console — terminal type, sharp edges."}
          {t.mood==="default"&&"Balanced — the original look."}
        </div>
        <TweakSection label="Density"/>
        <TweakRadio label="" value={t.density} options={["airy","balanced","dense"]}
          onChange={v=>setTweak("density",v)}/>
        <TweakSection label="Data emphasis"/>
        <TweakRadio label="" value={t.emphasis} options={[
          {value:"balanced",label:"Balanced"},
          {value:"numbers",label:"Numbers"},
          {value:"charts",label:"Charts"},
          {value:"story",label:"Story"},
        ]} onChange={v=>setTweak("emphasis",v)}/>
        <div style={{fontSize:11,color:"rgba(41,38,27,.55)",lineHeight:1.4,marginTop:-2}}>
          {t.emphasis==="numbers"&&"Numbers dominate — charts dim, insights hidden."}
          {t.emphasis==="charts"&&"Charts dominate — numbers shrink, insights hidden."}
          {t.emphasis==="story"&&"Insight strips lead — numbers and charts recede."}
          {t.emphasis==="balanced"&&"All three given equal weight."}
        </div>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
