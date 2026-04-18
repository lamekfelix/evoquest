// state.jsx — seed data + state management for EvoQuest

const ATTRIBUTES = [
  { id: 'forca',        name: 'Força',        en: 'Strength',   abbr: 'FOR', hue: 'var(--forca)',        icon: '◆' },
  { id: 'inteligencia', name: 'Inteligência', en: 'Intellect',  abbr: 'INT', hue: 'var(--inteligencia)', icon: '◇' },
  { id: 'sabedoria',    name: 'Sabedoria',    en: 'Wisdom',     abbr: 'SAB', hue: 'var(--sabedoria)',    icon: '◈' },
  { id: 'disciplina',   name: 'Disciplina',   en: 'Discipline', abbr: 'DIS', hue: 'var(--disciplina)',   icon: '◉' },
  { id: 'foco',         name: 'Foco',         en: 'Focus',      abbr: 'FOC', hue: 'var(--foco)',         icon: '◎' },
  { id: 'vitalidade',   name: 'Vitalidade',   en: 'Vitality',   abbr: 'VIT', hue: 'var(--vitalidade)',   icon: '◐' },
  { id: 'resiliencia',  name: 'Resiliência',  en: 'Resilience', abbr: 'RES', hue: 'var(--resiliencia)',  icon: '◑' },
  { id: 'equilibrio',   name: 'Equilíbrio',   en: 'Balance',    abbr: 'EQU', hue: 'var(--equilibrio)',   icon: '◒' },
];

// XP required to reach level n (from 1): 100 * n * 1.35^(n-1), capped compounding
function xpForLevel(level) {
  return Math.round(100 * level * Math.pow(1.28, level - 1));
}

// total XP accumulated → { level, xpInLevel, xpToNext, progress }
function deriveLevel(totalXp) {
  let level = 1, remaining = totalXp;
  while (true) {
    const need = xpForLevel(level);
    if (remaining < need) return { level, xpInLevel: remaining, xpToNext: need, progress: remaining / need };
    remaining -= need;
    level++;
    if (level > 99) return { level: 99, xpInLevel: xpForLevel(99), xpToNext: xpForLevel(99), progress: 1 };
  }
}

// Fresh start — user begins with no XP and no habits/projects/quests
const SEED_ATTR_XP = {
  forca: 0, inteligencia: 0, sabedoria: 0, disciplina: 0,
  foco: 0, vitalidade: 0, resiliencia: 0, equilibrio: 0,
};

const HABITS_SEED = [];

// PARA — empty at first run. User creates these.
const PROJECTS_SEED = [];
const AREAS_SEED = [];
const RESOURCES_SEED = [];
const ARCHIVES_SEED = [];

// Today + agenda
const today = new Date('2026-04-17'); // fixed "today" for demo

function dateISO(d) { return d.toISOString().slice(0,10); }
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate()+n); return x; }

const AGENDA_SEED = [];
const QUESTS_SEED = [];

// Achievements are a definition, not user data. They stay — unlock state is derived from stats.
const ACHIEVEMENTS_SEED = [
  { id: 'ac1', name: 'Primeiros Passos',   desc: 'Complete seu primeiro hábito',          unlocked: false },
  { id: 'ac2', name: 'Chama Eterna',        desc: 'Streak de 30 dias em qualquer hábito', unlocked: false },
  { id: 'ac3', name: 'Arquiteto',           desc: 'Crie seu primeiro projeto PARA',       unlocked: false },
  { id: 'ac4', name: 'Foco de Monge',       desc: 'Nível 10 em Disciplina',               unlocked: false },
  { id: 'ac5', name: 'Escolar Dedicado',    desc: '50 livros lidos',                      unlocked: false },
  { id: 'ac6', name: 'Maratona Completa',   desc: 'Completar uma maratona oficial',       unlocked: false },
  { id: 'ac7', name: 'Equilíbrio Pleno',    desc: 'Todos atributos acima de nível 15',    unlocked: false },
  { id: 'ac8', name: 'Alquimista',          desc: 'Transforme 5 áreas em 1 ano',          unlocked: false },
];

