import React, { useState, useEffect, useRef, useMemo } from 'react';
import Highcharts from '../charts/index.js';

export default function SimulatePlan({ inst, obj, onClose }) {
  const [horizon, setHorizon] = useState("6M");
  const [growthMode, setGrowthMode] = useState("pct");
  const [growthPct, setGrowthPct] = useState(15);
  const [growthAbs, setGrowthAbs] = useState(3000);
  const [teamExpansion, setTeamExpansion] = useState(false);
  const [featureAdoption, setFeatureAdoption] = useState(false);
  const [saved, setSaved] = useState(false);
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  const baseVolume = obj ? obj.count : (inst ? Math.round(inst.health * 180 + 2000) : 17560);
  const threshold = obj ? obj.threshold * 1000 : 22000;
  const currentHealth = inst ? inst.health : 72;
  const isCurrentAtRisk = obj ? obj.isAtRisk : currentHealth < 70;

  const horizonMonths = horizon === "3M" ? 3 : horizon === "6M" ? 6 : 12;

  const appliedGrowth = useMemo(() => {
    let g = growthMode === "pct" ? baseVolume * (growthPct / 100) : growthAbs;
    if (teamExpansion) g += baseVolume * 0.08;
    if (featureAdoption) g += baseVolume * 0.05;
    return g;
  }, [growthMode, growthPct, growthAbs, teamExpansion, featureAdoption, baseVolume]);

  const simEndVolume = Math.round(baseVolume + appliedGrowth);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonthIdx = 4;
  const labels = Array.from({ length: horizonMonths + 1 }, (_, i) => months[(currentMonthIdx + i) % 12]);

  const currentSeries = Array.from({ length: horizonMonths + 1 }, () => baseVolume);
  const simSeries = Array.from({ length: horizonMonths + 1 }, (_, i) => {
    return Math.round(baseVolume + (appliedGrowth * i / horizonMonths));
  });

  const breachMonth = simSeries.findIndex(v => v > threshold);
  const willBreach = breachMonth !== -1;
  const breachLabel = willBreach ? labels[breachMonth] : null;

  useEffect(() => {
    if (!containerRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = Highcharts.chart(containerRef.current, {
      chart: {
        type: 'line',
        height: 220,
        spacing: [16, 12, 16, 12],
        backgroundColor: 'transparent',
        animation: { duration: 400 }
      },
      title: { text: null },
      credits: { enabled: false },
      xAxis: {
        categories: labels,
        lineColor: '#87848D',
        tickLength: 0,
        labels: { style: { color: '#716E79', fontSize: '11px', fontFamily: 'Inter, sans-serif' } }
      },
      yAxis: {
        title: { text: 'Volume', style: { color: '#2F2C3C', fontSize: '10px', fontWeight: '600', fontFamily: 'Inter, sans-serif' } },
        min: 0,
        gridLineColor: '#EEECEF',
        lineWidth: 1, lineColor: '#87848D',
        labels: {
          style: { color: '#716E79', fontSize: '10px', fontFamily: 'Inter, sans-serif' },
          formatter: function () { return this.value >= 1000 ? (this.value / 1000).toFixed(0) + 'K' : this.value; }
        },
        plotLines: [{
          value: threshold,
          color: '#DB6C03',
          width: 2,
          zIndex: 5,
          dashStyle: 'Dash',
          label: {
            text: 'NFR Threshold',
            style: { color: '#DB6C03', fontSize: '10px', fontFamily: 'Inter, sans-serif', fontWeight: '600' },
            align: 'right',
            x: -4,
            y: -6,
          }
        }]
      },
      tooltip: {
        shared: true,
        backgroundColor: '#022D42',
        borderColor: 'transparent',
        borderRadius: 6,
        shadow: false,
        style: { color: '#fff', fontSize: '11px', fontFamily: 'Inter, sans-serif' },
        headerFormat: '<b>{point.key}</b><br/>',
        pointFormatter: function () {
          const v = this.y >= 1000 ? (this.y / 1000).toFixed(1) + 'K' : this.y;
          return `<span style="color:${this.series.color}">●</span> ${this.series.name}: <b>${v}</b><br/>`;
        }
      },
      legend: { enabled: false },
      plotOptions: {
        line: {
          marker: { radius: 3.5, symbol: 'circle', lineWidth: 2, lineColor: null, fillColor: '#fff' },
          lineWidth: 2
        }
      },
      series: [
        {
          name: 'Current State',
          data: currentSeries,
          color: '#B2B0B6',
          dashStyle: 'Dot',
          lineWidth: 1.5,
          marker: { enabled: false },
          zIndex: 1
        },
        {
          name: 'Simulated Growth',
          data: simSeries,
          color: willBreach ? '#B21111' : '#0A6E5E',
          lineWidth: 2.5,
          zIndex: 3,
          zones: willBreach ? [
            { value: simSeries[breachMonth - 1] || simSeries[0], color: '#0A6E5E' },
            { color: '#B21111' }
          ] : []
        }
      ]
    });
    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, [JSON.stringify(simSeries), horizon]);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  const objName = obj ? obj.name : (inst ? inst.name : "Instance");

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(2,45,66,0.35)',
        zIndex: 300, animation: 'fadeIn .2s'
      }}></div>

      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 520,
        background: '#fff', borderLeft: '1px solid var(--border)',
        boxShadow: '-20px 0 60px rgba(2,45,66,.12)',
        zIndex: 301, display: 'flex', flexDirection: 'column',
        animation: 'slideInRight .25s cubic-bezier(.3,.9,.4,1)',
        fontFamily: '"Open Sans", sans-serif',
        overflowY: 'auto'
      }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{
                  background: 'var(--orange-soft)', color: 'var(--orange)', fontSize: 10, fontWeight: 700,
                  padding: '2px 8px', borderRadius: 10, letterSpacing: '.06em', fontFamily: 'Inter,sans-serif'
                }}>SIMULATION</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--navy)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>Simulate Plan</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4, fontFamily: 'Inter,sans-serif' }}>
                Explore future impact without affecting live data
              </div>
            </div>
            <button onClick={onClose} style={{
              width: 32, height: 32, border: '1px solid var(--border)', borderRadius: 6,
              background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0, color: 'var(--ink-3)', transition: 'all .15s'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, justifyContent: 'space-between' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#fff', border: '1px solid var(--border)', borderRadius: 6,
              padding: '6px 12px', fontSize: 13, color: 'var(--ink)', fontFamily: 'Inter,sans-serif',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
              <span style={{ color: 'var(--ink-3)' }}>Object:</span>
              <span style={{ fontWeight: 600 }}>{objName}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--ink-3)', fontFamily: 'Inter,sans-serif' }}>Horizon:</span>
              <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 6, padding: 2, background: '#fff', gap: 2 }}>
                {["3M", "6M", "12M"].map(h => (
                  <button key={h} onClick={() => setHorizon(h)} style={{
                    padding: '4px 12px', fontSize: 12, fontWeight: 600,
                    borderRadius: 4, border: 'none', cursor: 'pointer', fontFamily: 'Inter,sans-serif',
                    background: horizon === h ? 'var(--navy)' : 'transparent',
                    color: horizon === h ? '#fff' : 'var(--ink-3)',
                    transition: 'all .15s'
                  }}>{h}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ padding: '16px 0', borderBottom: '1px solid var(--border-2)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--ink-3)', fontFamily: 'Inter,sans-serif', marginBottom: 10 }}>Current Baseline</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {[
                { label: 'Volume', val: baseVolume.toLocaleString() },
                { label: 'NFR Threshold', val: threshold.toLocaleString() },
                { label: 'Health Status', val: isCurrentAtRisk ? 'At Risk' : 'Healthy', color: isCurrentAtRisk ? 'var(--danger)' : 'var(--teal-deep)', bg: isCurrentAtRisk ? 'var(--danger-soft)' : 'var(--teal-soft)' },
              ].map((m, i) => (
                <div key={i} style={{
                  background: 'var(--bg-2)', border: '1px solid var(--border-2)', borderRadius: 6,
                  padding: '10px 12px'
                }}>
                  <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', fontFamily: 'Inter,sans-serif', marginBottom: 4 }}>{m.label}</div>
                  {m.color ? (
                    <span style={{ fontSize: 13, fontWeight: 700, color: m.color, background: m.bg, padding: '2px 8px', borderRadius: 8, fontFamily: 'Inter,sans-serif' }}>{m.val}</span>
                  ) : (
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: '-0.01em' }}>{m.val}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '16px 0', borderBottom: '1px solid var(--border-2)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--ink-3)', fontFamily: 'Inter,sans-serif', marginBottom: 12 }}>Scenario Inputs</div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--ink-2)', fontFamily: 'Inter,sans-serif', fontWeight: 500 }}>Growth by:</span>
              <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 6, padding: 2, background: 'var(--bg-2)' }}>
                {[["pct", "% Rate"], ["abs", "Fixed Volume"]].map(([v, l]) => (
                  <button key={v} onClick={() => setGrowthMode(v)} style={{
                    padding: '4px 12px', fontSize: 12, fontWeight: 600, borderRadius: 4, border: 'none',
                    cursor: 'pointer', fontFamily: 'Inter,sans-serif',
                    background: growthMode === v ? '#fff' : 'transparent',
                    color: growthMode === v ? 'var(--ink)' : 'var(--ink-3)',
                    boxShadow: growthMode === v ? '0 1px 3px rgba(0,0,0,.06)' : 'none',
                    transition: 'all .15s'
                  }}>{l}</button>
                ))}
              </div>
            </div>

            {growthMode === "pct" ? (
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--ink)', fontFamily: 'Inter,sans-serif', fontWeight: 500 }}>Growth Rate</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', fontFamily: 'Inter,sans-serif' }}>+{growthPct}%</span>
                </div>
                <input type="range" min={0} max={100} step={5} value={growthPct}
                  onChange={e => setGrowthPct(+e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--teal-deep)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', fontFamily: 'Inter,sans-serif', marginTop: 2 }}>
                  <span>0%</span><span>50%</span><span>100%</span>
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 13, color: 'var(--ink)', fontFamily: 'Inter,sans-serif', fontWeight: 500, marginBottom: 8 }}>Absolute Increase</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="number" min={0} step={500} value={growthAbs}
                    onChange={e => setGrowthAbs(Math.max(0, +e.target.value))}
                    style={{
                      flex: 1, height: 38, border: '1px solid var(--border)', borderRadius: 6,
                      padding: '0 12px', fontSize: 14, fontFamily: 'Inter,sans-serif', color: 'var(--ink)',
                      outline: 'none'
                    }}
                  />
                  <span style={{ fontSize: 12, color: 'var(--ink-3)', fontFamily: 'Inter,sans-serif', whiteSpace: 'nowrap' }}>records</span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ["teamExpansion", teamExpansion, setTeamExpansion, "Team Expansion", "Adds ~8% usage from new team onboarding"],
                ["featureAdoption", featureAdoption, setFeatureAdoption, "Feature Adoption", "Adds ~5% usage from increased feature rollout"],
              ].map(([key, val, setter, label, hint]) => (
                <div key={key} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: val ? 'var(--teal-soft)' : 'var(--bg-2)',
                  border: `1px solid ${val ? 'rgba(10,110,94,.25)' : 'var(--border-2)'}`,
                  borderRadius: 8, padding: '10px 14px', transition: 'all .2s', cursor: 'pointer'
                }} onClick={() => setter(v => !v)}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', fontFamily: 'Inter,sans-serif' }}>{label}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'Inter,sans-serif', marginTop: 2 }}>{hint}</div>
                  </div>
                  <div style={{
                    width: 38, height: 22, borderRadius: 11, flexShrink: 0,
                    background: val ? 'var(--teal-deep)' : 'var(--muted-2)',
                    position: 'relative', transition: 'background .2s'
                  }}>
                    <div style={{
                      position: 'absolute', top: 3,
                      left: val ? 19 : 3,
                      width: 16, height: 16, borderRadius: '50%',
                      background: '#fff', transition: 'left .2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,.2)'
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '16px 0', borderBottom: '1px solid var(--border-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--ink-3)', fontFamily: 'Inter,sans-serif' }}>Simulated Outcome</div>
              <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'var(--ink-2)', fontFamily: 'Inter,sans-serif' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 18, height: 2, background: 'none', borderTop: '2px dotted #B2B0B6', display: 'inline-block' }}></span>
                  Current
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 18, height: 2, background: willBreach ? '#B21111' : '#0A6E5E', display: 'inline-block', borderRadius: 1 }}></span>
                  Simulated
                </span>
              </div>
            </div>
            <div ref={containerRef} style={{ width: '100%', height: 220 }}></div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border-2)', borderRadius: 6, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', fontFamily: 'Inter,sans-serif', marginBottom: 4 }}>End-of-period Volume</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em' }}>{simEndVolume.toLocaleString()}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--danger)', fontFamily: 'Inter,sans-serif' }}>+{Math.round((simEndVolume - baseVolume) / baseVolume * 100)}%</span>
                </div>
              </div>
              <div style={{ background: willBreach ? 'var(--danger-soft)' : 'var(--teal-soft)', border: `1px solid ${willBreach ? '#F1B9B9' : 'rgba(10,110,94,.2)'}`, borderRadius: 6, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', fontFamily: 'Inter,sans-serif', marginBottom: 4 }}>Breach Risk</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: willBreach ? 'var(--danger)' : 'var(--teal-deep)', fontFamily: 'Inter,sans-serif' }}>
                  {willBreach ? `Breach in ${breachLabel}` : 'No breach projected'}
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: '16px 0', borderBottom: '1px solid var(--border-2)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--ink-3)', fontFamily: 'Inter,sans-serif', marginBottom: 10 }}>Risk & Impact Summary</div>
            <div style={{
              background: willBreach ? 'var(--danger-soft)' : 'var(--teal-soft)',
              border: `1px solid ${willBreach ? '#F1B9B9' : 'rgba(10,110,94,.2)'}`,
              borderRadius: 8, padding: '12px 14px',
              fontSize: 14, color: willBreach ? 'var(--danger)' : 'var(--teal-deep)',
              lineHeight: 1.6, fontFamily: 'Inter,sans-serif'
            }}>
              {willBreach
                ? `With this growth scenario, the object is likely to breach NFR limits around ${breachLabel}. Consider reviewing capacity or limiting growth before rollout.`
                : `This growth scenario keeps the object within safe NFR limits for the full ${horizonMonths}-month horizon. Monitoring is still recommended.`
              }
            </div>

            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(willBreach ? [
                "Consider capacity optimisation before rollout",
                "Monitor growth weekly during this period",
                "Evaluate reducing team expansion scope",
              ] : [
                "Safe to proceed — review again after rollout",
                "Monitor growth monthly to stay within limits",
              ]).map((tip, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                  fontSize: 13, color: 'var(--ink-2)', fontFamily: 'Inter,sans-serif'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={willBreach ? 'var(--warn)' : 'var(--teal-deep)'} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                  {tip}
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '16px 0 0', display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
            <button onClick={() => { setGrowthPct(15); setGrowthAbs(3000); setTeamExpansion(false); setFeatureAdoption(false); setGrowthMode("pct"); }}
              style={{
                flex: 1, height: 40, border: '1px solid var(--teal-deep)', borderRadius: 6,
                background: 'var(--teal-deep)', color: '#fff', fontSize: 13, fontWeight: 600,
                fontFamily: 'Inter,sans-serif', cursor: 'pointer', transition: 'all .15s'
              }}>Adjust Scenario</button>
            <button onClick={handleSave} style={{
              flex: 1, height: 40, border: '1px solid var(--border)', borderRadius: 6,
              background: saved ? 'var(--teal-soft)' : '#fff',
              color: saved ? 'var(--teal-deep)' : 'var(--ink-2)',
              fontSize: 13, fontWeight: 600, fontFamily: 'Inter,sans-serif', cursor: 'pointer', transition: 'all .2s'
            }}>
              {saved ? '✓ Saved' : 'Save Scenario'}
            </button>
            <button onClick={onClose} style={{
              height: 40, padding: '0 14px', border: '1px solid var(--border)', borderRadius: 6,
              background: '#fff', color: 'var(--ink-3)', fontSize: 13, fontWeight: 600,
              fontFamily: 'Inter,sans-serif', cursor: 'pointer', transition: 'all .15s'
            }}>
              Close
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideInRight { from { transform: translateX(100%) } to { transform: translateX(0) } }
      `}</style>
    </>
  );
}
