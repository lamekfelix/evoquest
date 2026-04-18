// app.jsx — main app shell with sidebar, state, tweaks

const STORAGE_KEY = 'evoquest:state:v1';
const TWEAKS_KEY = 'evoquest:tweaks:v1';

function loadSaved(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

const EMPTY_ATTR_XP = {
  forca: 0, inteligencia: 0, sabedoria: 0, disciplina: 0,
  foco: 0, vitalidade: 0, resiliencia: 0, equilibrio: 0,
};

// Apply class bonus (primary +3, secondary +2, others +1 → XP multiplier)
function attrXpFromClass(classId) {
  const cls = (window.CLASSES || []).find(c => c.id === classId);
  const base = { ...EMPTY_ATTR_XP };
  if (!cls) return base;
  // Small starting XP so player sees bars filled slightly — feels like "you begin with latent talent"
  for (const k of Object.keys(base)) {
    base[k] = k === cls.primary ? 60 : k === cls.secondary ? 40 : 20;
  }
  return base;
}

const INITIAL_STATE = {
  attrXp: { ...EMPTY_ATTR_XP },
  habits: [],
  agenda: [],
  quests: [],
  projects: [],
  areas: [],
  resources: [],
  archives: [],
  xpGainedToday: 0,
  toasts: [],
  workouts: [],
  meals: [],
  waterToday: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'toggleHabit': {
      const habits = state.habits.map(h => {
        if (h.id !== action.id) return h;
        const done = [...h.done];
        const was = done[action.day];
        done[action.day] = was === 1 ? 0 : 1;
        return { ...h, done, streak: was === 1 ? Math.max(0, h.streak - 1) : h.streak + 1 };
      });
      const habit = state.habits.find(h => h.id === action.id);
      const was = habit.done[action.day];
      const delta = was === 1 ? -habit.xp : habit.xp;
      const attrXp = { ...state.attrXp, [habit.attr]: Math.max(0, state.attrXp[habit.attr] + delta) };
      const xpGainedToday = Math.max(0, state.xpGainedToday + delta);
      const toasts = delta > 0 ? [...state.toasts, { id: Date.now(), xp: delta, attr: habit.attr, name: habit.name }] : state.toasts;
      return { ...state, habits, attrXp, xpGainedToday, toasts };
    }
    case 'toggleAgenda': {
      const task = state.agenda.find(t => t.id === action.id);
      const agenda = state.agenda.map(t => t.id === action.id ? { ...t, done: !t.done } : t);
      // small XP for task completion
      const delta = task.done ? -10 : 10;
      const attrBucket = task.area === 'a1' ? 'foco' : task.area === 'a2' ? 'inteligencia' : task.area === 'a3' ? 'vitalidade' : 'disciplina';
      const attrXp = { ...state.attrXp, [attrBucket]: Math.max(0, state.attrXp[attrBucket] + delta) };
      const xpGainedToday = Math.max(0, state.xpGainedToday + delta);
      const toasts = delta > 0 ? [...state.toasts, { id: Date.now(), xp: delta, attr: attrBucket, name: task.title }] : state.toasts;
      return { ...state, agenda, attrXp, xpGainedToday, toasts };
    }
    case 'addAgenda': {
      return { ...state, agenda: [...state.agenda, action.task] };
    }
    case 'deleteAgenda': {
      return { ...state, agenda: state.agenda.filter(t => t.id !== action.id) };
    }
    case 'dismissToast': {
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) };
    }
    case 'initCharacter': {
      // Fresh start: reset everything + seed attribute XP from the chosen class
      return { ...INITIAL_STATE, attrXp: attrXpFromClass(action.classId) };
    }
    case 'wipeAll': {
      return { ...INITIAL_STATE };
    }
    case 'addProject': {
      return { ...state, projects: [action.project, ...(state.projects || [])] };
    }
    case 'addArea': {
      return { ...state, areas: [action.area, ...(state.areas || [])] };
    }
    case 'deleteArea': {
      return { ...state, areas: (state.areas || []).filter(a => a.id !== action.id) };
    }
    case 'addResource': {
      return { ...state, resources: [action.resource, ...(state.resources || [])] };
    }
    case 'deleteResource': {
      return { ...state, resources: (state.resources || []).filter(r => r.id !== action.id) };
    }
    case 'addArchive': {
      return { ...state, archives: [action.archive, ...(state.archives || [])] };
    }
    case 'addHabit': {
      return { ...state, habits: [...state.habits, action.habit] };
    }
    case 'updateHabit': {
      return { ...state, habits: state.habits.map(h => h.id === action.id ? { ...h, ...action.patch } : h) };
    }
    case 'deleteHabit': {
      return { ...state, habits: state.habits.filter(h => h.id !== action.id) };
    }
    case 'deleteProject': {
      return { ...state, projects: (state.projects || []).filter(p => p.id !== action.id) };
    }
    case 'toggleExercise': {
      const workouts = state.workouts.map(w => {
        if (w.id !== action.wId) return w;
        return {
          ...w,
          exercises: w.exercises.map((ex, i) => i === action.idx ? { ...ex, done: !ex.done } : ex),
        };
      });
      // grant XP to forca if done
      const workout = state.workouts.find(w => w.id === action.wId);
      const ex = workout.exercises[action.idx];
      const delta = ex.done ? -8 : 8;
      const attr = workout.kind === 'cardio' ? 'vitalidade' : workout.kind === 'mob' ? 'equilibrio' : 'forca';
      const attrXp = { ...state.attrXp, [attr]: Math.max(0, state.attrXp[attr] + delta) };
      const xpGainedToday = Math.max(0, state.xpGainedToday + delta);
      const toasts = delta > 0 ? [...state.toasts, { id: Date.now(), xp: delta, attr, name: EXERCISE_LIB.find(e => e.id === ex.exId)?.name || 'Exercício' }] : state.toasts;
      return { ...state, workouts, attrXp, xpGainedToday, toasts };
    }
    case 'updateExercise': {
      const workouts = state.workouts.map(w => {
        if (w.id !== action.wId) return w;
        return {
          ...w,
          exercises: w.exercises.map((ex, i) => i === action.idx ? { ...ex, [action.field]: action.value } : ex),
        };
      });
      return { ...state, workouts };
    }
    case 'addExercise': {
      const workouts = state.workouts.map(w => {
        if (w.id !== action.wId) return w;
        return {
          ...w,
          exercises: [...w.exercises, { exId: action.exId, sets: 3, reps: '10-12', load: '—', rest: 60, done: false }],
        };
      });
      return { ...state, workouts };
    }
    case 'removeExercise': {
      const workouts = state.workouts.map(w => {
        if (w.id !== action.wId) return w;
        return { ...w, exercises: w.exercises.filter((_, i) => i !== action.idx) };
      });
      return { ...state, workouts };
    }
    case 'updateFoodQty': {
      const meals = state.meals.map(m => {
        if (m.id !== action.mId) return m;
        return { ...m, items: m.items.map((it, i) => i === action.idx ? { ...it, qty: action.qty } : it) };
      });
      return { ...state, meals };
    }
    case 'removeFood': {
      const meals = state.meals.map(m => {
        if (m.id !== action.mId) return m;
        return { ...m, items: m.items.filter((_, i) => i !== action.idx) };
      });
      return { ...state, meals };
    }
    case 'addFood': {
      const meals = state.meals.map(m => {
        if (m.id !== action.mId) return m;
        const food = FOOD_LIB.find(f => f.id === action.foodId);
        return { ...m, items: [...m.items, { foodId: action.foodId, qty: food?.base || 100, note: '' }] };
      });
      return { ...state, meals };
    }
    case 'addWater': {
      return { ...state, waterToday: Math.max(0, Math.min(5000, state.waterToday + action.amount)) };
    }
    default:
      return state;
  }
}