// generate 90 days of XP history for charts
function generateXpHistory() {
  const history = [];
  const start = new Date('2026-01-17');
  const state = { forca: 0, inteligencia: 0, sabedoria: 0, disciplina: 0, foco: 0, vitalidade: 0, resiliencia: 0, equilibrio: 0 };
  for (let i = 0; i < 91; i++) {
    const d = new Date(start); d.setDate(d.getDate() + i);
    // simulate realistic growth w/ noise
    state.forca       += 20 + Math.random() * 25 * (0.5 + Math.sin(i/12));
    state.inteligencia+= 30 + Math.random() * 30;
    state.sabedoria   += 25 + Math.random() * 20;
    state.disciplina  += 28 + Math.random() * 25;
    state.foco        += 15 + Math.random() * 20;
    state.vitalidade  += 22 + Math.random() * 25 * (0.7 + Math.cos(i/10));
    state.resiliencia += 12 + Math.random() * 18;
    state.equilibrio  += 10 + Math.random() * 15;
    history.push({ date: dateISO(d), ...state });
  }
  return history;
}

// XP history is accumulated from real usage now. Empty at start.
const XP_HISTORY = [];
function _unused_gen_xp() { return generateXpHistory(); }

// habit completion history (for heatmap) — 90 days × 8 habits
function generateHabitHistory() {
  const map = {};
  HABITS_SEED.forEach(h => {
    map[h.id] = [];
    for (let i = 89; i >= 0; i--) {
      const d = addDays(today, -i);
      const day = d.getDay();
      if (h.freq === 'weekday' && (day === 0 || day === 6)) { map[h.id].push(null); continue; }
      const base = 0.6 + (h.streak / 60);
      map[h.id].push(Math.random() < base ? 1 : 0);
    }
  });
  return map;
}
// Habit completion heatmap — empty at start, fills as user checks off habits.
const HABIT_HISTORY = {};
function _unused_gen_habit() { return generateHabitHistory(); }

// =========================
// WORKOUT PLANS
// =========================
const MUSCLE_GROUPS = [
  { id: 'peito',   name: 'Peito',     hue: 'var(--forca)' },
  { id: 'costas',  name: 'Costas',    hue: 'var(--disciplina)' },
  { id: 'ombro',   name: 'Ombros',    hue: 'var(--resiliencia)' },
  { id: 'biceps',  name: 'Bíceps',    hue: 'var(--forca)' },
  { id: 'triceps', name: 'Tríceps',   hue: 'var(--resiliencia)' },
  { id: 'perna',   name: 'Pernas',    hue: 'var(--vitalidade)' },
  { id: 'core',    name: 'Core',      hue: 'var(--equilibrio)' },
  { id: 'cardio',  name: 'Cardio',    hue: 'var(--foco)' },
  { id: 'mob',     name: 'Mobilidade',hue: 'var(--sabedoria)' },
];

const EXERCISE_LIB = [
  // Peito
  { id: 'e1',  name: 'Supino reto com barra',     group: 'peito',   kind: 'musc' },
  { id: 'e2',  name: 'Supino inclinado halteres', group: 'peito',   kind: 'musc' },
  { id: 'e3',  name: 'Crucifixo polia',           group: 'peito',   kind: 'musc' },
  { id: 'e4',  name: 'Flexão de braço',           group: 'peito',   kind: 'func' },
  // Costas
  { id: 'e5',  name: 'Barra fixa',                group: 'costas',  kind: 'func' },
  { id: 'e6',  name: 'Remada curvada',            group: 'costas',  kind: 'musc' },
  { id: 'e7',  name: 'Puxada alta',               group: 'costas',  kind: 'musc' },
  { id: 'e8',  name: 'Remada unilateral',         group: 'costas',  kind: 'musc' },
  // Ombro
  { id: 'e9',  name: 'Desenvolvimento militar',   group: 'ombro',   kind: 'musc' },
  { id: 'e10', name: 'Elevação lateral',          group: 'ombro',   kind: 'musc' },
  { id: 'e11', name: 'Face pull',                 group: 'ombro',   kind: 'musc' },
  // Bíceps & Tríceps
  { id: 'e12', name: 'Rosca direta',              group: 'biceps',  kind: 'musc' },
  { id: 'e13', name: 'Rosca alternada',           group: 'biceps',  kind: 'musc' },
  { id: 'e14', name: 'Tríceps corda',             group: 'triceps', kind: 'musc' },
  { id: 'e15', name: 'Tríceps francês',           group: 'triceps', kind: 'musc' },
  // Pernas
  { id: 'e16', name: 'Agachamento livre',         group: 'perna',   kind: 'musc' },
  { id: 'e17', name: 'Leg press',                 group: 'perna',   kind: 'musc' },
  { id: 'e18', name: 'Stiff',                     group: 'perna',   kind: 'musc' },
  { id: 'e19', name: 'Cadeira extensora',         group: 'perna',   kind: 'musc' },
  { id: 'e20', name: 'Panturrilha em pé',         group: 'perna',   kind: 'musc' },
  { id: 'e21', name: 'Agachamento búlgaro',       group: 'perna',   kind: 'func' },
  { id: 'e22', name: 'Afundo com halter',         group: 'perna',   kind: 'func' },
  // Core
  { id: 'e23', name: 'Prancha frontal',           group: 'core',    kind: 'func' },
  { id: 'e24', name: 'Abdominal infra',           group: 'core',    kind: 'func' },
  { id: 'e25', name: 'Russian twist',             group: 'core',    kind: 'func' },
  { id: 'e26', name: 'Dead bug',                  group: 'core',    kind: 'func' },
  // Funcional
  { id: 'e27', name: 'Burpee',                    group: 'cardio',  kind: 'func' },
  { id: 'e28', name: 'Kettlebell swing',          group: 'perna',   kind: 'func' },
  { id: 'e29', name: 'Box jump',                  group: 'perna',   kind: 'func' },
  { id: 'e30', name: 'Farmer walk',               group: 'core',    kind: 'func' },
  { id: 'e31', name: 'Thruster',                  group: 'perna',   kind: 'func' },
  // Cardio & Mob
  { id: 'e32', name: 'Corrida 5km',               group: 'cardio',  kind: 'cardio' },
  { id: 'e33', name: 'Bike 30min',                group: 'cardio',  kind: 'cardio' },
  { id: 'e34', name: 'HIIT 20min',                group: 'cardio',  kind: 'cardio' },
  { id: 'e35', name: 'Alongamento global',        group: 'mob',     kind: 'mob' },
  { id: 'e36', name: 'Yoga flow',                 group: 'mob',     kind: 'mob' },
];

