// components.jsx — shared UI primitives


// ────────────────────────────────────────────────────────────
// Icon
// ────────────────────────────────────────────────────────────
function Icon({ name, size = 14, stroke = 1.5 }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    home:   <><path d="M3 12l9-9 9 9"/><path d="M5 10v10h14V10"/></>,
    cal:    <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></>,
    week:   <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 11h18M9 5v16"/></>,
    month:  <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M3 13h18M3 17h18M9 5v16M15 5v16"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></>,
    habit:  <><path d="M20 6L9 17l-5-5"/></>,
    char:   <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></>,
    chart:  <><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/></>,
    user:   <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></>,
    folder: <><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></>,
    archive:<><rect x="3" y="5" width="18" height="4" rx="1"/><path d="M5 9v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9M10 13h4"/></>,
    plus:   <><path d="M12 5v14M5 12h14"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></>,
    flame:  <><path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-1 .5-2 1-3 1 2 3 2 3-2 0-1 0-2 0-3z"/></>,
    trophy: <><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM7 7H4a2 2 0 0 0 2 4M17 7h3a2 2 0 0 1-2 4"/></>,
    sparkle:<><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/></>,
    clock:  <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    arrow:  <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    chev:   <><path d="M9 6l6 6-6 6"/></>,
    check:  <><path d="M5 12l4 4 10-10"/></>,
    dots:   <><circle cx="6" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/></>,
    settings:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    moon:   <><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></>,
    sun:    <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/></>,
    zap:    <><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></>,
    dumbbell:<><path d="M6.5 6.5l11 11"/><path d="M21 21l-1-1M3 3l1 1M18 22l4-4-3-3-4 4 3 3zM2 18l4-4 3 3-4 4-3-3z"/><path d="M9 11l4-4M13 17l4-4"/></>,
    apple:  <><path d="M12 7c-1-2-3-3-5-3 0 3 2 5 5 5M12 7c1-2 3-3 5-3 0 3-2 5-5 5M12 20c-3 0-6-3-6-7s2-6 6-6 6 2 6 6-3 7-6 7z"/></>,
    water:  <><path d="M12 3c4 5 7 9 7 13a7 7 0 0 1-14 0c0-4 3-8 7-13z"/></>,
    fire:   <><path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-1 .5-2 1-3 1 2 3 2 3-2 0-1 0-2 0-3z"/></>,
    x:      <><path d="M6 6l12 12M18 6l-12 12"/></>,
    edit:   <><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></>,
    trash:  <><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14M10 11v6M14 11v6"/></>,
    globe:  <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></>,
  };
  return <svg {...props}>{paths[name] || paths.home}</svg>;
}

// ────────────────────────────────────────────────────────────
// XP Bar (classic RPG)
// ────────────────────────────────────────────────────────────
function XPBar({ attr, value, max, thick = false, showLabel = true }) {
  const attrMeta = ATTRIBUTES.find(a => a.id === attr);
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--ink-2)', fontWeight: 500 }}>
            <span style={{ color: attrMeta?.hue, fontSize: 12 }}>{attrMeta?.icon}</span>
            {attrMeta?.name}
          </span>
          <span className="mono" style={{ color: 'var(--ink-3)' }}>{value}/{max}</span>
        </div>
      )}
      <div className={`xp-bar ${thick ? 'thick' : ''}`}>
        <div className="fill" style={{ width: `${pct}%`, '--hue': attrMeta?.hue }} />
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Checkbox
// ────────────────────────────────────────────────────────────
function Checkbox({ checked, onChange, size = 18 }) {
  return (
    <div
      className={`checkbox ${checked ? 'checked' : ''}`}
      onClick={(e) => { e.stopPropagation(); onChange && onChange(!checked); }}
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.66} height={size * 0.66} viewBox="0 0 24 24" fill="none" stroke="var(--bg)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12l4 4 10-10"/>
      </svg>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Level Badge
// ────────────────────────────────────────────────────────────
function LevelBadge({ level, size = 32, hue }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${hue || 'var(--accent)'}, color-mix(in oklch, ${hue || 'var(--accent)'} 70%, black))`,
      color: '#fff', fontFamily: 'var(--font-serif)', fontSize: size * 0.48,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 500, letterSpacing: '-0.02em',
      boxShadow: '0 2px 4px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.25)',
      flexShrink: 0,
    }}>{level}</div>
  );
}

// ────────────────────────────────────────────────────────────
// Streak badge
// ────────────────────────────────────────────────────────────
function Streak({ n }) {
  if (!n) return null;
  return (
    <span className="streak-badge" title={`${n} dias seguidos`}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2s5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 1.5-4 1 2 2.5 2 2.5-1 0-2 0-3 1-5z"/></svg>
      {n}
    </span>
  );
}

// ────────────────────────────────────────────────────────────
// Sparkline
// ────────────────────────────────────────────────────────────
function Sparkline({ data, color = 'var(--accent)', width = 80, height = 24, fill = true }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * width,
    height - ((v - min) / range) * height,
  ]);
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const fillPath = `${path} L${width},${height} L0,${height} Z`;
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      {fill && <path d={fillPath} fill={color} opacity="0.12" />}
      <path d={path} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ────────────────────────────────────────────────────────────
// Empty State
// ────────────────────────────────────────────────────────────
function EmptyState({ icon = 'sparkle', title, hint, action, compact = false }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: compact ? '18px 12px' : '32px 16px',
      textAlign: 'center', color: 'var(--ink-3)', gap: 6,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: 'color-mix(in oklch, var(--ink) 4%, transparent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--ink-3)', marginBottom: 2,
      }}>
        <Icon name={icon} size={18} />
      </div>
      <div className="serif" style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.2 }}>{title}</div>
      {hint && <div style={{ fontSize: 12, maxWidth: 280, lineHeight: 1.4 }}>{hint}</div>}
      {action && (
        <button onClick={action.onClick} className="btn" style={{
          marginTop: 6, fontSize: 12, padding: '6px 12px',
          background: 'var(--surface)', border: '1px solid var(--line)',
        }}>
          {action.label}
        </button>
      )}
    </div>
  );
}

Object.assign(window, { Icon, XPBar, Checkbox, LevelBadge, Streak, Sparkline, EmptyState });
