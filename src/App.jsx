import React, { useState, useEffect, useMemo } from 'react';
import { CLIENTS, DEPARTMENTS } from './data.js';
import TopBar from './components/TopBar.jsx';
import PageHeader from './components/PageHeader.jsx';
import KPIStrip from './components/KPIStrip.jsx';
import NFRCard from './components/NFRCard.jsx';
import Catchup from './components/Catchup.jsx';
import ClientCard from './components/ClientCard.jsx';
import Footer from './components/Footer.jsx';
import ClientDetail from './components/ClientDetail.jsx';
import InstanceDetail from './components/InstanceDetail.jsx';
import TweaksPanel, { useTweaks, TweakSection, TweakRadio } from './components/TweaksPanel.jsx';
import Icon from './components/Icon.jsx';

const TWEAK_DEFAULTS = { mood: 'signal', density: 'airy', emphasis: 'balanced' };

export default function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.body.dataset.mood = t.mood === "default" ? "" : t.mood;
    document.body.dataset.density = t.density;
    document.body.dataset.emphasis = t.emphasis;
  }, [t.mood, t.density, t.emphasis]);

  const [activeDept, setActiveDept] = useState("ZFP");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState({});
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("risk");
  const [filterRisk, setFilterRisk] = useState("all");
  const [toast, setToast] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [stamp, setStamp] = useState("Apr 18, 2026 · 11:22");
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [tweakOpen, setTweakOpen] = useState(false);

  useEffect(() => {
    const onClick = () => { setSortOpen(false); setFilterOpen(false); };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  function doSync() {
    setSyncing(true);
    setTimeout(() => {
      const d = new Date();
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const pad = n => String(n).padStart(2, "0");
      setStamp(`${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} · ${pad(d.getHours())}:${pad(d.getMinutes())}`);
      setSyncing(false);
      showToast("Data synced successfully");
    }, 900);
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }

  const filtered = useMemo(() => {
    let arr = CLIENTS.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
    if (filterRisk === "at-risk") arr = arr.filter(c => c.alert);
    if (filterRisk === "healthy") arr = arr.filter(c => !c.alert);
    arr = [...arr].sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "risk") return (b.alert ? 1 : 0) - (a.alert ? 1 : 0);
      if (sortBy === "users") return parseInt(b.stats[2].n.replace(/[^\d]/g, "")) - parseInt(a.stats[2].n.replace(/[^\d]/g, ""));
      return 0;
    });
    return arr;
  }, [query, sortBy, filterRisk]);

  const filterActive = filterRisk !== "all";

  if (selectedInstance && selectedClient) {
    return <InstanceDetail
      inst={selectedInstance}
      client={selectedClient}
      onBack={() => { setSelectedInstance(null); window.scrollTo(0, 0); }}
      allClients={CLIENTS}
    />;
  }

  if (selectedClient) {
    return <ClientDetail
      client={selectedClient}
      onBack={() => { setSelectedClient(null); window.scrollTo(0, 0); }}
      allClients={CLIENTS}
      onSelectInstance={(inst) => { setSelectedInstance(inst); window.scrollTo(0, 0); }}
    />;
  }

  return (
    <div className="app">
      <TopBar onSync={doSync} stamp={stamp} syncing={syncing} />
      <PageHeader active={activeDept} onChange={(id) => {
        setActiveDept(id);
        showToast(`Switched to ${DEPARTMENTS.find(d => d.id === id).label}`);
      }} />
      <div className="main">
        <KPIStrip />
        <div className="split">
          <NFRCard />
          <Catchup />
        </div>
        <div className="clientheader">
          <h2>Client Data</h2>
          <span className="count-pill">{filtered.length} of {CLIENTS.length}</span>
          <div className="spacer" />
          <div className="searchbox">
            <Icon name="search" size={14} color="#B2B0B6" />
            <input placeholder="Search clients…" value={query} onChange={e => setQuery(e.target.value)} />
            {query && <span style={{ cursor: 'pointer' }} onClick={() => setQuery('')}><Icon name="close" size={14} color="#716E79" /></span>}
          </div>
          <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
            <button className={"iconbtn" + (filterActive ? " active" : "")} onClick={() => { setFilterOpen(o => !o); setSortOpen(false); }}>
              <Icon name="filter" size={16} />
              {filterActive && <span className="dot" />}
            </button>
            {filterOpen && (
              <div className="menu">
                <div className="sectlabel">Filter by Risk</div>
                {[{ k: "all", l: "All clients" }, { k: "at-risk", l: "At risk only" }, { k: "healthy", l: "Healthy only" }].map(o => (
                  <div key={o.k} className={"item" + (filterRisk === o.k ? " sel" : "")} onClick={() => { setFilterRisk(o.k); setFilterOpen(false); }}>
                    <span>{o.l}</span>
                    <span className="chk">{filterRisk === o.k && <Icon name="check" size={10} color="#fff" stroke={3} />}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
            <button className="iconbtn" onClick={() => { setSortOpen(o => !o); setFilterOpen(false); }}>
              <Icon name="sort" size={16} />
            </button>
            {sortOpen && (
              <div className="menu">
                <div className="sectlabel">Sort by</div>
                {[{ k: "risk", l: "Risk (high first)" }, { k: "name-asc", l: "Name (A → Z)" }, { k: "name-desc", l: "Name (Z → A)" }, { k: "users", l: "Active Users" }].map(o => (
                  <div key={o.k} className={"item" + (sortBy === o.k ? " sel" : "")} onClick={() => { setSortBy(o.k); setSortOpen(false); }}>
                    <span>{o.l}</span>
                    <span className="chk">{sortBy === o.k && <Icon name="check" size={10} color="#fff" stroke={3} />}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "#716E79", border: "1px dashed #DEDCDE", borderRadius: 8, background: "#fff" }}>
            No clients match your search.
          </div>
        )}
        {filtered.map(c => (
          <ClientCard key={c.id} c={c}
            expanded={!!expanded[c.id]}
            onToggle={() => { setSelectedClient(c); window.scrollTo(0, 0); }} />
        ))}
      </div>
      <Footer />
      {toast && <div className="toast"><span className="dot" />{toast}</div>}

      {!tweakOpen && (
        <button className="tweak-btn" onClick={() => setTweakOpen(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 010 14.14M4.93 19.07a10 10 0 010-14.14" />
          </svg>
          Tweaks
        </button>
      )}

      <TweaksPanel open={tweakOpen} onClose={() => setTweakOpen(false)} title="Tweaks">
        <TweakSection label="Mood" />
        <TweakRadio label="" value={t.mood} options={[
          { value: "default", label: "Default" },
          { value: "signal", label: "Signal" },
          { value: "calm", label: "Calm" },
          { value: "command", label: "Command" },
        ]} onChange={v => setTweak("mood", v)} />
        <div style={{ fontSize: 11, color: "rgba(41,38,27,.55)", lineHeight: 1.4, marginTop: -2 }}>
          {t.mood === "signal" && "Risk-forward — alert cards pulse, danger states shout."}
          {t.mood === "calm" && "Desaturated palette, softer borders, alerts muted."}
          {t.mood === "command" && "Dark ops console — terminal type, sharp edges."}
          {t.mood === "default" && "Balanced — the original look."}
        </div>
        <TweakSection label="Density" />
        <TweakRadio label="" value={t.density} options={["airy", "balanced", "dense"]}
          onChange={v => setTweak("density", v)} />
        <TweakSection label="Data emphasis" />
        <TweakRadio label="" value={t.emphasis} options={[
          { value: "balanced", label: "Balanced" },
          { value: "numbers", label: "Numbers" },
          { value: "charts", label: "Charts" },
          { value: "story", label: "Story" },
        ]} onChange={v => setTweak("emphasis", v)} />
        <div style={{ fontSize: 11, color: "rgba(41,38,27,.55)", lineHeight: 1.4, marginTop: -2 }}>
          {t.emphasis === "numbers" && "Numbers dominate — charts dim, insights hidden."}
          {t.emphasis === "charts" && "Charts dominate — numbers shrink, insights hidden."}
          {t.emphasis === "story" && "Insight strips lead — numbers and charts recede."}
          {t.emphasis === "balanced" && "All three given equal weight."}
        </div>
      </TweaksPanel>
    </div>
  );
}
