// screens-profile.jsx — Profile / Stats overview
// screens-goals.jsx — Quests page

function ProfileScreen({ state }) {
  const { attrXp } = state;
  const totalXp = Object.values(attrXp).reduce((a, b) => a + b, 0);
  const heroLevel = deriveLevel(totalXp);
  const totalHabitsCompleted = Object.values(HABIT_HISTORY).flat().filter(v => v === 1).length;

  return (
    <div style={{ padding: '28px 40px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>Perfil</div>
        <div className="serif" style={{ fontSize: 40, lineHeight: 1.1, marginTop: 4 }}>Minha jornada</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
        <BigStat label="XP Total" value={totalXp.toLocaleString('pt-BR')} sub="desde Jan 2026" />
        <BigStat label="Dias consecutivos" value="96" sub="sem falhar check-in" accent />
        <BigStat label="Hábitos batidos" value={totalHabitsCompleted.toLocaleString('pt-BR')} sub="últimos 90d" />
        <BigStat label="Conquistas" value="3/6" sub="desbloqueadas" />
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>Dados salvos localmente</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>
            Seu progresso é salvo automaticamente no navegador (localStorage).
          </div>
        </div>
        <button className="btn" onClick={() => {
          if (confirm('Apagar todos os dados salvos e voltar ao estado inicial?')) {
            try {
              localStorage.removeItem('evoquest:state:v1');
              localStorage.removeItem('evoquest:tweaks:v1');
              localStorage.removeItem('evoquest:screen');
            } catch {}
            location.reload();
          }
        }} style={{ fontSize: 12 }}>Resetar dados</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card" style={{ padding: 20 }}>
          <div className="serif" style={{ fontSize: 20, marginBottom: 14 }}>Distribuição de XP</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ATTRIBUTES.map(a => {
              const pct = (attrXp[a.id] / totalXp) * 100;
              return (
                <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 70px', gap: 10, alignItems: 'center', fontSize: 12 }}>
                  <span style={{ color: 'var(--ink-2)' }}>{a.icon} {a.name}</span>
                  <div className="xp-bar"><div className="fill" style={{ width: `${pct}%`, '--hue': a.hue }} /></div>
                  <span className="mono" style={{ color: 'var(--ink-3)', textAlign: 'right' }}>{pct.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div className="serif" style={{ fontSize: 20, marginBottom: 14 }}>Linha do tempo recente</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { d: 'Hoje', t: 'Completou 4 hábitos matinais', xp: 75, attr: 'disciplina' },
              { d: 'Ontem', t: 'Deep work: 3h20 de foco', xp: 60, attr: 'foco' },
              { d: '15 abr', t: 'Desbloqueou "Chama Eterna"', xp: 200, attr: 'resiliencia', ach: true },
              { d: '14 abr', t: 'Corrida 10km em 52min', xp: 80, attr: 'vitalidade' },
              { d: '12 abr', t: 'Leu "Thinking in Systems"', xp: 100, attr: 'inteligencia' },
            ].map((ev, i) => {
              const attr = ATTRIBUTES.find(a => a.id === ev.attr);
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: 10, alignItems: 'center' }}>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{ev.d}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                    {ev.ach && <Icon name="trophy" size={14} />}
                    <span style={{ color: 'var(--ink)' }}>{ev.t}</span>
                  </div>
                  <span className="mono" style={{ fontSize: 11, color: attr.hue, fontWeight: 600 }}>+{ev.xp}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function BigStat({ label, value, sub, accent }) {
  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{label}</div>
      <div className="serif" style={{ fontSize: 32, lineHeight: 1, marginTop: 6, color: accent ? 'var(--accent)' : 'var(--ink)' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>{sub}</div>
    </div>
  );
}

// Goals / Quests
function GoalsScreen({ state }) {
  return (
    <div style={{ padding: '28px 40px', maxWidth: 1300, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>Quests</div>
        <div className="serif" style={{ fontSize: 40, lineHeight: 1.1, marginTop: 4 }}>Objetivos & Missões</div>
        <div style={{ color: 'var(--ink-3)', marginTop: 6, fontSize: 14 }}>Metas de longo prazo com recompensa em XP</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        {state.quests.map(q => {
          const attr = ATTRIBUTES.find(a => a.id === q.attr);
          const pct = (q.progress / q.target) * 100;
          return (
            <div key={q.id} className="card" style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, background: `radial-gradient(circle at top right, color-mix(in oklch, ${attr.hue} 20%, transparent), transparent 70%)` }} />
              <div style={{ position: 'relative' }}>
                <div style={{ fontSize: 11, color: attr.hue, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{attr.icon} Quest · {attr.name}</div>
                <div className="serif" style={{ fontSize: 22, marginTop: 6, lineHeight: 1.2 }}>{q.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 16 }}>
                  <span className="serif" style={{ fontSize: 32, lineHeight: 1 }}>{q.progress}</span>
                  <span style={{ color: 'var(--ink-3)', fontSize: 14 }}>/ {q.target}</span>
                  <span className="mono" style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--ink-3)' }}>{pct.toFixed(0)}%</span>
                </div>
                <div className="xp-bar thick" style={{ marginTop: 10 }}>
                  <div className="fill" style={{ width: `${pct}%`, '--hue': attr.hue }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: 12 }}>
                  <span style={{ color: 'var(--ink-3)' }}>Recompensa</span>
                  <span className="mono" style={{ color: 'var(--accent)', fontWeight: 600 }}>+{q.xp} XP</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { ProfileScreen, BigStat, GoalsScreen });