// Workout split — empty at start. User builds their own routine.
const WORKOUT_SPLIT_SEED = [];
const WORKOUT_SPLIT_DEMO = [
  {
    id: 'w1', day: 'Segunda', label: 'A — Push (Peito / Ombro / Tríceps)', kind: 'musc', durationMin: 60,
    exercises: [
      { exId: 'e1',  sets: 4, reps: '8-10', load: '60kg',  rest: 90,  done: true },
      { exId: 'e2',  sets: 3, reps: '10-12',load: '22kg',  rest: 75,  done: true },
      { exId: 'e3',  sets: 3, reps: '12-15',load: '15kg',  rest: 60,  done: false },
      { exId: 'e9',  sets: 4, reps: '8-10', load: '35kg',  rest: 90,  done: false },
      { exId: 'e10', sets: 3, reps: '12-15',load: '10kg',  rest: 45,  done: false },
      { exId: 'e14', sets: 3, reps: '12-15',load: '25kg',  rest: 45,  done: false },
    ],
  },
  {
    id: 'w2', day: 'Terça', label: 'B — Pull (Costas / Bíceps)', kind: 'musc', durationMin: 55,
    exercises: [
      { exId: 'e5',  sets: 4, reps: '6-8',  load: 'Peso',  rest: 90,  done: true },
      { exId: 'e6',  sets: 4, reps: '8-10', load: '50kg',  rest: 90,  done: true },
      { exId: 'e7',  sets: 3, reps: '10-12',load: '55kg',  rest: 75,  done: true },
      { exId: 'e8',  sets: 3, reps: '10-12',load: '22kg',  rest: 60,  done: true },
      { exId: 'e12', sets: 3, reps: '10-12',load: '14kg',  rest: 60,  done: true },
      { exId: 'e13', sets: 3, reps: '10-12',load: '12kg',  rest: 45,  done: true },
    ],
  },
  {
    id: 'w3', day: 'Quarta', label: 'C — Legs (Pernas / Core)', kind: 'musc', durationMin: 70,
    exercises: [
      { exId: 'e16', sets: 5, reps: '5-8',  load: '80kg',  rest: 120, done: true },
      { exId: 'e17', sets: 4, reps: '10-12',load: '180kg', rest: 90,  done: true },
      { exId: 'e18', sets: 4, reps: '8-10', load: '60kg',  rest: 90,  done: false },
      { exId: 'e19', sets: 3, reps: '12-15',load: '45kg',  rest: 60,  done: false },
      { exId: 'e20', sets: 4, reps: '15-20',load: '70kg',  rest: 45,  done: false },
      { exId: 'e23', sets: 3, reps: '60s',  load: '—',     rest: 45,  done: false },
    ],
  },
  {
    id: 'w4', day: 'Quinta', label: 'Funcional — Full Body', kind: 'func', durationMin: 45,
    exercises: [
      { exId: 'e21', sets: 3, reps: '12 cada',load: '14kg',rest: 60,  done: false },
      { exId: 'e27', sets: 4, reps: '15',   load: '—',     rest: 60,  done: false },
      { exId: 'e28', sets: 4, reps: '20',   load: '20kg',  rest: 45,  done: false },
      { exId: 'e30', sets: 3, reps: '40m',  load: '24kg',  rest: 60,  done: false },
      { exId: 'e25', sets: 3, reps: '30',   load: '8kg',   rest: 30,  done: false },
    ],
  },
  {
    id: 'w5', day: 'Sexta', label: 'A — Push (repeat)', kind: 'musc', durationMin: 55,
    exercises: [
      { exId: 'e2',  sets: 4, reps: '8-10', load: '24kg',  rest: 90,  done: false },
      { exId: 'e4',  sets: 3, reps: 'AMRAP',load: '—',     rest: 60,  done: false },
      { exId: 'e9',  sets: 3, reps: '10-12',load: '32kg',  rest: 75,  done: false },
      { exId: 'e11', sets: 3, reps: '12-15',load: '18kg',  rest: 45,  done: false },
      { exId: 'e15', sets: 3, reps: '10-12',load: '14kg',  rest: 45,  done: false },
    ],
  },
  {
    id: 'w6', day: 'Sábado', label: 'Cardio + Mobilidade', kind: 'cardio', durationMin: 60,
    exercises: [
      { exId: 'e32', sets: 1, reps: '5km',  load: '28:00', rest: 0,  done: false },
      { exId: 'e34', sets: 1, reps: '20min',load: 'Tabata',rest: 0,  done: false },
      { exId: 'e35', sets: 1, reps: '15min',load: '—',     rest: 0,  done: false },
    ],
  },
  {
    id: 'w7', day: 'Domingo', label: 'Descanso ativo', kind: 'mob', durationMin: 30,
    exercises: [
      { exId: 'e36', sets: 1, reps: '30min',load: '—',     rest: 0,  done: false },
    ],
  },
];

