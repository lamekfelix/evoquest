// screens-dashboard.jsx — Home / Today view

const DASHBOARD_QUOTES = [
  { text: 'Você tem poder sobre sua mente — não sobre eventos externos. Perceba isso, e você encontrará força.', author: 'Marco Aurélio' },
  { text: 'A jornada de mil milhas começa com um único passo.', author: 'Lao-Tsé' },
  { text: 'Não é porque as coisas são difíceis que não ousamos; é porque não ousamos que elas são difíceis.', author: 'Sêneca' },
  { text: 'O obstáculo no caminho se torna o caminho.', author: 'Marco Aurélio' },
  { text: 'Somos aquilo que repetidamente fazemos. A excelência, portanto, não é um ato, mas um hábito.', author: 'Aristóteles' },
  { text: 'Conhece-te a ti mesmo.', author: 'Oráculo de Delfos' },
  { text: 'A disciplina é a ponte entre metas e conquistas.', author: 'Jim Rohn' },
  { text: 'O que não te mata, te fortalece.', author: 'Nietzsche' },
  { text: 'Enquanto esperamos pela vida, ela passa.', author: 'Sêneca' },
  { text: 'Tudo que temos que decidir é o que fazer com o tempo que nos é dado.', author: 'Gandalf' },
  { text: 'Não toda tempestade vem atrapalhar sua vida — algumas vêm abrir o caminho.', author: 'provérbio' },
  { text: 'Pequenas ações diárias superam grandes intenções ocasionais.', author: 'James Clear' },
  { text: 'A qualidade da sua vida é definida pela qualidade dos seus hábitos.', author: 'Brian Tracy' },
  { text: 'Quem vence a si mesmo é mais forte que aquele que vence mil batalhas.', author: 'Buda' },
  { text: 'Não busques que os acontecimentos sigam teus desejos. Que teus desejos sigam os acontecimentos.', author: 'Epicteto' },
  { text: 'Foco não é dizer sim para o que importa. É dizer não para quase tudo o mais.', author: 'Warren Buffett' },
  { text: 'Viver é a coisa mais rara no mundo. A maioria das pessoas apenas existe.', author: 'Oscar Wilde' },
  { text: 'Não há vento favorável para quem não sabe onde vai.', author: 'Sêneca' },
  { text: 'Aja como se o que você faz fizesse diferença. Faz.', author: 'William James' },
  { text: 'A cada manhã, quando abres os olhos, lembra-te: tens o privilégio de viver.', author: 'Marco Aurélio' },
  { text: 'A dor é inevitável. O sofrimento é opcional.', author: 'Haruki Murakami' },
  { text: 'Tudo o que você sempre quis está do outro lado do medo.', author: 'George Addair' },
  { text: 'Não corra mais rápido do que seu anjo da guarda consegue voar.', author: 'provérbio irlandês' },
  { text: 'A verdadeira viagem de descoberta não consiste em procurar novas paisagens, mas em ter novos olhos.', author: 'Marcel Proust' },
];