// ── TWEAKS (persisted) ─────────────────────────────────────────
const TWEAKS_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "paper",
  "chartStyle": "area",
  "showMobile": true,
  "accentName": "tan"
}/*EDITMODE-END*/;

const ACCENT_PRESETS = {
  tan:    { light: '#8B6F47', dark: '#C9A56B' },
  sage:   { light: '#5E7A4A', dark: '#A8C48E' },
  indigo: { light: '#4A5788', dark: '#8EA4D4' },
  plum:   { light: '#6B5B8A', dark: '#B4A2D0' },
  ember:  { light: '#A85A3C', dark: '#DE9A7B' },
};

function App() {
  const [user, setUser] = React.useState(() => loadUser());
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE, (init) => {
    const saved = loadSaved(STORAGE_KEY);
    if (!saved) return init;
    // merge saved over initial so new fields (from seed updates) don't break
    return { ...init, ...saved, toasts: [] };
  });
  const [screen, setScreen] = React.useState(() => localStorage.getItem('evoquest:screen') || 'home');
  const [tweaks, setTweaks] = React.useState(() => ({ ...TWEAKS_DEFAULTS, ...(loadSaved(TWEAKS_KEY) || {}) }));
  const [tweaksOpen, setTweaksOpen] = React.useState(false);

  // Persist state (debounced via rAF)
  React.useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const { toasts, ...persistable } = state;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
      } catch {}
    });
    return () => cancelAnimationFrame(id);
  }, [state]);

  // Persist screen
  React.useEffect(() => { try { localStorage.setItem('evoquest:screen', screen); } catch {} }, [screen]);

  // Persist tweaks
  React.useEffect(() => {
    try { localStorage.setItem(TWEAKS_KEY, JSON.stringify(tweaks)); } catch {}
  }, [tweaks]);

  // Tweaks protocol
  React.useEffect(() => {
    function handler(e) {
      if (e.data?.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    }
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const updateTweak = (key, val) => {
    const next = { ...tweaks, [key]: val };
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: val } }, '*');
  };

  // Apply theme
  React.useEffect(() => {
    document.documentElement.dataset.theme = tweaks.theme === 'paper' ? '' : tweaks.theme;
    const accent = ACCENT_PRESETS[tweaks.accentName] || ACCENT_PRESETS.tan;
    document.documentElement.style.setProperty('--accent', tweaks.theme === 'ink' ? accent.dark : accent.light);
  }, [tweaks.theme, tweaks.accentName]);

  // Auto-dismiss toasts
  React.useEffect(() => {
    if (state.toasts.length === 0) return;
    const id = state.toasts[state.toasts.length - 1].id;
    const t = setTimeout(() => dispatch({ type: 'dismissToast', id }), 2400);
    return () => clearTimeout(t);
  }, [state.toasts]);

  function handleLogin(u) {
    // fresh character — seed attrs from class and clear any stale state
    dispatch({ type: 'initCharacter', classId: u.classId });
    setUser(u);
    setScreen('home');
  }

  function handleLogout() {
    if (!confirm('Sair e voltar à tela de login? Seus dados continuam salvos.')) return;
    clearUser();
    setUser(null);
  }

  // Gate: show login until a user exists
  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar screen={screen} setScreen={setScreen} state={state} user={user} onLogout={handleLogout} />

      <main style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        <div className="slide-in" key={screen}>
          {screen === 'home' && <DashboardScreen state={state} dispatch={dispatch} setScreen={setScreen} user={user} />}
          {screen === 'daily' && <DailyScreen state={state} dispatch={dispatch} />}
          {screen === 'weekly' && <WeeklyScreen state={state} dispatch={dispatch} />}
          {screen === 'monthly' && <MonthlyScreen state={state} dispatch={dispatch} />}
          {screen === 'habits' && <HabitsScreen state={state} dispatch={dispatch} />}
          {screen === 'goals' && <GoalsScreen state={state} />}
          {screen === 'projects' && <ParaScreen state={state} dispatch={dispatch} para="projects" />}
          {screen === 'areas' && <ParaScreen state={state} dispatch={dispatch} para="areas" />}
          {screen === 'resources' && <ParaScreen state={state} dispatch={dispatch} para="resources" />}
          {screen === 'archives' && <ParaScreen state={state} dispatch={dispatch} para="archives" />}
          {screen === 'character' && <CharacterScreen state={state} />}
          {screen === 'charts' && <ChartsScreen state={state} tweaks={tweaks} />}
          {screen === 'profile' && <ProfileScreen state={state} />}
          {screen === 'workout' && <WorkoutScreen state={state} dispatch={dispatch} />}
          {screen === 'diet' && <DietScreen state={state} dispatch={dispatch} />}
          {screen === 'mobile' && (
            <div style={{ padding: 48, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100%' }}>
              <MobileApp state={state} dispatch={dispatch} tweaks={tweaks} />
            </div>
          )}
        </div>
      </main>

      {/* XP toasts */}
      <div style={{ position: 'fixed', top: 20, right: 20, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 200, pointerEvents: 'none' }}>
        {state.toasts.slice(-3).map(t => {
          const attr = ATTRIBUTES.find(a => a.id === t.attr);
          return (
            <div key={t.id} className="slide-in" style={{
              background: 'var(--ink)', color: 'var(--bg)',
              padding: '10px 14px', borderRadius: 10,
              display: 'flex', alignItems: 'center', gap: 10, minWidth: 240,
              boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: attr.hue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                {attr.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, opacity: 0.7 }}>{t.name}</div>
                <div className="mono" style={{ fontSize: 14, fontWeight: 600 }}>+{t.xp} XP · {attr.name}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tweaks panel */}
      {tweaksOpen && (
        <div style={{
          position: 'fixed', bottom: 20, right: 20, width: 280, zIndex: 300,
          background: 'var(--surface)', border: '1px solid var(--line)',
          borderRadius: 14, padding: 16,
          boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="serif" style={{ fontSize: 18 }}>Tweaks</div>
            <button className="btn ghost" onClick={() => setTweaksOpen(false)} style={{ padding: 4 }}>✕</button>
          </div>

          <TweakGroup label="Tema">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {['paper', 'ink', 'forest', 'dusk'].map(t => (
                <button key={t} onClick={() => updateTweak('theme', t)} style={{
                  padding: '6px 4px', borderRadius: 6, fontSize: 11, fontWeight: 500,
                  border: `1px solid ${tweaks.theme === t ? 'var(--accent)' : 'var(--line)'}`,
                  background: tweaks.theme === t ? 'color-mix(in oklch, var(--accent) 12%, var(--surface))' : 'var(--surface)',
                  color: 'var(--ink)',
                  textTransform: 'capitalize',
                }}>{t}</button>
              ))}
            </div>
          </TweakGroup>

          <TweakGroup label="Cor de destaque">
            <div style={{ display: 'flex', gap: 6 }}>
              {Object.entries(ACCENT_PRESETS).map(([name, colors]) => (
                <button key={name} onClick={() => updateTweak('accentName', name)} style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: tweaks.theme === 'ink' ? colors.dark : colors.light,
                  border: tweaks.accentName === name ? '3px solid var(--ink)' : '1px solid var(--line)',
                  cursor: 'pointer',
                }} title={name} />
              ))}
            </div>
          </TweakGroup>

          <TweakGroup label="Estilo de gráfico">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {['line', 'area', 'bars'].map(s => (
                <button key={s} onClick={() => updateTweak('chartStyle', s)} style={{
                  padding: '6px 4px', borderRadius: 6, fontSize: 11, fontWeight: 500,
                  border: `1px solid ${tweaks.chartStyle === s ? 'var(--accent)' : 'var(--line)'}`,
                  background: tweaks.chartStyle === s ? 'color-mix(in oklch, var(--accent) 12%, var(--surface))' : 'var(--surface)',
                  color: 'var(--ink)',
                  textTransform: 'capitalize',
                }}>{s}</button>
              ))}
            </div>
          </TweakGroup>
        </div>
      )}
    </div>
  );
}

function TweakGroup({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

function Sidebar({ screen, setScreen, state, user, onLogout }) {
  const { attrXp } = state;
  const totalXp = Object.values(attrXp).reduce((a, b) => a + b, 0);
  const heroLevel = deriveLevel(totalXp);
  const userCls = (window.CLASSES || []).find(c => c.id === user?.classId);
  const displayName = user?.name || 'Aventureiro';
  const avatarGlyph = user?.avatar?.glyph || '◆';
  const avatarColor = user?.avatar?.color || 'var(--accent)';

  const items = [
    { label: 'Dashboard', id: 'home', icon: 'home' },
    { section: 'Agenda' },
    { label: 'Diária', id: 'daily', icon: 'cal' },
    { label: 'Semanal', id: 'weekly', icon: 'week' },
    { label: 'Mensal', id: 'monthly', icon: 'month' },
    { section: 'Sistema PARA' },
    { label: 'Projects', id: 'projects', icon: 'target', letter: 'P' },
    { label: 'Areas', id: 'areas', icon: 'folder', letter: 'A' },
    { label: 'Resources', id: 'resources', icon: 'folder', letter: 'R' },
    { label: 'Archives', id: 'archives', icon: 'archive', letter: 'A' },
    { section: 'Hábitos & Quests' },
    { label: 'Hábitos', id: 'habits', icon: 'habit' },
    { label: 'Quests', id: 'goals', icon: 'trophy' },
    { section: 'Corpo' },
    { label: 'Treino', id: 'workout', icon: 'dumbbell' },
    { label: 'Dieta', id: 'diet', icon: 'apple' },
    { section: 'RPG' },
    { label: 'Character Sheet', id: 'character', icon: 'char' },
    { label: 'Gráficos de evolução', id: 'charts', icon: 'chart' },
    { label: 'Perfil', id: 'profile', icon: 'user' },
    { section: 'Demo' },
    { label: 'Versão Mobile', id: 'mobile', icon: 'zap' },
  ];

  return (
    <aside style={{
      width: 240, flexShrink: 0, background: 'var(--bg-2)',
      borderRight: '1px solid var(--line)', padding: '16px 12px',
      display: 'flex', flexDirection: 'column', overflow: 'auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px 14px', borderBottom: '1px solid var(--line)' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: avatarColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 18,
        }}>{avatarGlyph}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="serif" style={{ fontSize: 16, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</div>
          <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            EvoQuest{userCls ? ` · ${userCls.name}` : ''}
          </div>
        </div>
      </div>

      {/* mini hero */}
      <div style={{ padding: '12px 10px 10px', borderBottom: '1px solid var(--line)', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LevelBadge level={heroLevel.level} size={32} hue="var(--accent)" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500 }}>Nível {heroLevel.level}</div>
            <div className="xp-bar" style={{ height: 4, marginTop: 3 }}>
              <div className="fill" style={{ width: `${heroLevel.progress * 100}%`, '--hue': 'var(--accent)' }} />
            </div>
            <div className="mono" style={{ fontSize: 9, color: 'var(--ink-3)', marginTop: 2 }}>
              +{state.xpGainedToday} XP hoje
            </div>
          </div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
        {items.map((it, i) => {
          if (it.section) return <div key={i} className="sidebar-section-label">{it.section}</div>;
          return (
            <div key={it.id} className={`sidebar-item ${screen === it.id ? 'active' : ''}`} onClick={() => setScreen(it.id)}>
              {it.letter ? (
                <span className="serif" style={{ width: 14, fontSize: 14, color: 'var(--ink-3)' }}>{it.letter}</span>
              ) : <Icon name={it.icon} size={14} />}
              <span>{it.label}</span>
            </div>
          );
        })}
      </nav>

      <div style={{ padding: '10px 10px 4px', borderTop: '1px solid var(--line)', marginTop: 8 }}>
        <button onClick={onLogout} className="btn ghost" style={{
          width: '100%', justifyContent: 'flex-start', gap: 8,
          fontSize: 12, color: 'var(--ink-3)', padding: '6px 8px',
        }}>
          <Icon name="logout" size={12} /> Sair
        </button>
        <div style={{ fontSize: 10, color: 'var(--ink-4)', marginTop: 6, padding: '0 4px' }}>
          Dica: ative <span style={{ color: 'var(--ink-3)' }}>Tweaks</span> para mudar tema
        </div>
      </div>
    </aside>
  );
}

// Mount
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
