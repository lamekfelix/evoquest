// screens-diet.jsx — Diet builder with macros, meals, water

function DietScreen({ state, dispatch }) {
  const [selectedMId, setSelectedMId] = React.useState(state.meals[0].id);
  const [showFoodLib, setShowFoodLib] = React.useState(false);
  const [libCat, setLibCat] = React.useState('all');
  const [libQuery, setLibQuery] = React.useState('');

  const meal = state.meals.find(m => m.id === selectedMId);

  // Daily totals
  const dayTotals = state.meals.reduce((acc, m) => {
    const t = mealTotals(m);
    acc.kcal += t.kcal; acc.p += t.p; acc.c += t.c; acc.f += t.f;
    return acc;
  }, { kcal: 0, p: 0, c: 0, f: 0 });

  const mealT = mealTotals(meal);

  const catLabel = { proteina: 'Proteínas', carbo: 'Carboidratos', gordura: 'Gorduras', veg: 'Vegetais' };
  const catColor = {
    proteina: 'var(--resiliencia)',
    carbo:    'var(--foco)',
    gordura:  'var(--sabedoria)',
    veg:      'var(--equilibrio)',
  };

  return (
    <div style={{ padding: '28px 40px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Hero */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, gap: 24, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 280 }}>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
            Dieta · Cutting 2026
          </div>
          <div className="serif" style={{ fontSize: 40, lineHeight: 1.1, marginTop: 4 }}>
            Plano alimentar
          </div>
          <div style={{ color: 'var(--ink-3)', marginTop: 6, fontSize: 14 }}>
            Meta: <span className="mono">{DIET_GOALS.kcal}</span> kcal · {state.meals.length} refeições · {DIET_GOALS.p}g P / {DIET_GOALS.c}g C / {DIET_GOALS.f}g G
          </div>
        </div>

        {/* Day macro summary */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
          <MacroRing
            label="Calorias"
            value={dayTotals.kcal}
            goal={DIET_GOALS.kcal}
            unit="kcal"
            hue="var(--accent)"
            size={88}
          />
          <MacroStack
            totals={dayTotals}
            goals={DIET_GOALS}
            catColor={catColor}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 320px', gap: 20 }}>
        {/* Left: meals list */}
        <div className="card" style={{ padding: 16, alignSelf: 'start' }}>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 12 }}>
            Refeições do dia
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {state.meals.map(m => {
              const t = mealTotals(m);
              const isSel = m.id === selectedMId;
              const pctOfDay = dayTotals.kcal ? (t.kcal / dayTotals.kcal) * 100 : 0;
              return (
                <div key={m.id}
                  onClick={() => setSelectedMId(m.id)}
                  style={{
                    padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                    background: isSel ? 'var(--surface-2)' : 'transparent',
                    borderLeft: `3px solid ${isSel ? 'var(--accent)' : 'transparent'}`,
                    transition: 'background 0.12s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>{m.name}</div>
                    <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{m.time}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                      {m.items.length} itens · <span className="mono">{t.kcal}</span> kcal
                    </div>
                  </div>
                  <div className="xp-bar" style={{ height: 3, marginTop: 6 }}>
                    <div className="fill" style={{ width: `${pctOfDay}%`, '--hue': 'var(--accent)' }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
            <button className="btn" style={{ width: '100%', justifyContent: 'center', fontSize: 12 }}>
              <Icon name="plus" size={12} /> Adicionar refeição
            </button>
          </div>

          {/* Water tracker */}
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>
                Água
              </div>
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                {state.waterToday}/{DIET_GOALS.water}ml
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 4, marginBottom: 10 }}>
              {Array.from({ length: 8 }).map((_, i) => {
                const filled = state.waterToday >= (i + 1) * 375;
                return (
                  <div key={i}
                    onClick={() => dispatch({ type: 'addWater', amount: filled ? -375 : 375 })}
                    style={{
                      height: 24, borderRadius: 4,
                      background: filled ? 'var(--foco)' : 'var(--surface-2)',
                      border: '1px solid var(--line)',
                      cursor: 'pointer', transition: 'background 0.15s',
                    }}
                  />
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="btn" style={{ flex: 1, fontSize: 11, padding: '4px 8px', justifyContent: 'center' }} onClick={() => dispatch({ type: 'addWater', amount: 250 })}>+250ml</button>
              <button className="btn" style={{ flex: 1, fontSize: 11, padding: '4px 8px', justifyContent: 'center' }} onClick={() => dispatch({ type: 'addWater', amount: 500 })}>+500ml</button>
            </div>
          </div>
        </div>

        {/* Center: meal detail */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: 'var(--accent)', color: 'var(--bg)', fontWeight: 600, letterSpacing: '0.04em' }}>
                  {meal.time}
                </span>
              </div>
              <div className="serif" style={{ fontSize: 26, lineHeight: 1.2 }}>{meal.name}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 6 }}>
                {meal.items.length} itens · <span className="mono">{mealT.kcal}</span> kcal
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <MacroPill label="P" value={mealT.p.toFixed(0)} color={catColor.proteina} />
              <MacroPill label="C" value={mealT.c.toFixed(0)} color={catColor.carbo} />
              <MacroPill label="G" value={mealT.f.toFixed(0)} color={catColor.gordura} />
            </div>
          </div>

          {/* Food items */}
          <div style={{ border: '1px solid var(--line)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 110px 60px 60px 60px 60px 28px', padding: '10px 14px', background: 'var(--surface-2)', fontSize: 10, color: 'var(--ink-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <div>Alimento</div>
              <div style={{ textAlign: 'center' }}>Qtd</div>
              <div style={{ textAlign: 'right' }}>Kcal</div>
              <div style={{ textAlign: 'right' }}>P</div>
              <div style={{ textAlign: 'right' }}>C</div>
              <div style={{ textAlign: 'right' }}>G</div>
              <div></div>
            </div>
            {meal.items.map((item, idx) => {
              const food = FOOD_LIB.find(f => f.id === item.foodId);
              const m = foodMacros(item.foodId, item.qty);
              return (
                <div key={idx} style={{
                  display: 'grid', gridTemplateColumns: '2.5fr 110px 60px 60px 60px 60px 28px',
                  padding: '10px 14px', alignItems: 'center',
                  borderTop: idx > 0 ? '1px solid var(--line)' : 'none',
                }}>
                  <div>
                    <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{food?.name}</div>
                    <div style={{ fontSize: 11, color: catColor[food?.cat], marginTop: 2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      ● {catLabel[food?.cat]}
                      {item.note && <span style={{ color: 'var(--ink-3)', fontWeight: 400, marginLeft: 6, textTransform: 'none', letterSpacing: 0 }}>· {item.note}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                    <QtyInput
                      value={item.qty}
                      unit={food?.unit}
                      onChange={(v) => dispatch({ type: 'updateFoodQty', mId: meal.id, idx, qty: v })}
                    />
                  </div>
                  <div className="mono" style={{ textAlign: 'right', fontSize: 13, color: 'var(--ink)' }}>{m.kcal}</div>
                  <div className="mono" style={{ textAlign: 'right', fontSize: 12, color: 'var(--ink-3)' }}>{m.p.toFixed(0)}</div>
                  <div className="mono" style={{ textAlign: 'right', fontSize: 12, color: 'var(--ink-3)' }}>{m.c.toFixed(0)}</div>
                  <div className="mono" style={{ textAlign: 'right', fontSize: 12, color: 'var(--ink-3)' }}>{m.f.toFixed(0)}</div>
                  <button
                    onClick={() => dispatch({ type: 'removeFood', mId: meal.id, idx })}
                    style={{ background: 'none', border: 'none', color: 'var(--ink-4)', cursor: 'pointer', padding: 4, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-2)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--ink-4)'}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              );
            })}
            {/* totals row */}
            <div style={{
              display: 'grid', gridTemplateColumns: '2.5fr 110px 60px 60px 60px 60px 28px',
              padding: '10px 14px', alignItems: 'center',
              borderTop: '1px solid var(--line)',
              background: 'var(--surface-2)',
            }}>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total</div>
              <div></div>
              <div className="mono" style={{ textAlign: 'right', fontSize: 14, color: 'var(--ink)', fontWeight: 600 }}>{mealT.kcal}</div>
              <div className="mono" style={{ textAlign: 'right', fontSize: 13, color: catColor.proteina, fontWeight: 600 }}>{mealT.p.toFixed(0)}</div>
              <div className="mono" style={{ textAlign: 'right', fontSize: 13, color: catColor.carbo, fontWeight: 600 }}>{mealT.c.toFixed(0)}</div>
              <div className="mono" style={{ textAlign: 'right', fontSize: 13, color: catColor.gordura, fontWeight: 600 }}>{mealT.f.toFixed(0)}</div>
              <div></div>
            </div>
          </div>

          <button
            onClick={() => setShowFoodLib(true)}
            className="btn"
            style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}
          >
            <Icon name="plus" size={12} /> Adicionar alimento
          </button>
        </div>

        {/* Right: day summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignSelf: 'start' }}>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 14 }}>
              Metas do dia
            </div>
            <MacroGoal label="Calorias" value={dayTotals.kcal} goal={DIET_GOALS.kcal} unit="kcal" hue="var(--accent)" />
            <MacroGoal label="Proteína" value={Math.round(dayTotals.p)} goal={DIET_GOALS.p} unit="g" hue={catColor.proteina} />
            <MacroGoal label="Carboidrato" value={Math.round(dayTotals.c)} goal={DIET_GOALS.c} unit="g" hue={catColor.carbo} />
            <MacroGoal label="Gordura" value={Math.round(dayTotals.f)} goal={DIET_GOALS.f} unit="g" hue={catColor.gordura} />
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 14 }}>
              Distribuição por refeição
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {state.meals.map(m => {
                const t = mealTotals(m);
                const pct = dayTotals.kcal ? t.kcal / dayTotals.kcal : 0;
                return (
                  <div key={m.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: 'var(--ink-2)' }}>{m.name}</span>
                      <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 11 }}>{t.kcal} kcal · {Math.round(pct * 100)}%</span>
                    </div>
                    <div className="xp-bar" style={{ height: 4 }}>
                      <div className="fill" style={{ width: `${pct * 100}%`, '--hue': 'var(--accent)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 12 }}>
              Balanço calórico
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--ink-2)' }}>Meta</span>
                <span className="mono" style={{ color: 'var(--ink)' }}>{DIET_GOALS.kcal} kcal</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--ink-2)' }}>Consumido</span>
                <span className="mono" style={{ color: 'var(--ink)' }}>{dayTotals.kcal} kcal</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--line)' }}>
                <span style={{ color: 'var(--ink-2)', fontWeight: 500 }}>Restante</span>
                <span className="mono" style={{ color: (DIET_GOALS.kcal - dayTotals.kcal) >= 0 ? 'var(--good)' : 'var(--accent-2)', fontWeight: 600 }}>
                  {DIET_GOALS.kcal - dayTotals.kcal} kcal
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showFoodLib && (
        <FoodLibraryModal
          onClose={() => setShowFoodLib(false)}
          onAdd={(foodId) => dispatch({ type: 'addFood', mId: meal.id, foodId })}
          libCat={libCat}
          setLibCat={setLibCat}
          libQuery={libQuery}
          setLibQuery={setLibQuery}
          catLabel={catLabel}
          catColor={catColor}
        />
      )}
    </div>
  );
}

function QtyInput({ value, unit, onChange }) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  React.useEffect(() => { setDraft(value); }, [value]);

  if (editing) {
    return (
      <input
        autoFocus
        type="number"
        value={draft}
        onChange={(e) => setDraft(parseFloat(e.target.value) || 0)}
        onBlur={() => { onChange(draft); setEditing(false); }}
        onKeyDown={(e) => { if (e.key === 'Enter') { onChange(draft); setEditing(false); } }}
        className="mono"
        style={{
          width: 90, padding: '4px 6px', border: '1px solid var(--accent)',
          borderRadius: 4, fontSize: 12, textAlign: 'center',
          background: 'var(--bg)', color: 'var(--ink)',
        }}
      />
    );
  }
  return (
    <div
      onClick={() => setEditing(true)}
      className="mono"
      style={{
        fontSize: 12, color: 'var(--ink)', cursor: 'text', padding: '4px 8px',
        borderRadius: 4, transition: 'background 0.12s', whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      {value} {unit}
    </div>
  );
}

function MacroRing({ label, value, goal, unit, hue, size = 80 }) {
  const pct = Math.min(1, value / goal);
  const r = size / 2 - 6;
  const circ = 2 * Math.PI * r;
  return (
    <div className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--line)" strokeWidth="5" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={hue} strokeWidth="5" fill="none"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.4s' }}
        />
      </svg>
      <div>
        <div style={{ fontSize: 10, color: 'var(--ink-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
        <div className="serif" style={{ fontSize: 26, lineHeight: 1, marginTop: 4 }}>{value}</div>
        <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 3 }}>
          de <span className="mono">{goal}</span> {unit}
        </div>
      </div>
    </div>
  );
}

function MacroStack({ totals, goals, catColor }) {
  const macros = [
    { id: 'p', label: 'Proteína', value: totals.p, goal: goals.p, hue: catColor.proteina },
    { id: 'c', label: 'Carbo',    value: totals.c, goal: goals.c, hue: catColor.carbo },
    { id: 'f', label: 'Gordura',  value: totals.f, goal: goals.f, hue: catColor.gordura },
  ];
  return (
    <div className="card" style={{ padding: '12px 16px', minWidth: 240 }}>
      <div style={{ fontSize: 10, color: 'var(--ink-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
        Macros do dia
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {macros.map(m => {
          const pct = Math.min(1, m.value / m.goal);
          return (
            <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 60px', gap: 8, alignItems: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--ink-2)' }}>{m.label}</div>
              <div className="xp-bar" style={{ height: 6 }}>
                <div className="fill" style={{ width: `${pct * 100}%`, '--hue': m.hue }} />
              </div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', textAlign: 'right' }}>
                {Math.round(m.value)}/{m.goal}g
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MacroPill({ label, value, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 50 }}>
      <div className="serif" style={{ fontSize: 22, lineHeight: 1, color }}>{value}</div>
      <div style={{ fontSize: 10, color: 'var(--ink-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>
        {label}g
      </div>
    </div>
  );
}

function MacroGoal({ label, value, goal, unit, hue }) {
  const pct = Math.min(1.2, value / goal);
  const over = pct > 1;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, alignItems: 'baseline' }}>
        <span style={{ fontSize: 12, color: 'var(--ink-2)', fontWeight: 500 }}>{label}</span>
        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>
          <span style={{ color: over ? 'var(--accent-2)' : 'var(--ink)', fontWeight: 600 }}>{value}</span>
          /{goal} {unit}
        </span>
      </div>
      <div className="xp-bar" style={{ height: 6 }}>
        <div className="fill" style={{
          width: `${Math.min(100, pct * 100)}%`,
          '--hue': over ? 'var(--accent-2)' : hue,
        }} />
      </div>
    </div>
  );
}

function FoodLibraryModal({ onClose, onAdd, libCat, setLibCat, libQuery, setLibQuery, catLabel, catColor }) {
  const filtered = FOOD_LIB.filter(f => {
    if (libCat !== 'all' && f.cat !== libCat) return false;
    if (libQuery && !f.name.toLowerCase().includes(libQuery.toLowerCase())) return false;
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
          <div className="serif" style={{ fontSize: 22, marginBottom: 10 }}>Biblioteca de alimentos</div>
          <input
            value={libQuery}
            onChange={(e) => setLibQuery(e.target.value)}
            placeholder="Buscar alimento..."
            style={{
              width: '100%', padding: '8px 12px', border: '1px solid var(--line)',
              borderRadius: 6, fontSize: 13, background: 'var(--bg)', color: 'var(--ink)',
              fontFamily: 'var(--font-sans)', outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, padding: '12px 22px', borderBottom: '1px solid var(--line)', flexWrap: 'wrap' }}>
          {['all', 'proteina', 'carbo', 'gordura', 'veg'].map(c => {
            const isSel = libCat === c;
            const color = c === 'all' ? 'var(--accent)' : catColor[c];
            return (
              <button
                key={c}
                onClick={() => setLibCat(c)}
                style={{
                  padding: '4px 10px', borderRadius: 20, fontSize: 11,
                  border: `1px solid ${isSel ? color : 'var(--line)'}`,
                  background: isSel ? color : 'transparent',
                  color: isSel ? 'var(--bg)' : 'var(--ink-2)',
                  cursor: 'pointer', fontWeight: 500,
                }}
              >
                {c === 'all' ? 'Todos' : catLabel[c]}
              </button>
            );
          })}
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '8px 0' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>Nenhum alimento encontrado</div>
          ) : filtered.map(f => (
            <div
              key={f.id}
              onClick={() => { onAdd(f.id); onClose(); }}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 80px 60px 60px 60px', gap: 12,
                alignItems: 'center', padding: '10px 22px', cursor: 'pointer', borderBottom: '1px solid var(--line)',
                transition: 'background 0.12s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div>
                <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{f.name}</div>
                <div style={{ fontSize: 10, marginTop: 2, color: catColor[f.cat], fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  ● {catLabel[f.cat]}
                </div>
              </div>
              <div className="mono" style={{ fontSize: 12, color: 'var(--ink-3)', textAlign: 'right' }}>
                {f.base}{f.unit}
              </div>
              <div className="mono" style={{ fontSize: 12, color: 'var(--ink)', textAlign: 'right' }}>
                {f.kcal}<span style={{ color: 'var(--ink-3)', fontSize: 10 }}>kcal</span>
              </div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', textAlign: 'right' }}>
                P{f.p.toFixed(0)} C{f.c.toFixed(0)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Icon name="plus" size={14} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '12px 22px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