function DashboardScreen({ state, dispatch, setScreen, user }) {
  const { attrXp, habits, agenda, quests } = state;
  const totalXp = Object.values(attrXp).reduce((a, b) => a + b, 0);
  const heroLevel = deriveLevel(totalXp);

  const todayISO = dateISO(today);
  const todayAgenda = agenda.filter(t => t.date === todayISO).sort((a, b) => a.time.localeCompare(b.time));
  const doneTodayAgenda = todayAgenda.filter(t => t.done).length;

  const todayDayIdx = 3; // Wed (0=Mon..6=Sun for our week array) — fake day index
  const todayHabits = habits.filter(h => !(h.freq === 'weekday' && (todayDayIdx === 5 || todayDayIdx === 6)));
  const doneHabits = todayHabits.filter(h => h.done[todayDayIdx] === 1).length;

  const gainedToday = state.xpGainedToday;

  // Dynamic greeting based on local time
  const hour = new Date().getHours();
  const greeting = hour < 5 ? 'Boa madrugada'
                 : hour < 12 ? 'Bom dia'
                 : hour < 18 ? 'Boa tarde'
                 : 'Boa noite';
  const firstName = (user?.name || 'viajante').split(' ')[0];

  // Rotating motivational quote — index stable per day
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const quote = DASHBOARD_QUOTES[dayOfYear % DASHBOARD_QUOTES.length];

  return (
    <div style={{ padding: '28px 40px', maxWidth: 1280, margin: '0 auto' }}>
      {/* Hero */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, gap: 24, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 280 }}>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
            Sexta-feira · 17 de abril, 2026
          </div>
          <div className="serif" style={{ fontSize: 40, lineHeight: 1.1, marginTop: 4, color: 'var(--ink)' }}>
            {greeting}, {firstName}.
          </div>
          <div className="serif" style={{ fontSize: 15, marginTop: 10, color: 'var(--ink-2)', fontStyle: 'italic', lineHeight: 1.4, maxWidth: 440 }}>
            “{quote.text}”
            <span style={{ display: 'block', fontSize: 11, color: 'var(--ink-3)', marginTop: 4, fontStyle: 'normal', letterSpacing: '0.04em' }}>
              — {quote.author}
            </span>
          </div>
          <div style={{ color: 'var(--ink-3)', marginTop: 10, fontSize: 13 }}>
            {todayAgenda.length} compromissos · {todayHabits.length} hábitos · {quests.length} quests ativas
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="card" style={{ padding: '12px 18px', display: 'flex', gap: 14, alignItems: 'center' }}>
            <LevelBadge level={heroLevel.level} size={44} hue="var(--accent)" />
            <div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Aventureiro</div>
              <div className="serif" style={{ fontSize: 22, lineHeight: 1 }}>Nível {heroLevel.level}</div>
              <div style={{ width: 140, marginTop: 6 }}>
                <div className="xp-bar"><div className="fill" style={{ width: `${heroLevel.progress * 100}%`, '--hue': 'var(--accent)' }} /></div>
              </div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 3 }}>
                {heroLevel.xpInLevel} / {heroLevel.xpToNext} XP
              </div>
            </div>
          </div>
          <div className="card" style={{ padding: '12px 18px', minWidth: 120 }}>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>XP hoje</div>
            <div className="serif" style={{ fontSize: 28, lineHeight: 1, marginTop: 4, color: gainedToday > 0 ? 'var(--accent)' : 'var(--ink)' }}>
              +{gainedToday}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 6 }}>
              {gainedToday > 80 ? '🔥 Excelente ritmo' : gainedToday > 40 ? 'Bom progresso' : 'Começando o dia'}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 18 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Today agenda */}
          <div className="card" style={{ padding: 20 }}>
            <SectionHeader title="Agenda" right={<span className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>{doneTodayAgenda}/{todayAgenda.length}</span>} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 8 }}>
              {todayAgenda.length === 0 ? (
                <EmptyState
                  icon="cal"
                  title="Nenhum evento hoje"
                  hint="Crie tarefas na Agenda Diária."
                  action={{ label: 'Ir para Agenda →', onClick: () => setScreen('daily') }}
                />
              ) : todayAgenda.map(t => <AgendaRow key={t.id} task={t} state={state} dispatch={dispatch} />)}
            </div>
          </div>

          {/* Habits today */}
          <div className="card" style={{ padding: 20 }}>
            <SectionHeader title="Hábitos" right={
              <span className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>{doneHabits}/{todayHabits.length}</span>
            } />
            {todayHabits.length === 0 ? (
              <EmptyState
                icon="habit"
                title="Sem hábitos ainda"
                hint="Comece com 1 hábito diário — pequeno e consistente."
                action={{ label: 'Adicionar hábito →', onClick: () => setScreen('habits') }}
              />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
                {todayHabits.map(h => <HabitMiniCard key={h.id} habit={h} state={state} dispatch={dispatch} dayIdx={todayDayIdx} />)}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Attributes */}
          <div className="card" style={{ padding: 20 }}>
            <SectionHeader title="Atributos" right={
              <button className="btn ghost" onClick={() => setScreen('character')} style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                Ver tudo <Icon name="chev" size={12} />
              </button>
            } />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
              {ATTRIBUTES.map(a => {
                const lvl = deriveLevel(attrXp[a.id]);
                return (
                  <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '24px 1fr auto', gap: 10, alignItems: 'center' }}>
                    <LevelBadge level={lvl.level} size={24} hue={a.hue} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                        <span style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{a.name}</span>
                        <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 10 }}>{lvl.xpInLevel}/{lvl.xpToNext}</span>
                      </div>
                      <div className="xp-bar"><div className="fill" style={{ width: `${lvl.progress * 100}%`, '--hue': a.hue }} /></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Quests */}
          <div className="card" style={{ padding: 20 }}>
            <SectionHeader title="Quests" right={
              <span className="streak-badge" style={{ fontSize: 10 }}>{quests.length} ATIVAS</span>
            } />
            {quests.length === 0 ? (
              <EmptyState
                icon="trophy"
                title="Nenhuma quest ativa"
                hint="Quests são metas de longo prazo — ex: “ler 12 livros em 2026”."
                action={{ label: 'Criar quest →', onClick: () => setScreen('goals') }}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
                {quests.slice(0, 3).map(q => {
                  const attr = ATTRIBUTES.find(a => a.id === q.attr);
                  const pct = (q.progress / q.target) * 100;
                  return (
                    <div key={q.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4, gap: 8 }}>
                        <span style={{ color: 'var(--ink)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
                          <span style={{ color: attr.hue, marginRight: 6 }}>{attr.icon}</span>
                          {q.name}
                        </span>
                        <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 11, flexShrink: 0 }}>
                          {q.progress}/{q.target}
                        </span>
                      </div>
                      <div className="xp-bar"><div className="fill" style={{ width: `${pct}%`, '--hue': attr.hue }} /></div>
                      <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 3 }}>
                        Recompensa: <span className="mono" style={{ color: 'var(--accent)' }}>+{q.xp} XP</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, right }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
      <div className="serif" style={{ fontSize: 20, color: 'var(--ink)', lineHeight: 1.2 }}>{title}</div>
      <div style={{ flexShrink: 0 }}>{right}</div>
    </div>
  );
}

