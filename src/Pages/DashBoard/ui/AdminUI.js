import React, { useEffect, useRef, useState } from 'react';

/* Reusable admin primitives: count-up numbers, 3D tilt stat cards,
   animated SVG line chart and CSS bar chart. No extra dependencies. */

export const useCountUp = (target, duration = 1200) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const end = Number(target) || 0;
    if (reduce) { setV(end); return; }
    let raf, start;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      setV(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
};

export const StatCard = ({ icon, label, value, prefix = '', suffix = '', trend, tone = 'amber', delay = 0 }) => {
  const ref = useRef(null);
  const n = useCountUp(value);
  const tones = {
    amber: { bg: '#fff4e3', fg: '#e08700', fx: 'rgba(255,159,28,.16)' },
    green: { bg: '#e7f7f0', fg: '#12a06a', fx: 'rgba(18,160,106,.14)' },
    blue: { bg: '#e8f0ff', fg: '#3b6fd4', fx: 'rgba(59,111,212,.14)' },
    violet: { bg: '#f1ebff', fg: '#7b52d3', fx: 'rgba(123,82,211,.14)' },
  };
  const t = tones[tone] || tones.amber;

  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${-y * 9}deg) rotateY(${x * 12}deg) translateY(-3px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ''; };

  return (
    <div ref={ref} className="ad-stat ad-rev" onMouseMove={onMove} onMouseLeave={reset}
      style={{ '--sbg': t.bg, '--sfg': t.fg, '--sfx': t.fx, animationDelay: `${delay}ms` }}>
      {trend && <span className="ad-trend">{trend}</span>}
      <div className="ad-stat-ic">{icon}</div>
      <b>{prefix}{n.toLocaleString()}{suffix}</b>
      <span>{label}</span>
    </div>
  );
};

export const LineChart = ({ points = [], color = '#ff9f1c', labels = [] }) => {
  const w = 520, h = 190, pad = 26;
  const max = Math.max(...points, 1);
  const step = (w - pad * 2) / Math.max(points.length - 1, 1);
  const xy = points.map((p, i) => [pad + i * step, h - pad - (p / max) * (h - pad * 2)]);
  const d = xy.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${d} L${xy[xy.length - 1]?.[0] || pad},${h - pad} L${pad},${h - pad} Z`;
  return (
    <svg className="ad-chart" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-label="Trend chart">
      <path className="area" d={area} fill={color} />
      <path className="line" d={d} stroke={color} />
      {xy.map((p, i) => (
        <circle key={i} className="dot" cx={p[0]} cy={p[1]} r="4" fill="#fff" stroke={color} strokeWidth="2.5"
          style={{ animationDelay: `${600 + i * 90}ms` }} />
      ))}
      {labels.map((l, i) => (
        <text key={l} x={pad + i * step} y={h - 6} fontSize="10" fill="#8b93a3" textAnchor="middle">{l}</text>
      ))}
    </svg>
  );
};

export const BarChart = ({ data = [] }) => {
  const max = Math.max(...data.map((d) => d.v), 1);
  return (
    <div className="ad-bars">
      {data.map((d, i) => (
        <div key={d.k} className="ad-bar" style={{ '--h': `${(d.v / max) * 100}%`, animationDelay: `${i * 90}ms` }}>
          <span>{d.k}</span>
        </div>
      ))}
    </div>
  );
};

export const AdminPage = ({ title, subtitle, children }) => (
  <div className="ad-rev">
    <h2 style={{ fontSize: '1.3rem', margin: '0 0 4px' }}>{title}</h2>
    {subtitle && <p style={{ fontSize: '.88rem', color: '#6b7484', marginBottom: 22 }}>{subtitle}</p>}
    {children}
  </div>
);
