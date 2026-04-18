// screens-mobile.jsx — Mobile companion view (iPhone frame)

function MobileApp({ state, dispatch, tweaks }) {
  const [tab, setTab] = React.useState('home');
  const { attrXp } = state;
  const totalXp = Object.values(attrXp).reduce((a, b) => a + b, 0);
  const heroLevel = deriveLevel(totalXp);

  return (
    <IOSDevice width={390} height={844} dark={tweaks.theme === 'ink'}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
        {/* Top bar */}
        <div style={{ padding: '62px 20px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>
              17 abr, sex
            </div>
            <div className="serif" style={{ fontSize: 22, lineHeight: 1.1, marginTop: 2 }}>
              {tab === 'home' ? 'Hoje' : tab === 'habits' ? 'Hábitos' : tab === 'para' ? 'PARA' : 'Stats'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LevelBadge level={heroLevel.level} size={32} hue="var(--accent)" />
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 100px' }}>
          {tab === 'home' && <MobileHome state={state} dispatch={dispatch} heroLevel={heroLevel} />}
          {tab === 'habits' && <MobileHabits state={state} dispatch={dispatch} />}
          {tab === 'para' && <MobilePara />}
          {tab === 'stats' && <MobileStats state={state} />}
        </div>

        {/* Tab bar */}
        <div style={{
          position: 'absolute', left: 14, right: 14, bottom: 30,
          borderRadius: 22, padding: 6,
          background: 'color-mix(in oklch, var(--surface) 85%, transparent)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid var(--line)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          display: 'flex', gap: 4,
        }}>
          {[
            { id: 'home', label: 'Hoje', icon: 'home' },
            { id: 'habits', label: 'Hábitos', icon: 'habit' },
            { id: 'para', label: 'PARA', icon: 'folder' },
            { id: 'stats', label: 'Stats', icon: 'chart' },
          ].map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                flex: 1, padding: '8px 6px', borderRadius: 16,
                background: active ? 'var(--accent-2)' : 'transparent',
                color: active ? 'var(--bg)' : 'var(--ink-3)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              }}>
                <Icon name={t.icon} size={18} />
                <span style={{ fontSize: 10, fontWeight: 500 }}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </IOSDevice>
  );
}

function MobileHome({ state, dispatch, heroLevel }) {
  const todayISO = dateISO(today);
  const todayAgenda = state.agenda.filter(t => t.date === todayISO).sort((a,b) => a.time.localeCompare(b.time));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* XP hero */}
      <div className="card" style={{ padding: 16, background: 'linear-gradient(135deg, color-mix(in oklch, var(--accent) 12%, var(--surface)), var(--surface))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Aventureiro</div>
            <div className="serif" style={{ fontSize: 24, lineHeight: 1 }}>Nível {heroLevel.level}</div>
          </div>
          <div className="mono" style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 600 }}>
            +{state.xpGainedToday} XP hoje
          </div>
        </div>
        <div className="xp-bar thick" style={{ marginTop: 12 }}>
          <div className="fill" style={{ width: `${heroLevel.progress * 100}%`, '--hue': 'var(--accent)' }} />
        </div>
        <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 4 }}>{heroLevel.xpInLevel}/{heroLevel.xpToNext}</div>
      </div>

      {/* Attributes mini */}
      <div className="card" style={{ padding: 16 }}>
        <div className="serif" style={{ fontSize: 16, marginBottom: 10 }}>Atributos</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {ATTRIBUTES.map(a => {
            const lvl = deriveLevel(state.attrXp[a.id]);
            return (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <LevelBadge level={lvl.level} size={22} hue={a.hue} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: 'var(--ink-3)', marginBottom: 2 }}>{a.abbr}</div>
                  <div className="xp-bar" style={{ height: 4 }}>
                    <div className="fill" style={{ width: `${lvl.progress * 100}%`, '--hue': a.hue }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today agenda */}
      <div className="card" style={{ padding: 16 }}>
        <div className="serif" style={{ fontSize: 16, marginBottom: 10 }}>Agenda</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {todayAgenda.slice(0, 5).map(t => {
            const area = AREAS_SEED.find(a => a.id === t.area);
            return (
              <div key={t.id}
                onClick={() => dispatch({ type: 'toggleAgenda', id: t.id })}
                style={{
                  display: 'grid', gridTemplateColumns: '18px 50px 1fr', gap: 10,
                  alignItems: 'center', fontSize: 13,
                  padding: '4px 0',
                }}>
                <Checkbox checked={t.done} onChange={() => dispatch({ type: 'toggleAgenda', id: t.id })} />
                <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{t.time}</span>
                <span style={{
                  color: t.done ? 'var(--ink-4)' : 'var(--ink)',
                  textDecoration: t.done ? 'line-through' : 'none',
                  borderLeft: `2px solid ${area.color}`, paddingLeft: 8,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{t.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Habits quick */}
      <div className="card" style={{ padding: 16 }}>
        <div className="serif" style={{ fontSize: 16, marginBottom: 10 }}>Hábitos de hoje</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {state.habits.slice(0, 4).map(h => {
            const attr = ATTRIBUTES.find(a => a.id === h.attr);
            const done = h.done[3] === 1;
            return (
              <div key={h.id} onClick={() => dispatch({ type: 'toggleHabit', id: h.id, day: 3 })}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                <Checkbox checked={done} onChange={() => dispatch({ type: 'toggleHabit', id: h.id, day: 3 })} />
                <span style={{ flex: 1, fontSize: 13, color: done ? 'var(--ink-3)' : 'var(--ink)', textDecoration: done ? 'line-through' : 'none' }}>
                  {h.name}
                </span>
                <span style={{ color: attr.hue, fontSize: 12 }}>{attr.icon}</span>
                <span className="mono" style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>+{h.xp}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MobileHabits({ state, dispatch }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      {state.habits.map((h, i) => {
        const attr = ATTRIBUTES.find(a => a.id === h.attr);
        const done = h.done[3] === 1;
        return (
          <div key={h.id}
            onClick={() => dispatch({ type: 'toggleHabit', id: h.id, day: 3 })}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: i < state.habits.length - 1 ? '1px solid var(--line)' : 'none' }}
          >
            <Checkbox checked={done} onChange={() => dispatch({ type: 'toggleHabit', id: h.id, day: 3 })} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: done ? 'var(--ink-3)' : 'var(--ink)', textDecoration: done ? 'line-through' : 'none' }}>{h.name}</div>
              <div style={{ display: 'flex', gap: 8, fontSize: 11, marginTop: 3 }}>
                <span style={{ color: attr.hue, fontWeight: 500 }}>{attr.icon} {attr.abbr}</span>
                <Streak n={h.streak} />
              </div>
            </div>
            <span className="mono" style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>+{h.xp}</span>
          </div>
        );
      })}
    </div>
  );
}

function MobilePara() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {['Projects', 'Areas', 'Resources', 'Archives'].map((label, i) => {
        const counts = [PROJECTS_SEED.length, AREAS_SEED.length, RESOURCES_SEED.length, ARCHIVES_SEED.length];
        return (
          <div key={label} className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>
              {label.charAt(0)} · {label}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 }}>
              <div className="serif" style={{ fontSize: 20 }}>{label === 'Projects' ? 'Projetos' : label === 'Areas' ? 'Áreas' : label === 'Resources' ? 'Recursos' : 'Arquivos'}</div>
              <div className="mono" style={{ fontSize: 13, color: 'var(--ink-3)' }}>{counts[i]} itens</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MobileStats({ state }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="card" style={{ padding: 16 }}>
        <div className="serif" style={{ fontSize: 16, marginBottom: 10 }}>XP por atributo (30d)</div>
        {ATTRIBUTES.map(a => {
          const series = XP_HISTORY.slice(-30).map(d => d[a.id]);
          const delta = Math.round(series[series.length - 1] - series[0]);
          return (
            <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 60px', gap: 8, alignItems: 'center', padding: '6px 0' }}>
              <span style={{ fontSize: 11, color: a.hue, fontWeight: 500 }}>{a.icon} {a.abbr}</span>
              <Sparkline data={series} color={a.hue} width={180} height={22} />
              <span className="mono" style={{ fontSize: 11, color: 'var(--accent)', textAlign: 'right' }}>+{delta}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { MobileApp, MobileHome, MobileHabits, MobilePara, MobileStats });
