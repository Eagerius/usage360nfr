import React, { useRef, useEffect } from 'react';
import Highcharts from './index.js';

export default function GaugeChart({ value, delta = 0, size = 200, strokeW = 18, color }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const gaugeColor = color || (value >= 80 ? "#3287C4" : value >= 50 ? "#DB6C03" : "#B21111");

  const lighten = (hex, amt = 0.6) => {
    const m = hex.replace("#", "").match(/.{2}/g);
    if (!m) return hex;
    const [r, g, b] = m.map(x => parseInt(x, 16));
    const mix = c => Math.round(c + (255 - c) * amt);
    return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
  };
  const lightColor = lighten(gaugeColor, 0.6);

  const prior = Math.max(0, Math.min(100, value - delta));
  const bigVal = Math.max(value, prior);
  const smallVal = Math.min(value, prior);

  useEffect(() => {
    if (!containerRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
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
    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, [value, delta, size, gaugeColor, lightColor, bigVal, smallVal]);

  return (
    <div
      key={`${value}-${delta}`}
      ref={containerRef}
      style={{ width: size, height: size / 2 + 60, marginBottom: -40, marginTop: 8 }}
    />
  );
}
