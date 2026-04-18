// screens-para.jsx — Projects/Areas/Resources/Archives

function ParaScreen({ state, dispatch, para }) {
  // para = 'projects' | 'areas' | 'resources' | 'archives'
  if (para === 'projects') return <ProjectsView state={state} dispatch={dispatch} />;
  if (para === 'areas') return <AreasView state={state} dispatch={dispatch} />;
  if (para === 'resources') return <ResourcesView state={state} dispatch={dispatch} />;
  if (para === 'archives') return <ArchivesView state={state} dispatch={dispatch} />;
  return null;
}

function ProjectsView({ state, dispatch }) {
  const [filter, setFilter] = React.useState('all');
  const [showNew, setShowNew] = React.useState(false);
  const projects = state.projects || [];
  const areas = state.areas || [];
  return (
    <div style={{ padding: '28px 40px', maxWidth: 1300, margin: '0 auto' }}>
      <ParaHeader label="P · Projects" title="Projetos ativos" subtitle="Iniciativas com prazo e resultado definido" />

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button className={`btn ${filter === 'all' ? 'primary' : ''}`} onClick={() => setFilter('all')} style={{ fontSize: 12 }}>Todos</button>
        {areas.map(area => (
          <button key={area.id} className={`btn ${filter === area.id ? 'primary' : ''}`} onClick={() => setFilter(area.id)} style={{ fontSize: 12 }}>
            <span style={{ color: filter === area.id ? 'var(--bg)' : area.color }}>{area.icon}</span> {area.name}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button className="btn primary" onClick={() => setShowNew(true)} disabled={areas.length === 0}
          style={{ opacity: areas.length === 0 ? 0.5 : 1, cursor: areas.length === 0 ? 'not-allowed' : 'pointer' }}>
          <Icon name="plus" size={14} /> Novo projeto
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="card" style={{ padding: 40 }}>
          <EmptyState
            icon="target"
            title={areas.length === 0 ? 'Crie uma Área primeiro' : 'Nenhum projeto ainda'}
            hint={areas.length === 0
              ? 'Projetos vivem dentro de Áreas de responsabilidade. Crie pelo menos uma Área (ex: Saúde, Carreira, Finanças) para começar.'
              : 'Projetos têm início, fim e um resultado concreto — ex: “lançar o MVP”, “correr uma prova de 10k”.'}
          />
        </div>
      ) : (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {projects.filter(p => filter === 'all' || p.area === filter).map(p => {
          const area = areas.find(a => a.id === p.area) || { color: 'var(--ink-3)', icon: '○', name: 'Sem área' };
          const daysLeft = Math.ceil((new Date(p.due) - today) / 86400000);
          return (
            <div key={p.id} className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: area.color, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <span>{area.icon}</span> {area.name}
                </div>
                <button className="btn ghost" style={{ padding: 2 }}><Icon name="dots" size={14} /></button>
              </div>
              <div className="serif" style={{ fontSize: 20, lineHeight: 1.25, color: 'var(--ink)', marginBottom: 12 }}>{p.name}</div>

              <div className="xp-bar" style={{ height: 6 }}>
                <div className="fill" style={{ width: `${p.progress * 100}%`, '--hue': area.color }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-3)', marginTop: 6 }}>
                <span className="mono">{p.done}/{p.tasks} tarefas</span>
                <span className="mono">{Math.round(p.progress * 100)}%</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: daysLeft < 30 ? 'var(--forca)' : 'var(--ink-3)' }}>
                  <Icon name="clock" size={12} />
                  <span className="mono">{daysLeft}d</span>
                </div>
                <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{new Date(p.due).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}</span>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {showNew && <NewProjectModal areas={areas} onClose={() => setShowNew(false)} onCreate={(proj) => {
        dispatch({ type: 'addProject', project: proj });
        setShowNew(false);
      }} />}
    </div>
  );
}

function NewProjectModal({ areas, onClose, onCreate }) {
  const [name, setName] = React.useState('');
  const [area, setArea] = React.useState(areas[0]?.id || 'a1');
  const [due, setDue] = React.useState(() => {
    const d = new Date(today); d.setMonth(d.getMonth() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [tasks, setTasks] = React.useState(10);
  const [description, setDescription] = React.useState('');
  const [priority, setPriority] = React.useState('medium');

  const canCreate = name.trim().length >= 2;

  function submit() {
    if (!canCreate) return;
    const proj = {
      id: 'p' + Date.now(),
      name: name.trim(),
      area,
      progress: 0,
      due,
      tasks: Number(tasks) || 1,
      done: 0,
      status: 'active',
      description: description.trim() || undefined,
      priority,
      createdAt: new Date().toISOString(),
    };
    onCreate(proj);
  }

  React.useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const selectedArea = areas.find(a => a.id === area) || areas[0] || { desc: '' };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 20,
      backdropFilter: 'blur(4px)',
      animation: 'fadeUp 0.2s ease',
    }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{
        width: '100%', maxWidth: 620, padding: 28, maxHeight: '90vh', overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--ink-3)', textTransform: 'uppercase', fontWeight: 500 }}>Sistema PARA · Project</div>
            <div className="serif" style={{ fontSize: 28, lineHeight: 1.1, marginTop: 4, color: 'var(--ink)' }}>Novo projeto</div>
          </div>
          <button className="btn ghost" onClick={onClose} style={{ padding: 4 }}>
            <Icon name="x" size={16} />
          </button>
        </div>

        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 8, lineHeight: 1.5 }}>
          Projetos têm <strong style={{ color: 'var(--ink-2)' }}>início, fim e um resultado concreto</strong>. São esforços finitos, sempre dentro de uma Área.
        </div>

        {/* Name */}
        <div style={{ marginTop: 20 }}>
          <label style={FIELD_LABEL}>Nome do projeto *</label>
          <input value={name} onChange={e => setName(e.target.value)} autoFocus
            placeholder="Ex: Lançar MVP, Aprender espanhol, Reformar cozinha…"
            style={FIELD_INPUT} />
        </div>

        {/* Area */}
        <div style={{ marginTop: 16 }}>
          <label style={FIELD_LABEL}>Área de responsabilidade</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 6, marginTop: 6 }}>
            {areas.map(a => (
              <button key={a.id} onClick={() => setArea(a.id)}
                className={area === a.id ? 'class-btn active' : 'class-btn'}
                style={{ textAlign: 'left', padding: '8px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: a.color, fontSize: 14 }}>{a.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{a.name}</span>
                </div>
              </button>
            ))}
          </div>
          {selectedArea.desc && <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 6 }}>{selectedArea.desc}</div>}
        </div>

        {/* Due date + tasks */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
          <div>
            <label style={FIELD_LABEL}>Prazo</label>
            <input type="date" value={due} onChange={e => setDue(e.target.value)} style={FIELD_INPUT} />
          </div>
          <div>
            <label style={FIELD_LABEL}>Tarefas estimadas</label>
            <input type="number" min="1" max="200" value={tasks} onChange={e => setTasks(e.target.value)} style={FIELD_INPUT} />
          </div>
        </div>

        {/* Priority */}
        <div style={{ marginTop: 16 }}>
          <label style={FIELD_LABEL}>Prioridade</label>
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            {[
              { id: 'low',    label: 'Baixa',  color: 'var(--ink-3)' },
              { id: 'medium', label: 'Média',  color: 'var(--sabedoria)' },
              { id: 'high',   label: 'Alta',   color: 'var(--forca)' },
            ].map(p => (
              <button key={p.id} onClick={() => setPriority(p.id)}
                className={priority === p.id ? 'class-btn active' : 'class-btn'}
                style={{ flex: 1, padding: '8px 10px', fontSize: 12, fontWeight: 500 }}>
                <span style={{ color: p.color, marginRight: 6 }}>●</span>{p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div style={{ marginTop: 16 }}>
          <label style={FIELD_LABEL}>Descrição / resultado esperado <span style={{ color: 'var(--ink-4)' }}>(opcional)</span></label>
          <textarea value={description} onChange={e => setDescription(e.target.value)}
            placeholder="Como é o 'pronto' desse projeto?"
            rows={3}
            style={{ ...FIELD_INPUT, resize: 'vertical', minHeight: 60, fontFamily: 'inherit' }} />
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 24, justifyContent: 'flex-end' }}>
          <button className="btn" onClick={onClose} style={{ fontSize: 13 }}>Cancelar</button>
          <button className="btn primary" onClick={submit} disabled={!canCreate} style={{
            fontSize: 13, padding: '10px 18px',
            opacity: canCreate ? 1 : 0.5, cursor: canCreate ? 'pointer' : 'not-allowed',
          }}>
            Criar projeto
          </button>
        </div>
      </div>
    </div>
  );
}

const FIELD_LABEL = { fontSize: 11, color: 'var(--ink-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 };
const FIELD_INPUT = {
  width: '100%', padding: '10px 12px',
  background: 'var(--surface)', border: '1px solid var(--line)',
  borderRadius: 8, color: 'var(--ink)', fontSize: 14,
  fontFamily: 'inherit', outline: 'none',
};

function AreasView({ state, dispatch }) {
  const [showNew, setShowNew] = React.useState(false);
  const areas = state.areas || [];
  const projects = state.projects || [];
  return (
    <div style={{ padding: '28px 40px', maxWidth: 1300, margin: '0 auto' }}>
      <ParaHeader label="A · Areas" title="Áreas de responsabilidade" subtitle="Domínios contínuos da sua vida" />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="btn primary" onClick={() => setShowNew(true)}><Icon name="plus" size={14} /> Nova área</button>
      </div>
      {areas.length === 0 ? (
        <div className="card" style={{ padding: 40 }}>
          <EmptyState
            icon="folder"
            title="Defina suas Áreas"
            hint="Áreas são domínios contínuos da sua vida — Saúde, Carreira, Finanças, Relacionamentos, etc. Não têm prazo, só padrão a manter."
            action={{ label: '+ Criar primeira área', onClick: () => setShowNew(true) }}
          />
        </div>
      ) : (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {areas.map(a => {
          const aProjects = projects.filter(p => p.area === a.id);
          const avgProgress = aProjects.length ? aProjects.reduce((s, p) => s + p.progress, 0) / aProjects.length : 0;
          return (
            <div key={a.id} className="card" style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle at top right, color-mix(in oklch, ${a.color} 20%, transparent), transparent 70%)` }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `color-mix(in oklch, ${a.color} 18%, var(--surface))`, color: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div className="serif" style={{ fontSize: 20, lineHeight: 1 }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{aProjects.length} projeto{aProjects.length !== 1 ? 's' : ''}</div>
                </div>
                <button className="btn ghost" style={{ padding: 2 }} onClick={() => {
                  if (confirm(`Excluir área "${a.name}"? Projetos dentro dela permanecerão, mas ficarão sem área.`)) {
                    dispatch({ type: 'deleteArea', id: a.id });
                  }
                }}><Icon name="x" size={14} /></button>
              </div>
              {a.desc && <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 12, lineHeight: 1.5 }}>{a.desc}</div>}
              {aProjects.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-3)', marginBottom: 4 }}>
                    <span>Saúde da área</span>
                    <span className="mono">{Math.round(avgProgress * 100)}%</span>
                  </div>
                  <div className="xp-bar"><div className="fill" style={{ width: `${avgProgress * 100}%`, '--hue': a.color }} /></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}
      {showNew && <NewAreaModal onClose={() => setShowNew(false)} onCreate={(area) => {
        dispatch({ type: 'addArea', area });
        setShowNew(false);
      }} />}
    </div>
  );
}

const AREA_COLORS = [
  { color: 'var(--forca)',       name: 'Vermelho' },
  { color: 'var(--inteligencia)',name: 'Azul' },
  { color: 'var(--sabedoria)',   name: 'Âmbar' },
  { color: 'var(--disciplina)',  name: 'Violeta' },
  { color: 'var(--foco)',        name: 'Esverdeado' },
  { color: 'var(--vitalidade)',  name: 'Verde' },
  { color: 'var(--resiliencia)', name: 'Laranja' },
  { color: 'var(--equilibrio)',  name: 'Turquesa' },
];
const AREA_ICONS = ['◆','◇','◈','◉','◎','◐','◑','◒','♥','✦','☽','⚔','⚙','⟡','✧','❖'];

function NewAreaModal({ onClose, onCreate }) {
  const [name, setName] = React.useState('');
  const [icon, setIcon] = React.useState(AREA_ICONS[0]);
  const [color, setColor] = React.useState(AREA_COLORS[0].color);
  const [desc, setDesc] = React.useState('');
  const canCreate = name.trim().length >= 2;

  React.useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function submit() {
    if (!canCreate) return;
    onCreate({
      id: 'a' + Date.now(),
      name: name.trim(),
      icon,
      color,
      desc: desc.trim(),
    });
  }

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 20, backdropFilter: 'blur(4px)', animation: 'fadeUp 0.2s ease',
    }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: '100%', maxWidth: 540, padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--ink-3)', textTransform: 'uppercase', fontWeight: 500 }}>Sistema PARA · Area</div>
        <div className="serif" style={{ fontSize: 26, lineHeight: 1.1, marginTop: 4, color: 'var(--ink)' }}>Nova área</div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 8, lineHeight: 1.5 }}>
          Domínios da vida que você mantém <strong style={{ color: 'var(--ink-2)' }}>continuamente</strong> — sem prazo final.
        </div>

        <div style={{ marginTop: 20 }}>
          <label style={FIELD_LABEL}>Nome *</label>
          <input autoFocus value={name} onChange={e => setName(e.target.value)}
            placeholder="Ex: Saúde, Carreira, Finanças, Família…" style={FIELD_INPUT} />
        </div>

        <div style={{ marginTop: 16 }}>
          <label style={FIELD_LABEL}>Ícone</label>
          <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
            {AREA_ICONS.map(i => (
              <button key={i} onClick={() => setIcon(i)}
                className={icon === i ? 'class-btn active' : 'class-btn'}
                style={{ width: 36, height: 36, padding: 0, fontSize: 16 }}>
                <span style={{ color }}>{i}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <label style={FIELD_LABEL}>Cor</label>
          <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
            {AREA_COLORS.map(c => (
              <button key={c.color} onClick={() => setColor(c.color)}
                className={color === c.color ? 'class-btn active' : 'class-btn'}
                title={c.name}
                style={{ width: 36, height: 36, padding: 0 }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: c.color, margin: 'auto' }} />
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <label style={FIELD_LABEL}>Descrição <span style={{ color: 'var(--ink-4)' }}>(opcional)</span></label>
          <input value={desc} onChange={e => setDesc(e.target.value)}
            placeholder="Qual padrão você quer manter?" style={FIELD_INPUT} />
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 24, justifyContent: 'flex-end' }}>
          <button className="btn" onClick={onClose} style={{ fontSize: 13 }}>Cancelar</button>
          <button className="btn primary" onClick={submit} disabled={!canCreate}
            style={{ fontSize: 13, padding: '10px 18px', opacity: canCreate ? 1 : 0.5, cursor: canCreate ? 'pointer' : 'not-allowed' }}>
            Criar área
          </button>
        </div>
      </div>
    </div>
  );
}

function ResourcesView({ state, dispatch }) {
  const [showNew, setShowNew] = React.useState(false);
  const resources = state.resources || [];
  return (
    <div style={{ padding: '28px 40px', maxWidth: 1100, margin: '0 auto' }}>
      <ParaHeader label="R · Resources" title="Recursos & Referências" subtitle="Tópicos de interesse contínuo" />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="btn primary" onClick={() => setShowNew(true)}><Icon name="plus" size={14} /> Novo recurso</button>
      </div>
      {resources.length === 0 ? (
        <div className="card" style={{ padding: 40 }}>
          <EmptyState
            icon="folder"
            title="Sem recursos ainda"
            hint="Recursos são tópicos de interesse contínuo — referências, artigos, notas. Ex: “Livros de Stoicismo”, “Receitas”."
            action={{ label: '+ Criar primeiro recurso', onClick: () => setShowNew(true) }}
          />
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {resources.map((r, i) => (
            <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '36px 1fr 100px 30px', alignItems: 'center', padding: '14px 20px', borderBottom: i < resources.length - 1 ? '1px solid var(--line)' : 'none' }}>
              <Icon name="folder" size={18} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{r.name}</div>
                {r.tag && <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{r.tag}</div>}
              </div>
              <div className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>{r.items || 0} itens</div>
              <button className="btn ghost" style={{ padding: 2 }} onClick={() => {
                if (confirm(`Excluir recurso "${r.name}"?`)) dispatch({ type: 'deleteResource', id: r.id });
              }}><Icon name="x" size={14} /></button>
            </div>
          ))}
        </div>
      )}
      {showNew && <SimpleNameModal
        title="Novo recurso" label="R · Resource"
        hint="Um tópico de interesse contínuo."
        placeholder="Ex: Livros de filosofia, Receitas, Notas de design…"
        extraField={{ label: 'Tag', placeholder: 'categoria / área (opcional)', optional: true }}
        onClose={() => setShowNew(false)}
        onCreate={({ name, extra }) => {
          dispatch({ type: 'addResource', resource: { id: 'r' + Date.now(), name, tag: extra, items: 0 } });
          setShowNew(false);
        }}
      />}
    </div>
  );
}

function ArchivesView({ state }) {
  const archives = state.archives || [];
  return (
    <div style={{ padding: '28px 40px', maxWidth: 1100, margin: '0 auto' }}>
      <ParaHeader label="A · Archives" title="Arquivos" subtitle="Completados, encerrados, preservados" />
      {archives.length === 0 ? (
        <div className="card" style={{ padding: 40 }}>
          <EmptyState
            icon="archive"
            title="Arquivo vazio"
            hint="Projetos e recursos encerrados aparecem aqui. Nada se perde — tudo fica preservado para referência futura."
          />
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {archives.map((r, i) => (
            <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '36px 1fr 120px 30px', alignItems: 'center', padding: '14px 20px', borderBottom: i < archives.length - 1 ? '1px solid var(--line)' : 'none', opacity: 0.75 }}>
              <Icon name="archive" size={18} />
              <div style={{ fontSize: 14, fontWeight: 500 }}>{r.name}</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{r.closed}</div>
              <Icon name="chev" size={14} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Reusable small modal for simple name + optional field
function SimpleNameModal({ title, label, hint, placeholder, extraField, onClose, onCreate }) {
  const [name, setName] = React.useState('');
  const [extra, setExtra] = React.useState('');
  const canCreate = name.trim().length >= 2;
  React.useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 20, backdropFilter: 'blur(4px)', animation: 'fadeUp 0.2s ease',
    }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: '100%', maxWidth: 480, padding: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--ink-3)', textTransform: 'uppercase', fontWeight: 500 }}>{label}</div>
        <div className="serif" style={{ fontSize: 26, lineHeight: 1.1, marginTop: 4 }}>{title}</div>
        {hint && <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 8, lineHeight: 1.5 }}>{hint}</div>}
        <div style={{ marginTop: 20 }}>
          <label style={FIELD_LABEL}>Nome *</label>
          <input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder={placeholder} style={FIELD_INPUT} />
        </div>
        {extraField && (
          <div style={{ marginTop: 16 }}>
            <label style={FIELD_LABEL}>{extraField.label} {extraField.optional && <span style={{ color: 'var(--ink-4)' }}>(opcional)</span>}</label>
            <input value={extra} onChange={e => setExtra(e.target.value)} placeholder={extraField.placeholder} style={FIELD_INPUT} />
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 24, justifyContent: 'flex-end' }}>
          <button className="btn" onClick={onClose} style={{ fontSize: 13 }}>Cancelar</button>
          <button className="btn primary" onClick={() => canCreate && onCreate({ name: name.trim(), extra: extra.trim() })}
            disabled={!canCreate} style={{ fontSize: 13, padding: '10px 18px', opacity: canCreate ? 1 : 0.5, cursor: canCreate ? 'pointer' : 'not-allowed' }}>
            Criar
          </button>
        </div>
      </div>
    </div>
  );
}

function ParaHeader({ label, title, subtitle }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 12, color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>{label}</div>
      <div className="serif" style={{ fontSize: 40, lineHeight: 1.1, marginTop: 4 }}>{title}</div>
      <div style={{ color: 'var(--ink-3)', marginTop: 6, fontSize: 14 }}>{subtitle}</div>
    </div>
  );
}

Object.assign(window, { ParaScreen, ProjectsView, AreasView, ResourcesView, ArchivesView, ParaHeader, NewProjectModal, NewAreaModal, SimpleNameModal, FIELD_LABEL, FIELD_INPUT });
