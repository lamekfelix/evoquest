// screens-charts.jsx — Evolution graphs
// Supports multiple chart styles: 'line' | 'area' | 'bars'

function ChartsScreen({ state, tweaks }) {
  const [range, setRange] = React.useState(30); // days
  const [selectedAttr, setSelectedAttr] = React.useState(null);

  const data = XP_HISTORY.slice(-range);
  const chartStyle = tweaks.chartStyle;

  const totals = ATTRIBUTES.map(a => ({
    attr: a,
    curr: state.attrXp[a.id],
    delta: data[data.length - 1][a.id] - data[0][a.id],
    series: data.map(d => d[a.id]),
  }));

  return (
    <div style={{ padding: '28px 40px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>Evolução</div>
          <div className="serif" style={{ fontSize: 40, lineHeight: 1.1, marginTop: 4 }}>Gráficos de progresso</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[7, 30, 90].map(r => (
            <button key={r} className={`btn ${range === r ? 'primary' : ''}`} onClick={() => setRange(r)} style={{ fontSize: 12 }}>
              {r}d
            </button>
          ))}
        </div>
      </div>

      {/* Big combined chart */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <div className="serif" style={{ fontSize: 20 }}>Todos os atributos</div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>
            Estilo: <span style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{chartStyle}</span>
          </div>
        </div>
        <BigChart data={data} attrs={ATTRIBUTES} highlight={selectedAttr} style={chartStyle} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
          {ATTRIBUTES.map(a => (
            <div key={a.id}
              onClick={() => setSelectedAttr(selectedAttr === a.id ? null : a.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px',
                border: `1px solid ${selectedAttr === a.id ? a.hue : 'var(--line)'}`,
                borderRadius: 999, cursor: 'pointer',
                background: selectedAttr === a.id ? `color-mix(in oklch, ${a.hue} 12%, var(--surface))` : 'var(--surface)',
                fontSize: 12,
              }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.hue }} />
              {a.name}
            </div>
          ))}
        </div>
      </div>

      {/* Per-attribute cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
        {totals.map(({ attr, curr, delta, series }) => {
          const lvl = deriveLevel(curr);
          return (
            <div key={attr.id} className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 10, color: attr.hue, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{attr.icon} {attr.abbr}</div>
                  <div className="serif" style={{ fontSize: 18, lineHeight: 1.2, marginTop: 2 }}>{attr.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="serif" style={{ fontSize: 22, lineHeight: 1 }}>LV {lvl.level}</div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--accent)', marginTop: 2 }}>+{Math.round(delta)} XP</div>
                </div>
              </div>
              <MiniChart data={series} color={attr.hue} style={chartStyle} height={60} />
              <div className="xp-bar" style={{ marginTop: 10 }}>
                <div className="fill" style={{ width: `${lvl.progress * 100}%`, '--hue': attr.hue }} />
              </div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                <span>{lvl.xpInLevel} / {lvl.xpToNext}</span>
                <span>{curr.toLocaleString('pt-BR')} total</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BigChart({ data, attrs, highlight, style }) {
  const width = 1200, height = 280, pad = { l: 40, r: 20, t: 20, b: 28 };
  const iw = width - pad.l - pad.r, ih = height - pad.t - pad.b;
  if (data.length < 2) return null;

  // compute total range across all attrs
  let max = 0;
  data.forEach(d => attrs.forEach(a => { if (d[a.id] > max) max = d[a.id]; }));
  max = Math.ceil(max / 1000) * 1000;

  const x = (i) => pad.l + (i / (data.length - 1)) * iw;
  const y = (v) => pad.t + ih - (v / max) * ih;

  const gridLines = 4;
  const dateLabels = data.length <= 10
    ? data.map((d, i) => ({ i, label: new Date(d.date).getDate() }))
    : data.filter((_, i) => i % Math.ceil(data.length / 6) === 0).map((d, _, arr) => ({ i: data.indexOf(d), label: new Date(d.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }) }));

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      {/* grid */}
      {Array.from({ length: gridLines + 1 }, (_, i) => {
        const yv = pad.t + (i / gridLines) * ih;
        return (
          <g key={i}>
            <line x1={pad.l} x2={pad.l + iw} y1={yv} y2={yv} stroke="var(--line)" strokeWidth="0.5" />
            <text x={pad.l - 8} y={yv + 3} fontSize="10" fill="var(--ink-4)" textAnchor="end" fontFamily="var(--font-mono)">
              {Math.round(max * (1 - i / gridLines)).toLocaleString('pt-BR')}
            </text>
          </g>
        );
      })}
      {dateLabels.map(({ i, label }) => (
        <text key={i} x={x(i)} y={height - 8} fontSize="10" fill="var(--ink-4)" textAnchor="middle" fontFamily="var(--font-mono)">{label}</text>
      ))}

      {/* series */}
      {attrs.map(a => {
        const series = data.map(d => d[a.id]);
        const path = series.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
        const fillPath = `${path} L${x(series.length - 1).toFixed(1)},${pad.t + ih} L${x(0).toFixed(1)},${pad.t + ih} Z`;
        const isHighlit = highlight === null || highlight === a.id;
        const opacity = isHighlit ? 1 : 0.18;

        if (style === 'bars') {
          const bw = iw / series.length * 0.8 / attrs.length;
          const attrIdx = attrs.indexOf(a);
          return (
            <g key={a.id} opacity={opacity}>
              {series.map((v, i) => {
                const bx = x(i) - (iw / series.length * 0.4) + bw * attrIdx;
                return <rect key={i} x={bx} y={y(v)} width={bw * 0.9} height={pad.t + ih - y(v)} fill={`color-mix(in oklch, ${a.hue} 100%, transparent)`} />;
              })}
            </g>
          );
        }

        return (
          <g key={a.id} opacity={opacity}>
            {style === 'area' && <path d={fillPath} fill={a.hue} opacity="0.08" />}
            <path d={path} stroke={a.hue} strokeWidth={isHighlit && highlight === a.id ? 2.5 : 1.75} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}
    </svg>
  );
}

function MiniChart({ data, color, style, height = 50 }) {
  const width = 280, pad = 4;
  if (data.length < 2) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const x = (i) => pad + (i / (data.length - 1)) * (width - pad * 2);
  const y = (v) => pad + (height - pad * 2) - ((v - min) / range) * (height - pad * 2);

  if (style === 'bars') {
    const bw = (width - pad * 2) / data.length;
    return (
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
        {data.map((v, i) => (
          <rect key={i} x={x(i) - bw * 0.4} y={y(v)} width={bw * 0.7} height={height - pad - y(v)} fill={color} opacity="0.8" rx="1" />
        ))}
      </svg>
    );
  }

  const path = data.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const fillPath = `${path} L${x(data.length - 1).toFixed(1)},${height - pad} L${x(0).toFixed(1)},${height - pad} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      {style !== 'line' && <path d={fillPath} fill={color} opacity="0.15" />}
      <path d={path} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

Object.assign(window, { ChartsScreen, BigChart, MiniChart });