// =========================
// DIET PLAN
// =========================
const FOOD_LIB = [
  // Proteínas
  { id: 'f1',  name: 'Frango grelhado',       cat: 'proteina', base: 100, unit: 'g',  kcal: 165, p: 31, c: 0,  f: 3.6 },
  { id: 'f2',  name: 'Filé mignon',           cat: 'proteina', base: 100, unit: 'g',  kcal: 217, p: 26, c: 0,  f: 12  },
  { id: 'f3',  name: 'Salmão',                cat: 'proteina', base: 100, unit: 'g',  kcal: 208, p: 20, c: 0,  f: 13  },
  { id: 'f4',  name: 'Tilápia',               cat: 'proteina', base: 100, unit: 'g',  kcal: 129, p: 26, c: 0,  f: 3   },
  { id: 'f5',  name: 'Ovo inteiro',           cat: 'proteina', base: 1,   unit: 'un', kcal: 78,  p: 6.3,c: 0.6,f: 5.3 },
  { id: 'f6',  name: 'Whey protein',          cat: 'proteina', base: 30,  unit: 'g',  kcal: 120, p: 24, c: 3,  f: 1.5 },
  { id: 'f7',  name: 'Iogurte grego',         cat: 'proteina', base: 170, unit: 'g',  kcal: 100, p: 17, c: 6,  f: 0   },
  // Carbos
  { id: 'f8',  name: 'Arroz integral',        cat: 'carbo',    base: 100, unit: 'g',  kcal: 124, p: 2.6,c: 26, f: 1   },
  { id: 'f9',  name: 'Arroz branco',          cat: 'carbo',    base: 100, unit: 'g',  kcal: 130, p: 2.7,c: 28, f: 0.3 },
  { id: 'f10', name: 'Batata doce',           cat: 'carbo',    base: 100, unit: 'g',  kcal: 86,  p: 1.6,c: 20, f: 0.1 },
  { id: 'f11', name: 'Aveia',                 cat: 'carbo',    base: 40,  unit: 'g',  kcal: 150, p: 5,  c: 27, f: 3   },
  { id: 'f12', name: 'Pão integral',          cat: 'carbo',    base: 1,   unit: 'fat',kcal: 80,  p: 4,  c: 15, f: 1   },
  { id: 'f13', name: 'Banana',                cat: 'carbo',    base: 1,   unit: 'un', kcal: 105, p: 1.3,c: 27, f: 0.4 },
  // Gorduras
  { id: 'f14', name: 'Abacate',               cat: 'gordura',  base: 100, unit: 'g',  kcal: 160, p: 2,  c: 9,  f: 15  },
  { id: 'f15', name: 'Azeite extra virgem',   cat: 'gordura',  base: 1,   unit: 'cs', kcal: 120, p: 0,  c: 0,  f: 14  },
  { id: 'f16', name: 'Castanhas mix',         cat: 'gordura',  base: 30,  unit: 'g',  kcal: 180, p: 5,  c: 6,  f: 16  },
  { id: 'f17', name: 'Pasta de amendoim',     cat: 'gordura',  base: 1,   unit: 'cs', kcal: 94,  p: 4,  c: 3,  f: 8   },
  // Vegetais
  { id: 'f18', name: 'Brócolis',              cat: 'veg',      base: 100, unit: 'g',  kcal: 34,  p: 2.8,c: 7,  f: 0.4 },
  { id: 'f19', name: 'Salada verde',          cat: 'veg',      base: 100, unit: 'g',  kcal: 20,  p: 1.5,c: 3,  f: 0.2 },
  { id: 'f20', name: 'Tomate',                cat: 'veg',      base: 100, unit: 'g',  kcal: 18,  p: 0.9,c: 3.9,f: 0.2 },
  { id: 'f21', name: 'Mirtilos',              cat: 'veg',      base: 100, unit: 'g',  kcal: 57,  p: 0.7,c: 14, f: 0.3 },
];

