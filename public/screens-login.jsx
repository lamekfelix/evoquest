// screens-login.jsx — Local-first login / character creation

const LOGIN_KEY = 'evoquest:user:v1';

function loadUser() {
  try {
    const raw = localStorage.getItem(LOGIN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveUser(u) {
  try { localStorage.setItem(LOGIN_KEY, JSON.stringify(u)); } catch {}
}
function clearUser() {
  try { localStorage.removeItem(LOGIN_KEY); } catch {}
}

const CLASSES = [
  { id: 'sage',     name: 'Erudito',       desc: 'Foco em conhecimento e estudo',        icon: '◇', primary: 'inteligencia', secondary: 'sabedoria' },
  { id: 'warrior',  name: 'Guerreiro',     desc: 'Força física e resiliência',           icon: '◆', primary: 'forca',        secondary: 'vitalidade' },
  { id: 'monk',     name: 'Monge',         desc: 'Disciplina e equilíbrio mental',       icon: '◒', primary: 'equilibrio',   secondary: 'disciplina' },
  { id: 'ranger',   name: 'Explorador',    desc: 'Vitalidade, foco em aventuras',        icon: '◐', primary: 'vitalidade',   secondary: 'foco' },
  { id: 'artisan',  name: 'Artesão',       desc: 'Criador, foco em construir coisas',    icon: '◎', primary: 'foco',         secondary: 'forca' },
  { id: 'ascetic',  name: 'Asceta',        desc: 'Resiliência e auto-superação',         icon: '◑', primary: 'resiliencia',  secondary: 'disciplina' },
];

const AVATAR_GLYPHS = ['◆','◇','◈','◉','◎','◐','◑','◒','✦','✧','☽','☼','◯','△','▲','✶'];
const AVATAR_COLORS = [
  '#8B6F47', '#A85A3C', '#5E7A4A', '#4A7A7A',
  '#4A5788', '#6B5B8A', '#9A7B3F', '#2F6B52',
];

function LoginScreen({ onLogin }) {
  const [step, setStep] = React.useState('intro'); // intro | create | welcome
  const [name, setName] = React.useState('');
  const [cls, setCls]   = React.useState('sage');
  const [glyph, setGlyph] = React.useState('◆');
  const [color, setColor] = React.useState('#8B6F47');

  const canCreate = name.trim().length >= 2;

  function create() {
    if (!canCreate) return;
    const user = {
      name: name.trim(),
      classId: cls,
      avatar: { glyph, color },
      createdAt: new Date().toISOString(),
    };
    saveUser(user);
    setStep('welcome');
    setTimeout(() => onLogin(user), 1400);
  }

  const selectedClass = CLASSES.find(c => c.id === cls);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at top left, color-mix(in oklch, var(--accent) 10%, transparent), transparent 50%), radial-gradient(ellipse at bottom right, color-mix(in oklch, var(--sabedoria) 8%, transparent), transparent 50%)',
      }} />

      {step === 'intro' && (
        <div style={{ textAlign: 'center', maxWidth: 520, position: 'relative' }}>
          <div style={{
            width: 96, height: 96, margin: '0 auto 24px',
            borderRadius: 24, border: '2px solid var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--surface)',
          }}>
            <span className="serif" style={{ fontSize: 56, fontStyle: 'italic', color: 'var(--ink)' }}>E</span>
          </div>
          <div style={{ fontSize: 12, letterSpacing: '0.12em', color: 'var(--ink-3)', textTransform: 'uppercase', fontWeight: 500 }}>EvoQuest · v1.0</div>
          <div className="serif" style={{ fontSize: 56, lineHeight: 1.05, marginTop: 8, color: 'var(--ink)' }}>Comece sua jornada</div>
          <div style={{ color: 'var(--ink-2)', fontSize: 15, marginTop: 14, lineHeight: 1.5 }}>
            Um sistema de evolução pessoal estilo RPG. Acompanhe hábitos, bata metas, evolua seus atributos e construa a versão mais forte de você.
          </div>
          <button className="btn primary" onClick={() => setStep('create')} style={{
            marginTop: 36, padding: '14px 28px', fontSize: 14, letterSpacing: '0.04em',
          }}>
            Criar personagem →
          </button>
          <div style={{ marginTop: 14, fontSize: 11, color: 'var(--ink-4)' }}>
            Seus dados ficam apenas no seu dispositivo.
          </div>
        </div>
      )}

      {step === 'create' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 960, width: '100%', position: 'relative' }}>
          {/* Left: form */}
          <div className="card" style={{ padding: 28 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--ink-3)', textTransform: 'uppercase', fontWeight: 500 }}>Passo 1 de 1</div>
            <div className="serif" style={{ fontSize: 32, lineHeight: 1.1, marginTop: 4, color: 'var(--ink)' }}>Criar personagem</div>

            {/* Name */}
            <div style={{ marginTop: 20 }}>
              <label style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nome</label>
              <input
                value={name} onChange={e => setName(e.target.value)}
                placeholder="Como você quer ser chamado?"
                autoFocus
                style={{
                  width: '100%', marginTop: 6, padding: '10px 12px',
                  background: 'var(--surface)', border: '1px solid var(--line)',
                  borderRadius: 8, color: 'var(--ink)', fontSize: 14,
                  fontFamily: 'inherit', outline: 'none',
                }}
              />
            </div>

            {/* Avatar glyph */}
            <div style={{ marginTop: 18 }}>
              <label style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Símbolo</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 6, marginTop: 6 }}>
                {AVATAR_GLYPHS.map(g => (
                  <button key={g} onClick={() => setGlyph(g)}
                    className={glyph === g ? 'avatar-swatch active' : 'avatar-swatch'}
                    style={{ aspectRatio: '1', fontSize: 18 }}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div style={{ marginTop: 18 }}>
              <label style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cor</label>
              <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                {AVATAR_COLORS.map(c => (
                  <button key={c} onClick={() => setColor(c)}
                    aria-label={c}
                    style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: c,
                      border: color === c ? '3px solid var(--ink)' : '2px solid var(--line)',
                      cursor: 'pointer', padding: 0,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Class */}
            <div style={{ marginTop: 18 }}>
              <label style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Classe</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 6 }}>
                {CLASSES.map(c => (
                  <button key={c.id} onClick={() => setCls(c.id)}
                    className={cls === c.id ? 'class-btn active' : 'class-btn'}
                    style={{ textAlign: 'left', padding: '8px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 14 }}>{c.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</span>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 2, lineHeight: 1.3 }}>{c.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
              <button className="btn ghost" onClick={() => setStep('intro')} style={{ fontSize: 13 }}>← Voltar</button>
              <button className="btn primary" onClick={create} disabled={!canCreate} style={{
                flex: 1, padding: '10px 16px', fontSize: 14,
                opacity: canCreate ? 1 : 0.5, cursor: canCreate ? 'pointer' : 'not-allowed',
              }}>
                Começar jornada →
              </button>
            </div>
          </div>

          {/* Right: preview */}
          <div className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--ink-3)', textTransform: 'uppercase', fontWeight: 500 }}>Prévia</div>

            <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 88, height: 88, borderRadius: 20,
                background: color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 40,
                boxShadow: '0 4px 20px color-mix(in oklch, ' + color + ' 35%, transparent)',
              }}>{glyph}</div>
              <div style={{ minWidth: 0 }}>
                <div className="serif" style={{ fontSize: 28, lineHeight: 1.1, color: 'var(--ink)' }}>
                  {name.trim() || 'Aventureiro'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>
                  Nível 1 · {selectedClass.name}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24, fontSize: 12, color: 'var(--ink-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Atributos iniciais</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {ATTRIBUTES.map(a => {
                const isPrimary = a.id === selectedClass.primary;
                const isSecondary = a.id === selectedClass.secondary;
                const bonus = isPrimary ? 3 : isSecondary ? 2 : 1;
                return (
                  <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '110px 1fr auto', gap: 10, alignItems: 'center', fontSize: 12 }}>
                    <span style={{ color: 'var(--ink-2)' }}>
                      <span style={{ color: a.hue, marginRight: 4 }}>{a.icon}</span>
                      {a.name}
                    </span>
                    <div className="xp-bar"><div className="fill" style={{ width: `${bonus * 20}%`, '--hue': a.hue }} /></div>
                    <span className="mono" style={{ fontSize: 10, color: isPrimary ? 'var(--accent)' : 'var(--ink-3)', fontWeight: isPrimary ? 600 : 400 }}>
                      +{bonus}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ flex: 1 }} />
            <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 20, lineHeight: 1.5 }}>
              Sua classe define um pequeno bônus inicial. Você pode focar em qualquer atributo ao longo da jornada — nada é permanente.
            </div>
          </div>
        </div>
      )}

      {step === 'welcome' && (
        <div style={{ textAlign: 'center', position: 'relative', animation: 'fadeUp 0.6s ease' }}>
          <div style={{
            width: 120, height: 120, margin: '0 auto 24px',
            borderRadius: 28, background: color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 56,
            boxShadow: '0 8px 40px color-mix(in oklch, ' + color + ' 45%, transparent)',
            animation: 'pop 0.5s cubic-bezier(.2,1.4,.3,1)',
          }}>{glyph}</div>
          <div style={{ fontSize: 12, letterSpacing: '0.12em', color: 'var(--ink-3)', textTransform: 'uppercase', fontWeight: 500 }}>Personagem criado</div>
          <div className="serif" style={{ fontSize: 48, lineHeight: 1.05, marginTop: 8, color: 'var(--ink)' }}>
            Bem-vindo, {name.trim()}.
          </div>
          <div style={{ color: 'var(--ink-3)', fontSize: 14, marginTop: 10 }}>
            Sua jornada começa agora…
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { LoginScreen, loadUser, saveUser, clearUser, CLASSES });
