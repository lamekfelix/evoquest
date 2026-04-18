// screens-agenda.jsx — Daily, Weekly, Monthly agenda views

function DailyScreen({ state, dispatch }) {
  const [dateOffset, setDateOffset] = React.useState(0);
  const [showNew, setShowNew] = React.useState(false);
  const d = addDays(today, dateOffset);
  const iso = dateISO(d);
  const tasks = state.agenda.filter(t => t.date === iso).sort((a, b) => a.time.localeCompare(b.time));
  const areas = state.areas || [];
  const projects = state.projects || [];

  const hours = Array.from({ length: 16 }, (_, i) => i + 6); // 6am → 9pm

  const parseTime = (t) => { const [h, m] = t.split(':').map(Number); return h + m / 60; };

  return (
    <div style={{ padding: '28px 40px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
            {d.toLocaleDateString('pt-BR', { weekday: 'long' })}
          </div>
          <div className="serif" style={{ fontSize: 40, lineHeight: 1.1, marginTop: 4 }}>
            {d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn" onClick={() => setDateOffset(o => o - 1)}>‹ Anterior</button>
          <button className="btn" onClick={() => setDateOffset(0)}>Hoje</button>
          <button className="btn" onClick={() => setDateOffset(o => o + 1)}>Próximo ›</button>
          <button className="btn primary" onClick={() => setShowNew(true)} style={{ marginLeft: 8 }}>
            <Icon name="plus" size={14} /> Adicionar
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Timeline */}
        <div className="card" style={{ padding: 20, position: 'relative' }}>
          <div style={{ position: 'relative', minHeight: hours.length * 56 }}>
            {hours.map((h, i) => (
              <div key={h} style={{ position: 'relative', height: 56, borderTop: i === 0 ? 'none' : '1px solid var(--line)' }}>
                <span className="mono" style={{ position: 'absolute', left: 0, top: -8, fontSize: 10, color: 'var(--ink-4)', background: 'var(--surface)', padding: '2px 6px' }}>
                  {String(h).padStart(2, '0')}:00
                </span>
              </div>
            ))}
            {/* now line */}
            {dateOffset === 0 && (() => {
              const nowHour = 10.5; // 10:30 for demo
              const y = (nowHour - 6) * 56;
              return (
                <div style={{ position: 'absolute', left: 50, right: 0, top: y, height: 2, background: 'var(--accent)', zIndex: 2 }}>
                  <div style={{ position: 'absolute', left: -5, top: -4, width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)' }} />
                  <span className="mono" style={{ position: 'absolute', right: 0, top: -16, fontSize: 10, color: 'var(--accent)', fontWeight: 600 }}>AGORA 10:30</span>
                </div>
              );
            })()}
            {tasks.length === 0 && (
              <div style={{ position: 'absolute', left: 58, right: 12, top: 80 }}>
                <EmptyState
                  icon="cal"
                  title="Dia livre"
                  hint="Clique em Adicionar para criar um compromisso ou tarefa com horário."
                  action={{ label: '+ Adicionar', onClick: () => setShowNew(true) }}
                />
              </div>
            )}
            {tasks.map(t => {
              const start = parseTime(t.time);
              const end = parseTime(t.end);
              const top = (start - 6) * 56;
              const height = Math.max(26, (end - start) * 56 - 2);
              const area = areas.find(a => a.id === t.area) || { color: 'var(--ink-3)', icon: '○', name: 'Sem área' };
              const project = t.project ? projects.find(p => p.id === t.project) : null;
              return (
                <div key={t.id}
                  onClick={() => dispatch({ type: 'toggleAgenda', id: t.id })}
                  style={{
                    position: 'absolute', left: 58, right: 12, top, height,
                    background: `color-mix(in oklch, ${area.color} ${t.done ? 8 : 15}%, var(--surface))`,
                    border: `1px solid color-mix(in oklch, ${area.color} ${t.done ? 20 : 35}%, transparent)`,
                    borderLeft: `3px solid ${area.color}`,
                    borderRadius: 6, padding: '6px 10px',
                    cursor: 'pointer', overflow: 'hidden',
                    opacity: t.done ? 0.6 : 1,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500,
                    textDecoration: t.done ? 'line-through' : 'none', color: 'var(--ink)' }}>
                    <Checkbox checked={t.done} onChange={() => dispatch({ type: 'toggleAgenda', id: t.id })} size={14} />
                    {t.title}
                  </div>
                  {height > 40 && (
                    <div style={{ display: 'flex', gap: 8, fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>
                      <span className="mono">{t.time}–{t.end}</span>
                      {project && <span>· {project.name}</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar: habits + notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 18 }}>
            <div className="serif" style={{ fontSize: 18, marginBottom: 12 }}>Rituais do dia</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {state.habits.slice(0, 5).map(h => <HabitMiniCard key={h.id} habit={h} state={state} dispatch={dispatch} dayIdx={3} />)}
            </div>
          </div>
          <div className="card" style={{ padding: 18 }}>
            <div className="serif" style={{ fontSize: 18, marginBottom: 8 }}>Reflexão</div>
            <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6, fontStyle: 'italic' }}>
              "Começou o dia cedo e com energia. A sessão de deep work foi produtiva — terminei o refactor dos componentes."
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
              <span className="stat-pill">energia: alta</span>
              <span className="stat-pill">humor: bom</span>
              <span className="stat-pill">foco: 8/10</span>
            </div>
          </div>
        </div>
      </div>

      {showNew && <NewAgendaModal
        defaultDate={iso}
        areas={areas}
        projects={projects}
        onClose={() => setShowNew(false)}
        onCreate={(task) => {
          dispatch({ type: 'addAgenda', task });
          setShowNew(false);
        }}
      />}
    </div>
  );
}

function NewAgendaModal({ defaultDate, areas, projects, onClose, onCreate }) {
  const [title, setTitle] = React.useState('');
  const [date, setDate] = React.useState(defaultDate);
  const [time, setTime] = React.useState('09:00');
  const [end, setEnd] = React.useState('10:00');
  const [kind, setKind] = React.useState('task'); // 'task' | 'event'
  const [area, setArea] = React.useState(areas[0]?.id || '');
  const [project, setProject] = React.useState('');
  const [notes, setNotes] = React.useState('');

  const canCreate = title.trim().length >= 2;

  React.useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Auto-adjust end time when start changes
  function onTimeChange(v) {
    setTime(v);
    const [h, m] = v.split(':').map(Number);
    const endH = Math.min(23, h + 1);
    setEnd(`${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  }

  function submit() {
    if (!canCreate) return;
    onCreate({
      id: 't' + Date.now(),
      title: title.trim(),
      kind,
      date,
      time,
      end,
      area: area || null,
      project: project || null,
      notes: notes.trim() || undefined,
      done: false,
      createdAt: new Date().toISOString(),
    });
  }

  const areaProjects = projects.filter(p => !area || p.area === area);

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 20, backdropFilter: 'blur(4px)', animation: 'fadeUp 0.2s ease',
    }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{
        width: '100%', maxWidth: 580, padding: 28, maxHeight: '90vh', overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--ink-3)', textTransform: 'uppercase', fontWeight: 500 }}>Agenda</div>
            <div className="serif" style={{ fontSize: 26, lineHeight: 1.1, marginTop: 4 }}>Novo {kind === 'event' ? 'compromisso' : 'task'}</div>
          </div>
          <button className="btn ghost" onClick={onClose} style={{ padding: 4 }}><Icon name="x" size={16} /></button>
        </div>

        {/* Kind toggle */}
        <div style={{ display: 'flex', gap: 6, marginTop: 16 }}>
          <button onClick={() => setKind('task')}
            className={kind === 'task' ? 'class-btn active' : 'class-btn'}
            style={{ flex: 1, padding: '10px', fontSize: 13, fontWeight: 500 }}>
            <Icon name="check" size={14} /> Tarefa
          </button>
          <button onClick={() => setKind('event')}
            className={kind === 'event' ? 'class-btn active' : 'class-btn'}
            style={{ flex: 1, padding: '10px', fontSize: 13, fontWeight: 500 }}>
            <Icon name="cal" size={14} /> Compromisso
          </button>
        </div>

        <div style={{ marginTop: 16 }}>
          <label style={FIELD_LABEL}>Título *</label>
          <input autoFocus value={title} onChange={e => setTitle(e.target.value)}
            placeholder={kind === 'task' ? 'Ex: Escrever relatório, Estudar cap 4…' : 'Ex: Reunião com equipe, Consulta médica…'}
            style={FIELD_INPUT} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: 10, marginTop: 16 }}>
          <div>
            <label style={FIELD_LABEL}>Data</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={FIELD_INPUT} />
          </div>
          <div>
            <label style={FIELD_LABEL}>Início</label>
            <input type="time" value={time} onChange={e => onTimeChange(e.target.value)} style={FIELD_INPUT} />
          </div>
          <div>
            <label style={FIELD_LABEL}>Fim</label>
            <input type="time" value={end} onChange={e => setEnd(e.target.value)} style={FIELD_INPUT} />
          </div>
        </div>

        {areas.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <label style={FIELD_LABEL}>Área <span style={{ color: 'var(--ink-4)' }}>(opcional)</span></label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
              <button onClick={() => { setArea(''); setProject(''); }}
                className={!area ? 'class-btn active' : 'class-btn'}
                style={{ padding: '6px 12px', fontSize: 12 }}>Nenhuma</button>
              {areas.map(a => (
                <button key={a.id} onClick={() => { setArea(a.id); setProject(''); }}
                  className={area === a.id ? 'class-btn active' : 'class-btn'}
                  style={{ padding: '6px 12px', fontSize: 12 }}>
                  <span style={{ color: a.color, marginRight: 6 }}>{a.icon}</span>{a.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {area && areaProjects.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <label style={FIELD_LABEL}>Projeto <span style={{ color: 'var(--ink-4)' }}>(opcional)</span></label>
            <select value={project} onChange={e => setProject(e.target.value)} style={FIELD_INPUT}>
              <option value="">— Sem projeto —</option>
              {areaProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <label style={FIELD_LABEL}>Notas <span style={{ color: 'var(--ink-4)' }}>(opcional)</span></label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            rows={2} placeholder="Detalhes, contexto, links…"
            style={{ ...FIELD_INPUT, resize: 'vertical', minHeight: 52, fontFamily: 'inherit' }} />
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 24, justifyContent: 'flex-end' }}>
          <button className="btn" onClick={onClose} style={{ fontSize: 13 }}>Cancelar</button>
          <button className="btn primary" onClick={submit} disabled={!canCreate}
            style={{ fontSize: 13, padding: '10px 18px', opacity: canCreate ? 1 : 0.5, cursor: canCreate ? 'pointer' : 'not-allowed' }}>
            Criar {kind === 'event' ? 'compromisso' : 'tarefa'}
          </button>
        </div>
      </div>
    </div>
  );
}
  const weekStart = addDays(today, -3); // Mon of current week (today = Fri, 17 Apr → Mon 14)
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = [6,8,10,12,14,16,18,20,22];
  const parseTime = (t) => { const [h, m] = t.split(':').map(Number); return h + m / 60; };

  return (
    <div style={{ padding: '28px 40px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
            Semana 16 · 2026
          </div>
          <div className="serif" style={{ fontSize: 40, lineHeight: 1.1, marginTop: 4 }}>
            14 – 20 de abril
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <StatPill label="Compromissos" value={state.agenda.filter(t => {
            const d = new Date(t.date);
            return d >= weekStart && d <= addDays(weekStart, 6);
          }).length} />
          <StatPill label="Concluídos" value={state.agenda.filter(t => {
            const d = new Date(t.date);
            return d >= weekStart && d <= addDays(weekStart, 6) && t.done;
          }).length} />
          <StatPill label="XP da semana" value={`+${Math.round(state.xpGainedToday + 380)}`} accent />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* header row */}
        <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: '1px solid var(--line)' }}>
          <div />
          {days.map((d, i) => {
            const isToday = dateISO(d) === dateISO(today);
            return (
              <div key={i} style={{
                padding: '12px 10px', borderLeft: '1px solid var(--line)',
                background: isToday ? 'color-mix(in oklch, var(--accent) 8%, transparent)' : 'transparent',
              }}>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>
                  {d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.','')}
                </div>
                <div className="serif" style={{ fontSize: 22, color: isToday ? 'var(--accent)' : 'var(--ink)' }}>
                  {d.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* grid body */}
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', minHeight: (22-6) * 26 }}>
          {/* hour labels */}
          <div style={{ position: 'relative' }}>
            {hours.map(h => (
              <div key={h} style={{ position: 'absolute', top: (h - 6) * 26 - 7, left: 0, right: 0, padding: '0 10px', fontSize: 10, color: 'var(--ink-4)' }} className="mono">
                {String(h).padStart(2,'0')}:00
              </div>
            ))}
          </div>
          {/* day columns */}
          {days.map((d, di) => {
            const iso = dateISO(d);
            const tasks = state.agenda.filter(t => t.date === iso);
            return (
              <div key={di} style={{ position: 'relative', borderLeft: '1px solid var(--line)', minHeight: 420 }}>
                {hours.map(h => <div key={h} style={{ position: 'absolute', top: (h - 6) * 26, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: 0.5 }} />)}
                {tasks.map(t => {
                  const start = parseTime(t.time);
                  const end = parseTime(t.end);
                  const top = (start - 6) * 26;
                  const height = Math.max(18, (end - start) * 26 - 1);
                  const area = AREAS_SEED.find(a => a.id === t.area);
                  return (
                    <div key={t.id}
                      onClick={() => dispatch({ type: 'toggleAgenda', id: t.id })}
                      style={{
                        position: 'absolute', left: 2, right: 2, top, height,
                        background: `color-mix(in oklch, ${area.color} ${t.done ? 8 : 18}%, var(--surface))`,
                        borderLeft: `2px solid ${area.color}`, borderRadius: 4, padding: '2px 6px',
                        fontSize: 10.5, color: 'var(--ink)', overflow: 'hidden', cursor: 'pointer',
                        textDecoration: t.done ? 'line-through' : 'none', opacity: t.done ? 0.6 : 1,
                        fontWeight: 500, lineHeight: 1.2,
                      }}
                    >
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
                      {height > 30 && <div className="mono" style={{ fontSize: 9, color: 'var(--ink-3)', marginTop: 1 }}>{t.time}</div>}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WeeklyScreen({ state, dispatch }) {
  const [showNew, setShowNew] = React.useState(false);
  const weekStart = addDays(today, -3); // Mon of current week (today = Fri, 17 Apr → Mon 14)
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = [6,8,10,12,14,16,18,20,22];
  const parseTime = (t) => { const [h, m] = t.split(':').map(Number); return h + m / 60; };
  const areas = state.areas || [];
  const projects = state.projects || [];

  return (
    <div style={{ padding: '28px 40px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
            Semana 16 · 2026
          </div>
          <div className="serif" style={{ fontSize: 40, lineHeight: 1.1, marginTop: 4 }}>
            14 – 20 de abril
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <StatPill label="Compromissos" value={state.agenda.filter(t => {
            const d = new Date(t.date);
            return d >= weekStart && d <= addDays(weekStart, 6);
          }).length} />
          <StatPill label="Concluídos" value={state.agenda.filter(t => {
            const d = new Date(t.date);
            return d >= weekStart && d <= addDays(weekStart, 6) && t.done;
          }).length} />
          <StatPill label="XP da semana" value={`+${state.xpGainedToday}`} accent />
          <button className="btn primary" onClick={() => setShowNew(true)} style={{ marginLeft: 8 }}>
            <Icon name="plus" size={14} /> Adicionar
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: '1px solid var(--line)' }}>
          <div />
          {days.map((d, i) => {
            const isToday = dateISO(d) === dateISO(today);
            return (
              <div key={i} style={{
                padding: '12px 10px', borderLeft: '1px solid var(--line)',
                background: isToday ? 'color-mix(in oklch, var(--accent) 8%, transparent)' : 'transparent',
              }}>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>
                  {d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.','')}
                </div>
                <div className="serif" style={{ fontSize: 22, color: isToday ? 'var(--accent)' : 'var(--ink)' }}>
                  {d.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', minHeight: (22-6) * 26 }}>
          <div style={{ position: 'relative' }}>
            {hours.map(h => (
              <div key={h} style={{ position: 'absolute', top: (h - 6) * 26 - 7, left: 0, right: 0, padding: '0 10px', fontSize: 10, color: 'var(--ink-4)' }} className="mono">
                {String(h).padStart(2,'0')}:00
              </div>
            ))}
          </div>
          {days.map((d, di) => {
            const iso = dateISO(d);
            const tasks = state.agenda.filter(t => t.date === iso);
            return (
              <div key={di} style={{ position: 'relative', borderLeft: '1px solid var(--line)', minHeight: 420 }}>
                {hours.map(h => <div key={h} style={{ position: 'absolute', top: (h - 6) * 26, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: 0.5 }} />)}
                {tasks.map(t => {
                  const start = parseTime(t.time);
                  const end = parseTime(t.end);
                  const top = (start - 6) * 26;
                  const height = Math.max(18, (end - start) * 26 - 1);
                  const area = areas.find(a => a.id === t.area) || { color: 'var(--ink-3)' };
                  return (
                    <div key={t.id}
                      onClick={() => dispatch({ type: 'toggleAgenda', id: t.id })}
                      style={{
                        position: 'absolute', left: 2, right: 2, top, height,
                        background: `color-mix(in oklch, ${area.color} ${t.done ? 8 : 18}%, var(--surface))`,
                        borderLeft: `2px solid ${area.color}`, borderRadius: 4, padding: '2px 6px',
                        fontSize: 10.5, color: 'var(--ink)', overflow: 'hidden', cursor: 'pointer',
                        textDecoration: t.done ? 'line-through' : 'none', opacity: t.done ? 0.6 : 1,
                        fontWeight: 500, lineHeight: 1.2,
                      }}
                    >
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
                      {height > 30 && <div className="mono" style={{ fontSize: 9, color: 'var(--ink-3)', marginTop: 1 }}>{t.time}</div>}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {showNew && <NewAgendaModal
        defaultDate={dateISO(today)}
        areas={areas}
        projects={projects}
        onClose={() => setShowNew(false)}
        onCreate={(task) => {
          dispatch({ type: 'addAgenda', task });
          setShowNew(false);
        }}
      />}
    </div>
  );
}

function MonthlyScreen({ state, dispatch }) {
  const [showNew, setShowNew] = React.useState(false);
  // April 2026: starts Wed (Apr 1)
  const monthStart = new Date('2026-04-01');
  const firstDay = monthStart.getDay(); // 3 (Wed)
  const offsetStart = (firstDay + 6) % 7; // shift: Mon=0..Sun=6 → April 1 is Wed → offset 2
  const gridStart = addDays(monthStart, -offsetStart);
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const areas = state.areas || [];
  const projects = state.projects || [];

  return (
    <div style={{ padding: '28px 40px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>Abril · 2026</div>
          <div className="serif" style={{ fontSize: 40, lineHeight: 1.1, marginTop: 4 }}>Visão mensal</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', maxWidth: 400 }}>
          {areas.slice(0, 6).map(a => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--ink-3)' }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: a.color }} />
              {a.name}
            </div>
          ))}
          </div>
          <button className="btn primary" onClick={() => setShowNew(true)}>
            <Icon name="plus" size={14} /> Adicionar
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--line)' }}>
          {['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map(d => (
            <div key={d} style={{ padding: '10px 14px', fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '120px' }}>
          {cells.map((d, i) => {
            const iso = dateISO(d);
            const inMonth = d.getMonth() === 3;
            const isToday = iso === dateISO(today);
            const tasks = state.agenda.filter(t => t.date === iso);
            return (
              <div key={i} style={{
                padding: 8, borderRight: (i % 7 !== 6) ? '1px solid var(--line)' : 'none',
                borderBottom: '1px solid var(--line)',
                background: isToday ? 'color-mix(in oklch, var(--accent) 6%, var(--surface))' : 'var(--surface)',
                opacity: inMonth ? 1 : 0.35,
                display: 'flex', flexDirection: 'column', gap: 3, overflow: 'hidden',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="serif" style={{ fontSize: 16, color: isToday ? 'var(--accent)' : 'var(--ink-2)', fontWeight: isToday ? 500 : 400 }}>
                    {d.getDate()}
                  </span>
                  {tasks.length > 0 && <span className="mono" style={{ fontSize: 9, color: 'var(--ink-4)' }}>{tasks.length}</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' }}>
                  {tasks.slice(0, 3).map(t => {
                    const area = areas.find(a => a.id === t.area) || { color: 'var(--ink-3)' };
                    return (
                      <div key={t.id} style={{
                        fontSize: 10.5, padding: '1px 5px', borderRadius: 3,
                        background: `color-mix(in oklch, ${area.color} ${t.done ? 10 : 18}%, transparent)`,
                        color: 'var(--ink)',
                        borderLeft: `2px solid ${area.color}`,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        textDecoration: t.done ? 'line-through' : 'none',
                        opacity: t.done ? 0.55 : 1,
                      }}>
                        {t.title}
                      </div>
                    );
                  })}
                  {tasks.length > 3 && <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>+{tasks.length - 3} mais</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showNew && <NewAgendaModal
        defaultDate={dateISO(today)}
        areas={areas}
        projects={projects}
        onClose={() => setShowNew(false)}
        onCreate={(task) => {
          dispatch({ type: 'addAgenda', task });
          setShowNew(false);
        }}
      />}
    </div>
  );
}

function StatPill({ label, value, accent }) {
  return (
    <div style={{ padding: '6px 12px', border: '1px solid var(--line)', borderRadius: 8, background: 'var(--surface)' }}>
      <div style={{ fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{label}</div>
      <div className="mono" style={{ fontSize: 16, fontWeight: 500, color: accent ? 'var(--accent)' : 'var(--ink)', marginTop: 2 }}>{value}</div>
    </div>
  );
}

Object.assign(window, { DailyScreen, WeeklyScreen, MonthlyScreen, StatPill, NewAgendaModal });
