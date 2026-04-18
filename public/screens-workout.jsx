// screens-workout.jsx — Workout builder (Funcional + Musculação)

function WorkoutScreen({ state, dispatch }) {
  const [selectedWId, setSelectedWId] = React.useState(state.workouts[0].id);
  const [filter, setFilter] = React.useState('all'); // all | musc | func | cardio | mob
  const [showLibrary, setShowLibrary] = React.useState(false);
  const [libGroup, setLibGroup] = React.useState('all');
  const [libQuery, setLibQuery] = React.useState('');

  const workout = state.workouts.find(w => w.id === selectedWId);
  const totalSets = workout.exercises.reduce((a, e) => a + e.sets, 0);
  const doneCount = workout.exercises.filter(e => e.done).length;
  const progress = workout.exercises.length ? doneCount / workout.exercises.length : 0;

  // week volume
  const weekVolume = state.workouts.reduce((acc, w) => {
    acc.totalSets += w.exercises.reduce((a, e) => a + e.sets, 0);
    acc.totalMin += w.durationMin;
    return acc;
  }, { totalSets: 0, totalMin: 0 });

  const kindColor = {
    musc:   'var(--forca)',
    func:   'var(--resiliencia)',
    cardio: 'var(--vitalidade)',
    mob:    'var(--equilibrio)',
  };
  const kindLabel = { musc: 'Musculação', func: 'Funcional', cardio: 'Cardio', mob: 'Mobilidade' };

  return (
    <div style={{ padding: '28px 40px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Hero */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, gap: 24, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 280 }}>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
            Treino · Mesociclo de hipertrofia
          </div>
          <div className="serif" style={{ fontSize: 40, lineHeight: 1.1, marginTop: 4 }}>
            Plano semanal
          </div>
          <div style={{ color: 'var(--ink-3)', marginTop: 6, fontSize: 14 }}>
            {state.workouts.length} sessões · {weekVolume.totalSets} séries totais · {Math.round(weekVolume.totalMin / 60 * 10) / 10}h/sem
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <StatCard label="Peso atual" value="78.4" unit="kg" delta="-1.2 kg" deltaPositive={true} />
          <StatCard label="Volume sem." value={weekVolume.totalSets} unit="séries" delta="+18 vs sem -1" deltaPositive={true} />
          <StatCard label="PR Supino" value="80" unit="kg" delta="+5 kg" deltaPositive={true} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
        {/* Left: week plan */}
        <div className="card" style={{ padding: 16, alignSelf: 'start' }}>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 12 }}>
            Semana — 13 a 19 de abril
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {state.workouts.map(w => {
              const done = w.exercises.filter(e => e.done).length;
              const total = w.exercises.length;
              const prog = total ? done / total : 0;
              const isSel = w.id === selectedWId;
              return (
                <div key={w.id}
                  onClick={() => setSelectedWId(w.id)}
                  style={{
                    padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                    background: isSel ? 'var(--surface-2)' : 'transparent',
                    borderLeft: `3px solid ${isSel ? kindColor[w.kind] : 'transparent'}`,
                    transition: 'background 0.12s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 500 }}>{w.day}</div>
                    <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{done}/{total}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500, marginBottom: 4 }}>
                    {w.label.split(' — ')[0]}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', marginBottom: 6 }}>
                    {kindLabel[w.kind]} · {w.durationMin}min
                  </div>
                  <div className="xp-bar" style={{ height: 3 }}>
                    <div className="fill" style={{ width: `${prog * 100}%`, '--hue': kindColor[w.kind] }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 8 }}>
              Distribuição
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['musc', 'func', 'cardio', 'mob'].map(k => {
                const count = state.workouts.filter(w => w.kind === k).length;
                const pct = count / state.workouts.length;
                return (
                  <div key={k} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--ink-2)', marginBottom: 2 }}>{kindLabel[k]}</div>
                      <div className="xp-bar" style={{ height: 4 }}>
                        <div className="fill" style={{ width: `${pct * 100}%`, '--hue': kindColor[k] }} />
                      </div>
                    </div>
                    <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: workout detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card" style={{ padding: 24 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: kindColor[workout.kind], color: 'var(--bg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {kindLabel[workout.kind]}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{workout.day}</span>
                </div>
                <div className="serif" style={{ fontSize: 26, lineHeight: 1.2 }}>{workout.label}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 6 }}>
                  {workout.exercises.length} exercícios · {totalSets} séries · ~{workout.durationMin}min
                </div>
              </div>
              <div style={{ textAlign: 'right', minWidth: 160 }}>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 4 }}>
                  Progresso
                </div>
                <div className="serif" style={{ fontSize: 28, lineHeight: 1, color: kindColor[workout.kind] }}>
                  {doneCount}<span style={{ color: 'var(--ink-3)', fontSize: 18 }}>/{workout.exercises.length}</span>
                </div>
                <div style={{ width: 160, marginTop: 8 }}>
                  <div className="xp-bar" style={{ height: 6 }}>
                    <div className="fill" style={{ width: `${progress * 100}%`, '--hue': kindColor[workout.kind] }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise table */}
            <div style={{ border: '1px solid var(--line)', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '28px 2.5fr 80px 90px 100px 80px 28px', padding: '10px 14px', background: 'var(--surface-2)', fontSize: 10, color: 'var(--ink-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <div></div>
                <div>Exercício</div>
                <div style={{ textAlign: 'center' }}>Séries</div>
                <div style={{ textAlign: 'center' }}>Reps</div>
                <div style={{ textAlign: 'center' }}>Carga</div>
                <div style={{ textAlign: 'center' }}>Desc.</div>
                <div></div>
              </div>
              {workout.exercises.map((ex, idx) => {
                const meta = EXERCISE_LIB.find(e => e.id === ex.exId);
                const group = MUSCLE_GROUPS.find(g => g.id === meta?.group);
                return (
                  <div key={idx} style={{
                    display: 'grid', gridTemplateColumns: '28px 2.5fr 80px 90px 100px 80px 28px',
                    padding: '12px 14px', alignItems: 'center',
                    borderTop: idx > 0 ? '1px solid var(--line)' : 'none',
                    background: ex.done ? 'color-mix(in oklch, var(--surface-2), var(--bg) 40%)' : 'transparent',
                    opacity: ex.done ? 0.65 : 1,
                  }}>
                    <Checkbox checked={ex.done} onChange={() => dispatch({ type: 'toggleExercise', wId: workout.id, idx })} />
                    <div>
                      <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500, textDecoration: ex.done ? 'line-through' : 'none' }}>
                        {meta?.name || 'Exercício'}
                      </div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 3, alignItems: 'center' }}>
                        <span style={{ fontSize: 10, color: group?.hue, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          ● {group?.name}
                        </span>
                      </div>
                    </div>
                    <EditCell
                      value={ex.sets}
                      align="center"
                      onSave={(v) => dispatch({ type: 'updateExercise', wId: workout.id, idx, field: 'sets', value: parseInt(v) || 0 })}
                    />
                    <EditCell
                      value={ex.reps}
                      align="center"
                      onSave={(v) => dispatch({ type: 'updateExercise', wId: workout.id, idx, field: 'reps', value: v })}
                    />
                    <EditCell
                      value={ex.load}
                      align="center"
                      onSave={(v) => dispatch({ type: 'updateExercise', wId: workout.id, idx, field: 'load', value: v })}
                    />
                    <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-3)' }} className="mono">
                      {ex.rest}s
                    </div>
                    <button
                      onClick={() => dispatch({ type: 'removeExercise', wId: workout.id, idx })}
                      style={{ background: 'none', border: 'none', color: 'var(--ink-4)', cursor: 'pointer', padding: 4, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-2)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--ink-4)'}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowLibrary(true)}
              className="btn"
              style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}
            >
              <Icon name="plus" size={12} /> Adicionar exercício
            </button>
          </div>

          {/* Muscle distribution + tips */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 12 }}>
                Volume por grupo · esta sessão
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(() => {
                  const groupSets = {};
                  workout.exercises.forEach(ex => {
                    const meta = EXERCISE_LIB.find(e => e.id === ex.exId);
                    if (!meta) return;
                    groupSets[meta.group] = (groupSets[meta.group] || 0) + ex.sets;
                  });
                  const max = Math.max(1, ...Object.values(groupSets));
                  return Object.entries(groupSets).map(([gid, sets]) => {
                    const g = MUSCLE_GROUPS.find(m => m.id === gid);
                    return (
                      <div key={gid} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 30px', gap: 10, alignItems: 'center' }}>
                        <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>{g?.name}</div>
                        <div className="xp-bar" style={{ height: 8 }}>
                          <div className="fill" style={{ width: `${(sets / max) * 100}%`, '--hue': g?.hue }} />
                        </div>
                        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', textAlign: 'right' }}>{sets}</div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 12 }}>
                Próximos PRs esperados
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <PRRow name="Supino reto" current="80kg" target="85kg" weeks={3} />
                <PRRow name="Agachamento" current="100kg" target="110kg" weeks={4} />
                <PRRow name="Barra fixa" current="+10kg" target="+15kg" weeks={5} />
                <PRRow name="Stiff" current="60kg" target="70kg" weeks={3} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showLibrary && (
        <ExerciseLibraryModal
          onClose={() => setShowLibrary(false)}
          onAdd={(exId) => dispatch({ type: 'addExercise', wId: workout.id, exId })}
          libGroup={libGroup}
          setLibGroup={setLibGroup}
          libQuery={libQuery}
          setLibQuery={setLibQuery}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, unit, delta, deltaPositive }) {
  return (
    <div className="card" style={{ padding: '12px 18px', minWidth: 130 }}>
      <div style={{ fontSize: 10, color: 'var(--ink-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
        <div className="serif" style={{ fontSize: 24, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{unit}</div>
      </div>
      <div style={{ fontSize: 10, color: deltaPositive ? 'var(--good)' : 'var(--ink-3)', marginTop: 4, fontWeight: 500 }}>
        {delta}
      </div>
    </div>
  );
}

function EditCell({ value, onSave, align = 'left' }) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  React.useEffect(() => { setDraft(value); }, [value]);

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => { onSave(draft); setEditing(false); }}
        onKeyDown={(e) => { if (e.key === 'Enter') { onSave(draft); setEditing(false); } if (e.key === 'Escape') setEditing(false); }}
        className="mono"
        style={{
          width: '100%', padding: '4px 6px', border: '1px solid var(--accent)',
          borderRadius: 4, fontSize: 12, textAlign: align, background: 'var(--bg)', color: 'var(--ink)',
        }}
      />
    );
  }
  return (
    <div
      onClick={() => setEditing(true)}
      className="mono"
      style={{
        fontSize: 12, color: 'var(--ink)', textAlign: align, cursor: 'text',
        padding: '4px 6px', borderRadius: 4, transition: 'background 0.12s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      {value}
    </div>
  );
}

function PRRow({ name, current, target, weeks }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
      <div>
        <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>{name}</div>
        <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>
          <span className="mono">{current}</span> <span style={{ opacity: 0.5 }}>→</span> <span className="mono" style={{ color: 'var(--accent)' }}>{target}</span>
        </div>
      </div>
      <div style={{ fontSize: 11, color: 'var(--ink-3)', textAlign: 'right' }}>
        <div className="mono" style={{ fontSize: 14, color: 'var(--ink)' }}>{weeks}</div>
        <div>semanas</div>
      </div>
    </div>
  );
}

function ExerciseLibraryModal({ onClose, onAdd, libGroup, setLibGroup, libQuery, setLibQuery }) {
  const filtered = EXERCISE_LIB.filter(ex => {
    if (libGroup !== 'all' && ex.group !== libGroup) return false;
    if (libQuery && !ex.name.toLowerCase().includes(libQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card"
        style={{ width: 600, maxHeight: '80vh', padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--line)' }}>
          <div className="serif" style={{ fontSize: 22, marginBottom: 10 }}>Biblioteca de exercícios</div>
          <input
            value={libQuery}
            onChange={(e) => setLibQuery(e.target.value)}
            placeholder="Buscar exercício..."
            style={{
              width: '100%', padding: '8px 12px', border: '1px solid var(--line)',
              borderRadius: 6, fontSize: 13, background: 'var(--bg)', color: 'var(--ink)',
              fontFamily: 'var(--font-sans)', outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, padding: '12px 22px', borderBottom: '1px solid var(--line)', flexWrap: 'wrap' }}>
          {['all', ...MUSCLE_GROUPS.map(g => g.id)].map(gid => {
            const g = MUSCLE_GROUPS.find(m => m.id === gid);
            const isSel = libGroup === gid;
            return (
              <button
                key={gid}
                onClick={() => setLibGroup(gid)}
                style={{
                  padding: '4px 10px', borderRadius: 20, fontSize: 11,
                  border: `1px solid ${isSel ? (g?.hue || 'var(--accent)') : 'var(--line)'}`,
                  background: isSel ? (g?.hue || 'var(--accent)') : 'transparent',
                  color: isSel ? 'var(--bg)' : 'var(--ink-2)',
                  cursor: 'pointer', fontWeight: 500,
                }}
              >
                {gid === 'all' ? 'Todos' : g?.name}
              </button>
            );
          })}
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '8px 0' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>Nenhum exercício encontrado</div>
          ) : filtered.map(ex => {
            const g = MUSCLE_GROUPS.find(m => m.id === ex.group);
            return (
              <div
                key={ex.id}
                onClick={() => { onAdd(ex.id); onClose(); }}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 22px', cursor: 'pointer', borderBottom: '1px solid var(--line)',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div>
                  <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{ex.name}</div>
                  <div style={{ fontSize: 11, marginTop: 2, display: 'flex', gap: 10 }}>
                    <span style={{ color: g?.hue, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>● {g?.name}</span>
                    <span style={{ color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {ex.kind === 'musc' ? 'Musculação' : ex.kind === 'func' ? 'Funcional' : ex.kind === 'cardio' ? 'Cardio' : 'Mobilidade'}
                    </span>
                  </div>
                </div>
                <Icon name="plus" size={14} />
              </div>
            );
          })}
        </div>

        <div style={{ padding: '12px 22px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WorkoutScreen });
