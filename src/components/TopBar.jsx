import React from 'react';
import Icon from './Icon.jsx';

export default function TopBar({ onSync, stamp, syncing }) {
  return (
    <div className="topbar">
      <div className="brand">USAGE360</div>
      <div className="crumbs">
        <span>NFR Monitor</span>
        <Icon name="chevron-right" size={12} color="#B2B0B6" />
        <span className="active">System Overview</span>
      </div>
      <div className="spacer" />
      <div className="stamp">Last sync: {stamp}</div>
      <button className="tbtn primary" onClick={onSync} style={syncing ? { opacity: .7 } : {}}>
        <div style={{ display: "inline-flex", animation: syncing ? "spin 1s linear infinite" : "none" }}>
          <Icon name="sync" size={14} />
        </div>
        {syncing ? "Syncing…" : "Sync Data"}
      </button>
      <button className="tbtn"><Icon name="eye" size={14} />Watchlist</button>
      <button className="tbtn"><Icon name="download" size={14} />Export</button>
      <div className="divider" />
      <div className="avatar" title="Account">RK</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
