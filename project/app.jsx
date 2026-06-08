// Main app
const {useState: uS, useEffect: uE, useMemo: uM, useRef: uR} = React;

function Icon({name, size=16, color="currentColor"}){
  const s = size;
  switch(name){
    case "sync": return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0115-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 01-15 6.7L3 16"/></svg>;
    case "eye": return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "download": return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
    case "plus": return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    case "search": return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
    case "filter": return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
    case "sort": return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="9" y2="18"/></svg>;
    case "chevron": return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>;
    case "calendar": return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
    case "up": return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3"><polyline points="18 15 12 9 6 15"/></svg>;
    case "down": return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>;
    case "close": return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
    default: return null;
  }
}

function Delta({dir, value}){
  if(!value || value==="-") return <span className="flat d">-</span>;
  const cls = dir==="up"?"up":dir==="down"?"down":"flat";
  return <span className={cls+" d"}>{value}</span>;
}

// ─── TOP BAR ───
function TopBar({onSync, stamp}){
  return (
    <div className="topbar">
      <div className="brand">USAGE360</div>
      <div className="crumb">
        <span>System Overview</span>
      </div>
      <div className="spacer"/>
      <div className="stamp">Updated on {stamp}</div>
      <button className="tbtn primary" onClick={onSync}>
        <Icon name="sync" size={12}/> Sync Data
      </button>
      <button className="tbtn">
        <Icon name="eye" size={14}/> Watchlist
      </button>
      <button className="tbtn">
        <Icon name="download" size={14}/> Export
      </button>
      <div className="avatar"/>
    </div>
  );
}

// ─── DEPT STRIP ───
function DeptStrip({active, onChange}){
  const main = DEPARTMENTS[0];
  const rest = DEPARTMENTS.slice(1);
  return (
    <div className="deptstrip">
      <div className="title">
        <span className="zfp" style={{fontWeight:700}}>{active}</span>
        <span className="label" style={{fontWeight:600}}>{DEPARTMENTS.find(d=>d.id===active)?.label || main.label}</span>
      </div>
      <div className="deptnav">
        {DEPARTMENTS.filter(d=>d.id!==active).map(d=>(
          <button key={d.id} className={"pill"} onClick={()=>onChange(d.id)} title={d.label}>{d.id}</button>
        ))}
      </div>
    </div>
  );
}

