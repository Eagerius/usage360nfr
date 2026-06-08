import React, { useRef, useEffect } from 'react';
import Highcharts from './index.js';
import { MONTHS } from '../data.js';

export default function NFRAreaChart({ observed, approved }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = Highcharts.chart(containerRef.current, {
      chart: { type: 'area', height: 190, spacing: [10,14,10,10], backgroundColor: 'transparent' },
      title: { text: null },
      xAxis: {
        categories: MONTHS,
        lineColor: '#87848D',
        tickLength: 0,
        labels: { style: { color: '#716E79', fontSize: '10px' } }
      },
      yAxis: {
        title: { text: null },
        min: 0, max: 50,
        tickInterval: 10,
        gridLineColor: '#EEEEEE',
        lineWidth: 1, lineColor: '#87848D',
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
      plotOptions: {
        area: {
          fillOpacity: 0.35,
          marker: { radius: 3.5, lineWidth: 2, lineColor: null, fillColor: '#fff', symbol: 'circle' },
          lineWidth: 2
        }
      },
      series: [
        { name: 'Observed Usage', data: observed, color: '#3287C4', fillColor: 'rgba(50,135,196,0.25)' },
        { name: 'Approved Capacity', data: approved, color: '#8D38FC', fillColor: 'rgba(141,56,252,0.15)' }
      ]
    });
    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, [JSON.stringify(observed), JSON.stringify(approved)]);

  useEffect(() => {
    if (!containerRef.current || !chartRef.current) return;
    const ro = new ResizeObserver(() => { if (chartRef.current) chartRef.current.reflow(); });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return <div ref={containerRef} style={{ width: 510, height: 190 }} />;
}