function AgendaRow({ task, state, dispatch }) {
  const area = (state.areas || []).find(a => a.id === task.area);
  const project = task.project ? (state.projects || []).find(p => p.id === task.project) : null;
  return (
    <div
      onClick={() => dispatch({ type: 'toggleAgenda', id: task.id })}
      style={{
        display: 'grid', gridTemplateColumns: '20px 68px 1fr auto', gap: 12,
        alignItems: 'center', padding: '10px 8px', borderRadius: 8,
        cursor: 'pointer', transition: 'background 0.12s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <Checkbox checked={task.done} onChange={() => dispatch({ type: 'toggleAgenda', id: task.id })} />
      <span className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>{task.time}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <span style={{
          color: task.done ? 'var(--ink-4)' : 'var(--ink)',
          textDecoration: task.done ? 'line-through' : 'none',
          fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{task.title}</span>
        {project && <span className="stat-pill" style={{ fontSize: 10, padding: '1px 6px' }}>{project.name.slice(0, 20)}</span>}
      </div>
      {area && <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: area.color }}>
        <span>{area.icon}</span>
      </div>}
    </div>
  );
}

function HabitMiniCard({ habit, state, dispatch, dayIdx }) {
  const attr = ATTRIBUTES.find(a => a.id === habit.attr);
  const done = habit.done[dayIdx] === 1;
  return (
    <div
      onClick={() => dispatch({ type: 'toggleHabit', id: habit.id, day: dayIdx })}
      style={{
        padding: '10px 12px', borderRadius: 10,
        border: `1px solid ${done ? 'transparent' : 'var(--line)'}`,
        background: done ? `color-mix(in oklch, ${attr.hue} 10%, var(--surface-2))` : 'var(--surface-2)',
        cursor: 'pointer', transition: 'all 0.15s',
        display: 'flex', alignItems: 'center', gap: 10,
      }}
    >
      <Checkbox checked={done} onChange={() => dispatch({ type: 'toggleHabit', id: habit.id, day: dayIdx })} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 500,
          color: done ? 'var(--ink-3)' : 'var(--ink)',
          textDecoration: done ? 'line-through' : 'none',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{habit.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <span style={{ fontSize: 10, color: attr.hue, fontWeight: 500 }}>{attr.icon} {attr.abbr}</span>
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>+{habit.xp}</span>
          <Streak n={habit.streak} />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DashboardScreen, SectionHeader, AgendaRow, HabitMiniCard });
