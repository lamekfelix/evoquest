// screens-character.jsx — Character sheet (RPG)

function CharacterScreen({ state }) {
  const { attrXp } = state;
  const totalXp = Object.values(attrXp).reduce((a, b) => a + b, 0);
  const heroLevel = deriveLevel(totalXp);

  return (
    <div style={{ padding: '28px 40px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>Character sheet</div>
        <div className="serif" style={{ fontSize: 40, lineHeight: 1.1, marginTop: 4 }}>Alexandre Moreira</div>
        <div style={{ color: 'var(--ink-3)', marginTop: 6, fontSize: 14 }}>Classe: Aventureiro · Iniciado em 12 de janeiro de 2026</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20 }}>
        {/* Left: avatar + stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 24, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 30%, color-mix(in oklch, var(--accent) 18%, transparent), transparent 70%)' }} />
            <div style={{ position: 'relative' }}>
              <div style={{
                width: 120, height: 120, borderRadius: '50%', margin: '0 auto',
                background: `linear-gradient(135deg, var(--accent), var(--accent-2))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-serif)', fontSize: 52, color: 'var(--bg)',
                boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.2), 0 8px 24px rgba(0,0,0,0.12)',
              }}>A</div>
              <div className="serif" style={{ fontSize: 32, marginTop: 16, lineHeight: 1 }}>Nível {heroLevel.level}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginTop: 4 }}>Aventureiro</div>

              <div style={{ margin: '18px auto 0', maxWidth: 240 }}>
                <div className="xp-bar thick"><div className="fill" style={{ width: `${heroLevel.progress * 100}%`, '--hue': 'var(--accent)' }} /></div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 6 }}>{heroLevel.xpInLevel} / {heroLevel.xpToNext} XP</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 18 }}>
            <div className="serif" style={{ fontSize: 18, marginBottom: 12 }}>Estatísticas gerais</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <MetricCell label="XP Total" value={totalXp.toLocaleString('pt-BR')} />
              <MetricCell label="Hábitos ativos" value={state.habits.length} />
              <MetricCell label="Maior streak" value={45} suffix="dias" />
              <MetricCell label="Quests concluídas" value={7} />
              <MetricCell label="Dias jogados" value={96} />
              <MetricCell label="Conquistas" value="3/6" />
            </div>
          </div>
        </div>

        {/* Right: attributes + achievements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div className="serif" style={{ fontSize: 22 }}>Atributos</div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>Barras de XP · estilo clássico</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 20 }}>
              {ATTRIBUTES.map(a => {
                const lvl = deriveLevel(attrXp[a.id]);
                return (
                  <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: 14, alignItems: 'center' }}>
                    <LevelBadge level={lvl.level} size={44} hue={a.hue} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                        <div>
                          <div style={{ fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{a.abbr}</div>
                          <div className="serif" style={{ fontSize: 17, lineHeight: 1.1, color: 'var(--ink)' }}>{a.name}</div>
                        </div>
                        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>LV {lvl.level}</div>
                      </div>
                      <div className="xp-bar thick"><div className="fill" style={{ width: `${lvl.progress * 100}%`, '--hue': a.hue }} /></div>
                      <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 3, display: 'flex', justifyContent: 'space-between' }}>
                        <span>{lvl.xpInLevel} / {lvl.xpToNext}</span>
                        <span>total: {attrXp[a.id].toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievements */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
              <div className="serif" style={{ fontSize: 20 }}>Conquistas</div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{ACHIEVEMENTS_SEED.filter(a => a.unlocked).length} / {ACHIEVEMENTS_SEED.length} desbloqueadas</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {ACHIEVEMENTS_SEED.map(a => (
                <div key={a.id} style={{
                  padding: 14, borderRadius: 10,
                  border: `1px solid ${a.unlocked ? 'color-mix(in oklch, var(--accent) 30%, var(--line))' : 'var(--line)'}`,
                  background: a.unlocked ? `color-mix(in oklch, var(--accent) 6%, var(--surface))` : 'var(--surface-2)',
                  opacity: a.unlocked ? 1 : 0.65,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: a.unlocked ? 'var(--accent)' : 'var(--line-2)',
                      color: a.unlocked ? 'var(--bg)' : 'var(--ink-3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
                    }}>
                      <Icon name={a.unlocked ? 'trophy' : 'sparkle'} size={14} />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{a.name}</div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.4 }}>{a.desc}</div>
                  <div className="mono" style={{ fontSize: 10, color: a.unlocked ? 'var(--accent)' : 'var(--ink-4)', marginTop: 6 }}>
                    {a.unlocked ? `Desbloqueado em ${a.date}` : `Progresso: ${a.progress}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CharacterScreen });
