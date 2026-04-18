// screens-habits.jsx — Habits list with tracker + heatmap + CRUD

function HabitsScreen({ state, dispatch }) {
  const [selected, setSelected] = React.useState(state.habits[0]?.id);
  const [modal, setModal] = React.useState(null); // null | {mode:'new'|'edit', habit?}
  const habit = state.habits.find(h => h.id === selected) || state.habits[0];

  // keep selection valid after delete
  React.useEffect(() => {
    if (!state.habits.find(h => h.id === selected) && state.habits[0]) {
      setSelected(state.habits[0].id);
    }
  }, [state.habits, selected]);

  if (!habit) {
    return (
      <div style={{ padding: '28px 40px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>Rituais & Hábitos</div>
            <div className="serif" style={{ fontSize: 40, lineHeight: 1.1, marginTop: 4 }}>Tracker de hábitos</div>
          </div>
          <button className="btn primary" onClick={() => setModal({ mode: 'new' })}><Icon name="plus" size={14} /> Novo hábito</button>
        </div>
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <div className="serif" style={{ fontSize: 22, color: 'var(--ink-2)' }}>Nenhum hábito ainda.</div>
          <div style={{ color: 'var(--ink-3)', fontSize: 13, marginTop: 6 }}>Crie seu primeiro hábito para começar a subir de nível.</div>
          <button className="btn primary" onClick={() => setModal({ mode: 'new' })} style={{ marginTop: 18 }}>
            <Icon name="plus" size={14} /> Criar hábito
          </button>
        </div>
        {modal && <HabitModal mode={modal.mode} habit={modal.habit} onClose={() => setModal(null)}
          onSave={(h) => { dispatch({ type: 'addHabit', habit: h }); setSelected(h.id); setModal(null); }} />}
      </div>
    );
  }

  const attr = ATTRIBUTES.find(a => a.id === habit.attr);
  const history = HABIT_HISTORY[habit.id] || Array(90).fill(null);

  const last30 = history.slice(-30);
  const doneCount = last30.filter(x => x === 1).length;
  const applicable = last30.filter(x => x !== null).length;
  const completionRate = applicable ? Math.round((doneCount / applicable) * 100) : 0;

  return (
    <div style={{ padding: '28px 40px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>Rituais & Hábitos</div>
          <div className="serif" style={{ fontSize: 40, lineHeight: 1.1, marginTop: 4 }}>Tracker de hábitos</div>
        </div>
        <button className="btn primary" onClick={() => setModal({ mode: 'new' })}><Icon name="plus" size={14} /> Novo hábito</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 20 }}>
        {/* list */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 100px 100px 80px 60px 36px', padding: '14px 20px', borderBottom: '1px solid var(--line)', fontSize: 11, color: 'var(--ink-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <div></div>
            <div>Hábito</div>
            <div>Atributo</div>
            <div style={{ textAlign: 'center' }}>Últimos 7d</div>
            <div style={{ textAlign: 'right' }}>Streak</div>
            <div style={{ textAlign: 'right' }}>XP</div>
            <div></div>
          </div>
          {state.habits.map(h => {
            const ha = ATTRIBUTES.find(a => a.id === h.attr);
            const isSel = h.id === selected;
            const todayDone = h.done[3];
            return (
              <div key={h.id}
                onClick={() => setSelected(h.id)}
                style={{
                  display: 'grid', gridTemplateColumns: '28px 1fr 100px 100px 80px 60px 36px', padding: '14px 20px',
                  borderBottom: '1px solid var(--line)', alignItems: 'center', cursor: 'pointer',
                  background: isSel ? 'var(--surface-2)' : 'transparent',
                  borderLeft: isSel ? `3px solid ${ha.hue}` : '3px solid transparent',
                }}
              >
                <Checkbox checked={todayDone === 1} onChange={() => dispatch({ type: 'toggleHabit', id: h.id, day: 3 })} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{h.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>
                    {h.freq === 'weekday' ? 'Seg–Sex' : 'Diário'}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: ha.hue, fontWeight: 500 }}>
                  <span style={{ marginRight: 4 }}>{ha.icon}</span>{ha.name}
                </div>
                <div style={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  {h.done.map((v, i) => (
                    <div key={i} style={{
                      width: 10, height: 20, borderRadius: 2,
                      background: v === 1 ? ha.hue : v === null ? 'var(--line)' : 'color-mix(in oklch, var(--ink-4) 25%, var(--line))',
                      opacity: v === null ? 0.35 : 1,
                    }} />
                  ))}
                </div>
                <div style={{ textAlign: 'right' }}><Streak n={h.streak} /></div>
                <div className="mono" style={{ textAlign: 'right', fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>+{h.xp}</div>
                <HabitMenu habit={h}
                  onEdit={() => setModal({ mode: 'edit', habit: h })}
                  onDelete={() => {
                    if (confirm(`Excluir o hábito "${h.name}"? Esta ação não pode ser desfeita.`)) {
                      dispatch({ type: 'deleteHabit', id: h.id });
                    }
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, color: attr.hue, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {attr.icon} {attr.name}
                </div>
                <div className="serif" style={{ fontSize: 26, marginTop: 6, lineHeight: 1.2 }}>{habit.name}</div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button className="btn ghost" onClick={() => setModal({ mode: 'edit', habit })} style={{ padding: 6, fontSize: 12 }} title="Editar">
                  <Icon name="edit" size={14} />
                </button>
                <button className="btn ghost" onClick={() => {
                  if (confirm(`Excluir o hábito "${habit.name}"?`)) {
                    dispatch({ type: 'deleteHabit', id: habit.id });
                  }
                }} style={{ padding: 6, fontSize: 12, color: 'var(--forca)' }} title="Excluir">
                  <Icon name="trash" size={14} />
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 16 }}>
              <MetricCell label="Streak" value={habit.streak} suffix="dias" />
              <MetricCell label="30d" value={`${completionRate}%`} />
              <MetricCell label="XP total" value={habit.streak * habit.xp + 320} />
            </div>

            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Últimos 90 dias</div>
              <Heatmap data={history} color={attr.hue} />
            </div>

            <div style={{ marginTop: 16, padding: 12, background: 'var(--surface-2)', borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recompensa</div>
              <div style={{ display: 'flex', gap: 10, marginTop: 6, alignItems: 'center' }}>
                <span className="mono" style={{ fontSize: 18, color: 'var(--accent)', fontWeight: 600 }}>+{habit.xp} XP</span>
                <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>em {attr.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modal && <HabitModal
        mode={modal.mode} habit={modal.habit}
        onClose={() => setModal(null)}
        onSave={(h) => {
          if (modal.mode === 'new') {
            dispatch({ type: 'addHabit', habit: h });
            setSelected(h.id);
          } else {
            dispatch({ type: 'updateHabit', id: h.id, patch: h });
          }
          setModal(null);
        }}
      />}
    </div>
  );
}

function HabitMenu({ habit, onEdit, onDelete }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  return (
    <div ref={ref} style={{ position: 'relative', justifySelf: 'end' }} onClick={e => e.stopPropagation()}>
      <button className="btn ghost" onClick={() => setOpen(v => !v)} style={{ padding: 4 }}>
        <Icon name="dots" size={14} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 4,
          background: 'var(--bg-2)', border: '1px solid var(--line)',
          borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          minWidth: 140, zIndex: 100, overflow: 'hidden',
        }}>
          <button className="menu-item" onClick={() => { setOpen(false); onEdit(); }}>
            <Icon name="edit" size={12} /> Editar
          </button>
          <button className="menu-item danger" onClick={() => { setOpen(false); onDelete(); }}>
            <Icon name="trash" size={12} /> Excluir
          </button>
        </div>
      )}
    </div>
  );
}

function HabitModal({ mode, habit, onClose, onSave }) {
  const [name, setName] = React.useState(habit?.name || '');
  const [attr, setAttr] = React.useState(habit?.attr || 'disciplina');
  const [xp, setXp] = React.useState(habit?.xp || 20);
  const [icon, setIcon] = React.useState(habit?.icon || '◆');
  const [freq, setFreq] = React.useState(habit?.freq || 'daily');

  const canSave = name.trim().length >= 2;

  function submit() {
    if (!canSave) return;
    if (mode === 'edit') {
      onSave({ ...habit, name: name.trim(), attr, xp: Number(xp) || 10, icon, freq });
    } else {
      onSave({
        id: 'h' + Date.now(),
        name: name.trim(),
        icon, attr, xp: Number(xp) || 10,
        streak: 0,
        freq,
        done: [0, 0, 0, 0, 0, freq === 'weekday' ? null : 0, freq === 'weekday' ? null : 0],
      });
    }
  }

  React.useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 20, backdropFilter: 'blur(4px)',
      animation: 'fadeUp 0.2s ease',
    }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{
        width: '100%', maxWidth: 520, padding: 28, maxHeight: '90vh', overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--ink-3)', textTransform: 'uppercase', fontWeight: 500 }}>Hábito</div>
            <div className="serif" style={{ fontSize: 28, lineHeight: 1.1, marginTop: 4, color: 'var(--ink)' }}>
              {mode === 'edit' ? 'Editar hábito' : 'Novo hábito'}
            </div>
          </div>
          <button className="btn ghost" onClick={onClose} style={{ padding: 4 }}>
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* Name */}
        <div style={{ marginTop: 20 }}>
          <label style={FIELD_LABEL}>Nome *</label>
          <input value={name} onChange={e => setName(e.target.value)} autoFocus
            placeholder="Ex: Meditar 10min, Ler, Correr…"
            style={FIELD_INPUT} />
        </div>

        {/* Icon */}
        <div style={{ marginTop: 16 }}>
          <label style={FIELD_LABEL}>Ícone</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 6, marginTop: 6 }}>
            {['◆','◇','◈','◉','◎','◐','◑','◒','✦','☼','☽','△','▲','✶','♥','♦'].map(g => (
              <button key={g} onClick={() => setIcon(g)}
                className={icon === g ? 'avatar-swatch active' : 'avatar-swatch'}
                style={{ aspectRatio: '1', fontSize: 16 }}>
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Attribute */}
        <div style={{ marginTop: 16 }}>
          <label style={FIELD_LABEL}>Atributo (qual ganha XP)</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginTop: 6 }}>
            {ATTRIBUTES.map(a => (
              <button key={a.id} onClick={() => setAttr(a.id)}
                className={attr === a.id ? 'class-btn active' : 'class-btn'}
                style={{ textAlign: 'left', padding: '8px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: a.hue, fontSize: 14 }}>{a.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{a.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* XP + Frequency */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
          <div>
            <label style={FIELD_LABEL}>XP por conclusão</label>
            <input type="number" min="5" max="100" step="5" value={xp} onChange={e => setXp(e.target.value)} style={FIELD_INPUT} />
          </div>
          <div>
            <label style={FIELD_LABEL}>Frequência</label>
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              <button onClick={() => setFreq('daily')}
                className={freq === 'daily' ? 'class-btn active' : 'class-btn'}
                style={{ flex: 1, padding: '8px 10px', fontSize: 12 }}>Diário</button>
              <button onClick={() => setFreq('weekday')}
                className={freq === 'weekday' ? 'class-btn active' : 'class-btn'}
                style={{ flex: 1, padding: '8px 10px', fontSize: 12 }}>Seg–Sex</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 24, justifyContent: 'flex-end' }}>
          <button className="btn" onClick={onClose} style={{ fontSize: 13 }}>Cancelar</button>
          <button className="btn primary" onClick={submit} disabled={!canSave} style={{
            fontSize: 13, padding: '10px 18px',
            opacity: canSave ? 1 : 0.5, cursor: canSave ? 'pointer' : 'not-allowed',
          }}>
            {mode === 'edit' ? 'Salvar' : 'Criar hábito'}
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCell({ label, value, suffix }) {
  return (
    <div style={{ padding: 12, background: 'var(--surface-2)', borderRadius: 8 }}>
      <div style={{ fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
        <span className="serif" style={{ fontSize: 22, color: 'var(--ink)' }}>{value}</span>
        {suffix && <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{suffix}</span>}
      </div>
    </div>
  );
}

function Heatmap({ data, color }) {
  const weeks = [];
  for (let i = 0; i < data.length; i += 7) weeks.push(data.slice(i, i + 7));
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {weeks.map((w, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {w.map((v, j) => (
            <div key={j} style={{
              width: 14, height: 14, borderRadius: 3,
              background: v === 1 ? color : v === null ? 'transparent' : 'var(--line)',
              opacity: v === 1 ? 0.85 : 1,
              border: v === null ? '1px dashed var(--line)' : 'none',
            }} />
          ))}
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { HabitsScreen, MetricCell, Heatmap, HabitModal, HabitMenu });