// ─── NFR CARD ───
function NFRCard(){
  const [range, setRange] = uS("Last 6 months");
  const [open, setOpen] = uS(false);
  const ranges = ["Last 3 months","Last 6 months","Last 12 months","YTD","Custom…"];
  return (
    <div className="card nfr">
      <div className="ttl">System NFR Health <span style={{color:"#716E79",fontSize:14}}>(Normalized Volume Index)</span></div>
      <div className="row">
        <div className="big">62<span style={{color:"#716E79",fontSize:20,fontWeight:400}}>/100</span></div>
        <div className="delta">+3.2</div>
        <div style={{position:"relative",marginLeft:"auto"}}>
          <div className="daterange" onClick={()=>setOpen(o=>!o)}>
            <Icon name="calendar" size={12} color="#716E79"/>
            <span>{range}</span>
            <Icon name="chevron" size={10} color="#716E79"/>
          </div>
          {open && (
            <div className="menu" style={{top:42,right:0,minWidth:170}}>
              {ranges.map(r=>(
                <div key={r} className={"item"+(r===range?" sel":"")} onClick={()=>{setRange(r);setOpen(false);}}>
                  {r}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="chart">
        <NFRAreaChart observed={NFR_SERIES.observed} approved={NFR_SERIES.approved}/>
      </div>
      <div className="legend">
        <span><span className="dot" style={{background:"#3287C4"}}/>Observed Usage</span>
        <span><span className="dot" style={{background:"#8D38FC"}}/>Approved Capacity</span>
      </div>
    </div>
  );
}

// ─── KPI TILE ───
function KpiTile({k, active, onClick}){
  return (
    <div className="kpi" style={active?{borderColor:"#3287C4",boxShadow:"0 0 0 2px rgba(50,135,196,.15)"}:{}} onClick={onClick}>
      <div className="num">
        <span>{k.num}</span>
        <Delta dir={k.deltaDir} value={k.delta}/>
      </div>
      <div className="name">{k.name}</div>
      {k.sub && <div className="sub">{k.sub}</div>}
    </div>
  );
}

// ─── CATCHUP ───
function Catchup(){
  return (
    <div className="catchup">
      <h3>Quick Catchup</h3>
      <div className="panel">
        <ul>
          {CATCHUP.map((c,i)=><li key={i}><span dangerouslySetInnerHTML={{__html:c.html}}/></li>)}
        </ul>
      </div>
    </div>
  );
}

// ─── CLIENT ROW ───
function ClientRow({c, expanded, onToggle}){
  return (
    <div className={"clientrow"+(c.alert?" alert":"")}>
      <div className="row-head">
        <div className="logo" title={c.name}>{c.logo}</div>
        <div className="name">{c.name}</div>
        {c.alert && <span className="badge">APPROACHING LIMIT</span>}
        <button className="btn-more" onClick={onToggle}>
          <Icon name="plus" size={14}/> {expanded?"Hide Details":"More Details"}
        </button>
      </div>
      <div className="row-body">
        <div className="statsCol">
          {c.stats.map((s,i)=>(
            <div key={i} className="stat">
              <div className="n"><span>{s.n}</span><Delta dir={s.dir} value={s.d}/></div>
              <div className="l">{s.l}</div>
              <div className="s">{s.s}</div>
            </div>
          ))}
        </div>
        <ChartCell title="Client Overview">
          <MultiLineChart
            series={[c.overview.instances, c.overview.teams, c.overview.users]}
            colors={["#ED39DB","#686EFF","#DB6C03"]}
            labels={["Active Instances","Active Teams","Active Users"]}
            yLabel="Parameters"
          />
          <div className="legend">
            <span><span className="dot" style={{background:"#ED39DB"}}/>Active Instances</span>
            <span><span className="dot" style={{background:"#686EFF"}}/>Active Teams</span>
            <span><span className="dot" style={{background:"#DB6C03"}}/>Active Users</span>
          </div>
        </ChartCell>
        <ChartCell title="Breach Trend">
          <BreachBarChart bars={c.breach.bars} threshold={c.breach.threshold}/>
          <div className="legend">
            <span><span className="dot" style={{background:"#DB6C03"}}/>Threshold</span>
            <span><span className="dot" style={{background:"#3287C4"}}/>Instance Healths</span>
          </div>
        </ChartCell>
        <ChartCell title="Adoption Trend">
          <AdoptionLineChart values={c.adoption}/>
          <div className="legend" style={{justifyContent:"flex-start",paddingLeft:36}}>
            <span><span className="dot" style={{background:"#41AFFF"}}/>Adoption Rate</span>
          </div>
        </ChartCell>
      </div>
      <div className="insight">
        <b>Quick Insights</b>
        <ul><li>{c.insight}</li></ul>
      </div>
      {expanded && (
        <div style={{padding:"16px 16px 20px",borderTop:"1px solid var(--border-soft)",background:"#FAFAFA"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
            <ExtendedPanel title="Capacity Headroom" value={`${Math.max(0,100-Math.round(c.adoption[c.adoption.length-1]))}%`} sub="Remaining before breach"/>
            <ExtendedPanel title="Risk Factor" value={c.alert?"High":"Moderate"} sub={c.alert?"Breach in <14 days":"Watch closely"} tone={c.alert?"danger":"warn"}/>
            <ExtendedPanel title="MoM Usage Δ" value={`${c.overview.instances[5] - c.overview.instances[4] >= 0 ?"+":""}${c.overview.instances[5]-c.overview.instances[4]} inst.`} sub="vs prior month"/>
          </div>
        </div>
      )}
    </div>
  );
}

function ExtendedPanel({title, value, sub, tone}){
  const colors = {danger:"#B21111", warn:"#DB6C03"};
  return (
    <div style={{background:"#fff",border:"1px solid #E5E7EB",padding:16,borderRadius:2}}>
      <div style={{fontSize:12,color:"#716E79",marginBottom:6,fontFamily:"Inter,sans-serif"}}>{title}</div>
      <div style={{fontSize:22,fontWeight:700,letterSpacing:-0.2,color:tone?colors[tone]:"#2F2C3C"}}>{value}</div>
      <div style={{fontSize:12,color:"#716E79",marginTop:4}}>{sub}</div>
    </div>
  );
}

function ChartCell({title, children}){
  return (
    <div className="chartBox">
      <div className="ch-hdr">
        <div className="ch-ttl">{title}</div>
        <input className="ch-input" placeholder="Text Field Input"/>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center"}}>
        {children}
      </div>
    </div>
  );
}

// ─── APP ───
function App(){
  const [activeDept, setActiveDept] = uS("ZFP");
  const [query, setQuery] = uS("");
  const [expanded, setExpanded] = uS({});
  const [sortOpen, setSortOpen] = uS(false);
  const [filterOpen, setFilterOpen] = uS(false);
  const [sortBy, setSortBy] = uS("risk");
  const [filterRisk, setFilterRisk] = uS("all");
  const [toast, setToast] = uS(null);
  const [stamp, setStamp] = uS("04/18/2026 at 11:22:33");

  uE(()=>{
    const onClick = ()=>{ setSortOpen(false); setFilterOpen(false); };
    document.addEventListener("click", onClick);
    return ()=>document.removeEventListener("click", onClick);
  },[]);

  function doSync(){
    const d = new Date();
    const pad = n=>String(n).padStart(2,"0");
    setStamp(`${pad(d.getMonth()+1)}/${pad(d.getDate())}/${d.getFullYear()} at ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    showToast("Data synced successfully");
  }
  function showToast(msg){
    setToast(msg);
    setTimeout(()=>setToast(null), 2200);
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

  const showing = query || filterRisk!=="all"
    ? `Showing ${filtered.length} of ${CLIENTS.length} Results`
    : "Showing All Results";

  return (
    <div className="app">
      <TopBar onSync={doSync} stamp={stamp}/>
      <DeptStrip active={activeDept} onChange={(id)=>{setActiveDept(id); showToast(`Switched to ${DEPARTMENTS.find(d=>d.id===id).label}`);}}/>
      <div className="overview">
        <NFRCard/>
        <div className="right">
          <div className="kpigrid">
            {KPIS.map((k,i)=>(
              <KpiTile key={i} k={k}/>
            ))}
          </div>
          <Catchup/>
        </div>
      </div>
      <div className="clientarea">
        <div className="cd-hdr">
          <h2>Client Data</h2>
          <span className="showing">{showing}</span>
          <div className="searchbox">
            <Icon name="search" size={14} color="#B2B0B6"/>
            <input placeholder="Search clients…" value={query} onChange={e=>setQuery(e.target.value)}/>
            {query && <Icon name="close" size={14} color="#716E79"/>}
          </div>
          <div style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
            <button className={"iconbtn"+(filterRisk!=="all"?" active":"")} onClick={()=>{setFilterOpen(o=>!o); setSortOpen(false);}}>
              <Icon name="filter" size={16}/>
            </button>
            {filterOpen && (
              <div className="menu">
                <div className="sectlabel">Filter by Risk</div>
                {[{k:"all",l:"All clients"},{k:"at-risk",l:"At risk only"},{k:"healthy",l:"Healthy only"}].map(o=>(
                  <div key={o.k} className={"item"+(filterRisk===o.k?" sel":"")} onClick={()=>{setFilterRisk(o.k); setFilterOpen(false);}}>
                    <span>{o.l}</span>
                    <span className="chk">{filterRisk===o.k && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}</span>
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
                {[{k:"name-asc",l:"Name (A → Z)"},{k:"name-desc",l:"Name (Z → A)"},{k:"risk",l:"Risk (high first)"},{k:"users",l:"Active Users"}].map(o=>(
                  <div key={o.k} className={"item"+(sortBy===o.k?" sel":"")} onClick={()=>{setSortBy(o.k); setSortOpen(false);}}>
                    <span>{o.l}</span>
                    <span className="chk">{sortBy===o.k && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {filtered.length===0 && (
          <div style={{padding:40,textAlign:"center",color:"#716E79",border:"1px dashed #DEDCDE"}}>
            No clients match your search.
          </div>
        )}
        {filtered.map(c=>(
          <ClientRow key={c.id} c={c}
            expanded={!!expanded[c.id]}
            onToggle={()=>setExpanded(e=>({...e,[c.id]:!e[c.id]}))}/>
        ))}
      </div>
      <div className="footer">
        <div className="footercol">
          <div style={{display:"flex",gap:18,alignItems:"center"}}>
            <span className="status"><span className="dot"/>System Status: Operational</span>
            <span className="sep">•</span>
            <span>Data refreshed 2 mins ago</span>
            <span className="sep">•</span>
            <a href="#">Feedback</a>
            <span className="sep">|</span>
            <a href="#">Support</a>
            <span className="sep">|</span>
            <a href="#">Documentation</a>
          </div>
          <div className="copy">© 2026 ZS | Internal Use Only • Data reflects observed system usage across client environments.</div>
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
