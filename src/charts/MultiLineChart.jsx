import React, { useRef, useEffect } from 'react';
import Highcharts from './index.js';
import { MONTHS } from '../data.js';

export default function MultiLineChart({ series, colors, labels, yLabel, height = 150, yMax = 50 }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  const seriesData = series.map((s, i) => ({
    name: labels[i],
    data: s,
    color: colors[i],
    marker: { radius: 2.8, symbol: 'circle' },
    lineWidth: 1.8,
  }));

  useEffect(() => {
    if (!containerRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = Highcharts.chart(containerRef.current, {
      chart: { type: 'line', height: height, spacing: [8,10,8,10], backgroundColor: 'transparent' },
      title: { text: null },
      xAxis: {
        categories: MONTHS,
        lineColor: '#B2B0B6',
        tickLength: 0,
        labels: { style: { color: '#716E79', fontSize: '10px' } }
      },
      yAxis: {
        title: { text: yLabel, style: { color: '#2F2C3C', fontSize: '10px', fontWeight: '500' } },
        min: 0, max: yMax,
        tickInterval: 10,
        gridLineColor: '#F0F0F2',
        lineWidth: 1, lineColor: '#B2B0B6',
        labels: { style: { color: '#716E79', fontSize: '10px' } }
      },
      tooltip: {
        shared: true,
        backgroundColor: '#022D42',
        borderColor: 'transparent',
        borderRadius: 6,
        shadow: { color: 'rgba(0,0,0,0.2)', offsetX: 0, offsetY: 8, width: 20 },
        style: { color: '#fff', fontSize: '11px', fontFamily: 'Inter, sans-serif' },
        headerFormat: '<b>{point.key}</b><br/>',
        pointFormat: '<span style="color:{series.color}">●</span> {series.name}: <b>{point.y}</b><br/>'
      },
      legend: { enabled: false },
      series: seriesData
    });
    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, [JSON.stringify(series), height, yMax]);

  useEffect(() => {
    if (!containerRef.current || !chartRef.current) return;
    const ro = new ResizeObserver(() => { if (chartRef.current) chartRef.current.reflow(); });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: height }} />;
}
