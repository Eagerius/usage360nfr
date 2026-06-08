// Highcharts-based chart components
const {useRef: hcRef, useEffect: hcEffect, useCallback: hcCb} = React;

// Shared Highcharts defaults
Highcharts.setOptions({
  credits: { enabled: false },
  chart: { style: { fontFamily: 'Inter, "Open Sans", sans-serif' } },
});

// ─── Generic React wrapper for Highcharts ───
function HCChart({ options, style }){
  const containerRef = hcRef(null);
  const chartRef = hcRef(null);

  hcEffect(() => {
    if (!containerRef.current) return;
    chartRef.current = Highcharts.chart(containerRef.current, options);
    return () => { if(chartRef.current) chartRef.current.destroy(); };
  }, [JSON.stringify(options)]);

  // Resize observer for responsiveness
  hcEffect(() => {
    if (!containerRef.current || !chartRef.current) return;
    const ro = new ResizeObserver(() => {
      if(chartRef.current) chartRef.current.reflow();
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return <div ref={containerRef} style={style || {width:'100%',height:'100%'}} />;
}

// ────────── NFR Area Chart (large) ──────────
function NFRAreaChart({ observed, approved }){
  const options = {
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
  };
  return <HCChart options={options} style={{width:510,height:190}} />;
}

// ────────── Multi-line small chart (Client Overview) ──────────
function MultiLineChart({ series, colors, labels, yLabel, height=150, yMax=50 }){
  const seriesData = series.map((s, i) => ({
    name: labels[i],
    data: s,
    color: colors[i],
    marker: { radius: 2.8, symbol: 'circle' },
    lineWidth: 1.8,
  }));

  const options = {
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
  };
  return <HCChart options={options} style={{width:'100%',height:height}} />;
}

// ────────── Bar chart with threshold line ──────────
function BreachBarChart({ bars, threshold, height=150, yMax=50 }){
  const options = {
    chart: { type: 'column', height: height, spacing: [8,10,8,10], backgroundColor: 'transparent' },
    title: { text: null },
    xAxis: {
      categories: MONTHS,
      lineColor: '#B2B0B6',
      tickLength: 0,
      labels: { style: { color: '#716E79', fontSize: '10px' } }
    },
    yAxis: {
      title: { text: 'Count', style: { color: '#2F2C3C', fontSize: '10px', fontWeight: '500' } },
      min: 0, max: yMax,
      tickInterval: 10,
      gridLineColor: '#F0F0F2',
      lineWidth: 1, lineColor: '#B2B0B6',
      labels: { style: { color: '#716E79', fontSize: '10px' } },
      plotLines: [{
        value: threshold,
        color: '#DB6C03',
        width: 2.5,
        zIndex: 5,
        label: { text: '', style: { color: '#DB6C03' } }
      }]
    },
    tooltip: {
      backgroundColor: '#022D42',
      borderColor: 'transparent',
      borderRadius: 6,
      shadow: { color: 'rgba(0,0,0,0.2)', offsetX: 0, offsetY: 8, width: 20 },
      style: { color: '#fff', fontSize: '11px', fontFamily: 'Inter, sans-serif' },
      headerFormat: '<b>{point.key}</b><br/>',
      pointFormat: '<span style="color:{series.color}">●</span> Instance Health: <b>{point.y}</b><br/>Threshold: <b>' + threshold + '</b>'
    },
    legend: { enabled: false },
    plotOptions: {
      column: {
        borderRadius: 2,
        borderWidth: 0,
        color: '#3287C4',
        states: { hover: { color: '#3E9DDE' } }
      }
    },
    series: [{ name: 'Instance Health', data: bars, color: '#3287C4' }]
  };
  return <HCChart options={options} style={{width:'100%',height:height}} />;
}

// ────────── Single-line adoption chart ──────────
function AdoptionLineChart({ values, height=150 }){
  const options = {
    chart: { type: 'line', height: height, spacing: [8,10,8,10], backgroundColor: 'transparent' },
    title: { text: null },
    xAxis: {
      categories: MONTHS,
      lineColor: '#B2B0B6',
      tickLength: 0,
      labels: { style: { color: '#716E79', fontSize: '10px' } }
    },
    yAxis: {
      title: { text: 'Percentage', style: { color: '#2F2C3C', fontSize: '10px', fontWeight: '500' } },
      min: 0, max: 100,
      tickInterval: 20,
      gridLineColor: '#F0F0F2',
      lineWidth: 1, lineColor: '#B2B0B6',
      labels: { style: { color: '#716E79', fontSize: '10px' } }
    },
    tooltip: {
      backgroundColor: '#022D42',
      borderColor: 'transparent',
      borderRadius: 6,
      shadow: { color: 'rgba(0,0,0,0.2)', offsetX: 0, offsetY: 8, width: 20 },
      style: { color: '#fff', fontSize: '11px', fontFamily: 'Inter, sans-serif' },
      headerFormat: '<b>{point.key}</b><br/>',
      pointFormat: '<span style="color:#41AFFF">●</span> Adoption: <b>{point.y}%</b>'
    },
    legend: { enabled: false },
    series: [{
      name: 'Adoption Rate',
      data: values,
      color: '#41AFFF',
      marker: { radius: 2.8, symbol: 'circle' },
      lineWidth: 1.8
    }]
  };
  return <HCChart options={options} style={{width:'100%',height:height}} />;
}

Object.assign(window, { HCChart, NFRAreaChart, MultiLineChart, BreachBarChart, AdoptionLineChart });
