import React from 'react';

export default function Footer() {
  return (
    <div className="footer">
      <div className="left">
        <span className="status"><span className="dot" />System Operational</span>
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
  );
}