// User's diet goals
const DIET_GOALS = {
  kcal: 2400,
  p: 180,
  c: 260,
  f: 70,
  water: 3000,
  waterToday: 0,
};

// Meals — empty at start.
const MEALS_SEED = [];
const MEALS_DEMO = [
  {
    id: 'm1', name: 'Café da manhã', time: '07:30', icon: '◐',
    items: [
      { foodId: 'f5',  qty: 3,   note: 'mexidos' },
      { foodId: 'f11', qty: 40,  note: 'com leite' },
      { foodId: 'f13', qty: 1,   note: '' },
      { foodId: 'f17', qty: 1,   note: '' },
    ],
  },
  {
    id: 'm2', name: 'Lanche manhã', time: '10:30', icon: '◇',
    items: [
      { foodId: 'f6',  qty: 30,  note: 'pós-treino' },
      { foodId: 'f13', qty: 1,   note: '' },
    ],
  },
  {
    id: 'm3', name: 'Almoço', time: '12:30', icon: '◆',
    items: [
      { foodId: 'f1',  qty: 180, note: 'peito' },
      { foodId: 'f8',  qty: 120, note: '' },
      { foodId: 'f18', qty: 150, note: 'vapor' },
      { foodId: 'f19', qty: 80,  note: '' },
      { foodId: 'f15', qty: 1,   note: 'na salada' },
    ],
  },
  {
    id: 'm4', name: 'Lanche tarde', time: '16:00', icon: '◈',
    items: [
      { foodId: 'f7',  qty: 170, note: '' },
      { foodId: 'f16', qty: 30,  note: '' },
      { foodId: 'f21', qty: 80,  note: '' },
    ],
  },
  {
    id: 'm5', name: 'Jantar', time: '19:30', icon: '◒',
    items: [
      { foodId: 'f3',  qty: 150, note: 'grelhado' },
      { foodId: 'f10', qty: 200, note: 'assada' },
      { foodId: 'f18', qty: 100, note: '' },
      { foodId: 'f14', qty: 50,  note: '1/4 de unidade' },
    ],
  },
];

// compute a food item's macros from qty
function foodMacros(foodId, qty) {
  const f = FOOD_LIB.find(x => x.id === foodId);
  if (!f) return { kcal: 0, p: 0, c: 0, f: 0 };
  const factor = qty / f.base;
  return {
    kcal: Math.round(f.kcal * factor),
    p:    +(f.p * factor).toFixed(1),
    c:    +(f.c * factor).toFixed(1),
    f:    +(f.f * factor).toFixed(1),
  };
}

function mealTotals(meal) {
  return meal.items.reduce((acc, it) => {
    const m = foodMacros(it.foodId, it.qty);
    acc.kcal += m.kcal; acc.p += m.p; acc.c += m.c; acc.f += m.f;
    return acc;
  }, { kcal: 0, p: 0, c: 0, f: 0 });
}

Object.assign(window, {
  ATTRIBUTES, SEED_ATTR_XP, HABITS_SEED, PROJECTS_SEED, AREAS_SEED, RESOURCES_SEED, ARCHIVES_SEED,
  AGENDA_SEED, QUESTS_SEED, ACHIEVEMENTS_SEED, XP_HISTORY, HABIT_HISTORY,
  MUSCLE_GROUPS, EXERCISE_LIB, WORKOUT_SPLIT_SEED,
  FOOD_LIB, DIET_GOALS, MEALS_SEED, foodMacros, mealTotals,
  xpForLevel, deriveLevel, dateISO, addDays, today,
});
