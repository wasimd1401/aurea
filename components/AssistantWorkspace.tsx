import React, { useMemo, useState } from 'react';
import { CONTENT } from '../constants';
import { Language } from '../types';

interface AssistantWorkspaceProps {
  lang: Language;
  activePanel: string;
}

interface ScheduleBlock {
  time: string;
  label: string;
  detail?: string;
}

interface ItineraryPlan {
  morning: string[];
  afternoon: string[];
  evening: string[];
  checklist: string[];
}

interface FitnessPlan {
  workouts: string[];
  meals: string[];
  notes: string[];
}

interface EmailDraft {
  subject: string;
  body: string;
}

interface DocAnalysis {
  summary: string;
  keyPoints: string[];
  actions: string[];
  stats: string;
}

interface ChatMessage {
  role: 'assistant' | 'user';
  text: string;
}

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const toTimeLabel = (minutes: number) => {
  const hours24 = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  const suffix = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = ((hours24 + 11) % 12) + 1;
  return `${hours12}:${mins.toString().padStart(2, '0')} ${suffix}`;
};

const buildSchedule = (tasks: string[], start: string, end: string, focus: string): ScheduleBlock[] => {
  const startMinutes = toMinutes(start);
  const endMinutes = toMinutes(end);
  const blocks: ScheduleBlock[] = [];
  let cursor = startMinutes;

  const addBlock = (label: string, duration: number, detail?: string) => {
    const next = cursor + duration;
    if (next > endMinutes) {
      return false;
    }
    blocks.push({
      time: `${toTimeLabel(cursor)} - ${toTimeLabel(next)}`,
      label,
      detail,
    });
    cursor = next;
    return true;
  };

  if (focus) {
    addBlock(focus, 90, 'Deep focus, notifications muted');
    addBlock('Reset + hydration', 15, 'Short walk and quick notes');
  }

  tasks.forEach((task) => {
    addBlock(task, 45, 'Execution + recap');
    addBlock('Buffer', 10, 'Transition and prep');
  });

  if (cursor < endMinutes) {
    addBlock('Wrap-up', Math.min(30, endMinutes - cursor), 'Inbox zero + tomorrow preview');
  }

  return blocks;
};

const buildItinerary = (city: string, date: string, preferences: string, pace: string): ItineraryPlan => {
  const paceNotes = {
    relaxed: 'Slow start with longer breaks.',
    balanced: 'Balanced rhythm with one anchor activity.',
    intensive: 'High-energy schedule with tight transitions.',
  };

  return {
    morning: [
      `Breakfast reservation in ${city} with ${preferences}.`,
      `Walk + daily briefing (${paceNotes[pace as keyof typeof paceNotes]}).`,
    ],
    afternoon: [
      `Primary experience curated around ${preferences}.`,
      'Working lunch with quiet seating and outlet access.',
    ],
    evening: [
      'Sunset reset: light mobility and recap notes.',
      `Dinner focused on lean protein and seasonal sides in ${city}.`,
    ],
    checklist: [
      `Confirm reservations for ${date}.`,
      'Send addresses and travel time reminders.',
      'Pack essentials: earbuds, charger, gym kit.',
    ],
  };
};

const buildFitnessPlan = (
  goal: string,
  days: number,
  equipment: string,
  experience: string,
  diet: string
): FitnessPlan => {
  const strengthSplit = [
    'Upper body strength + core',
    'Lower body strength + posterior chain',
    'Push focus + mobility',
    'Pull focus + conditioning',
    'Full-body power circuit',
    'Active recovery + stretching',
  ];
  const leanSplit = [
    'Full-body hypertrophy + intervals',
    'Lower body + steady-state cardio',
    'Upper body + tempo core',
    'Conditioning + mobility flow',
    'Glutes + hamstrings + sprint work',
    'Yoga + breathwork',
  ];
  const performanceSplit = [
    'Speed + agility + core',
    'Strength endurance circuit',
    'Power + plyometrics',
    'Zone 2 cardio + mobility',
    'Athletic full-body lift',
    'Recovery + soft tissue work',
  ];

  const splitMap: Record<string, string[]> = {
    strength: strengthSplit,
    lean: leanSplit,
    performance: performanceSplit,
  };

  const mealMap: Record<string, string[]> = {
    strength: [
      'Breakfast: eggs, oats, berries',
      'Lunch: grilled chicken, quinoa, greens',
      'Snack: Greek yogurt + nuts',
      'Dinner: salmon, sweet potato, vegetables',
    ],
    lean: [
      'Breakfast: protein smoothie + chia',
      'Lunch: turkey salad + olive oil',
      'Snack: cottage cheese + fruit',
      'Dinner: lean steak, cauliflower rice, greens',
    ],
    performance: [
      'Breakfast: oats, banana, whey',
      'Lunch: tuna bowl + brown rice',
      'Snack: rice cakes + nut butter',
      'Dinner: chicken stir fry + vegetables',
    ],
  };

  const workouts = splitMap[goal].slice(0, days).map((workout, index) => `Day ${index + 1}: ${workout}`);
  const meals = mealMap[goal].map((meal) => `${meal} (${diet})`);

  return {
    workouts,
    meals,
    notes: [
      `Equipment: ${equipment}`,
      `Experience level: ${experience}`,
      'Progressive overload: add 2.5-5% weekly when form is clean.',
    ],
  };
};

const buildEmailDraft = (recipient: string, purpose: string, tone: string, points: string[]): EmailDraft => {
  const toneOpening = {
    Direct: `Hi ${recipient},`,
    Warm: `Hi ${recipient}, hope you're well.`,
    Executive: `Hello ${recipient},`,
  };

  const intro = toneOpening[tone as keyof typeof toneOpening] ?? `Hi ${recipient},`;
  const bullets = points.filter(Boolean).map((point) => `- ${point}`).join('\n');

  return {
    subject: `${purpose} | ${recipient}`,
    body: `${intro}\n\n${purpose}. Here are the key points:\n${bullets}\n\nThanks,\nFadi`,
  };
};

const analyzeDocument = (text: string, lang: Language): DocAnalysis => {
  const clean = text.trim();
  const words = clean ? clean.split(/\s+/) : [];
  const sentences = clean ? clean.split(/(?<=[.!?])\s+/) : [];
  const summary = words.slice(0, 40).join(' ') + (words.length > 40 ? '…' : '');
  const keyPoints = sentences.slice(0, 3).map((sentence) => sentence.trim());
  const actions = sentences
    .filter((sentence) => /should|need|must|next step|action/i.test(sentence))
    .slice(0, 3)
    .map((sentence) => sentence.trim());

  const emptySummary = lang === 'es' ? 'Agrega texto para generar un resumen ejecutivo.' : 'Add text to generate an executive summary.';
  const emptyPoints = lang === 'es' ? 'Aún no hay puntos clave.' : 'No key points detected yet.';
  const emptyActions = lang === 'es' ? 'No se encontraron acciones explícitas.' : 'No explicit action items found.';

  return {
    summary: summary || emptySummary,
    keyPoints: keyPoints.length ? keyPoints : [emptyPoints],
    actions: actions.length ? actions : [emptyActions],
    stats: `${words.length} words · ${sentences.length} sentences`,
  };
};

const buildChatResponse = (message: string, lang: Language) => {
  const lower = message.toLowerCase();
  if (lower.includes('workout') || lower.includes('gym') || lower.includes('training')) {
    return lang === 'es'
      ? 'Plan rápido: fuerza total (press banca, peso muerto rumano, dominadas) 4x8. Termina con 10 minutos de movilidad.'
      : 'Quick plan: full-body strength (bench press, RDLs, pull-ups) 4x8. Finish with 10 minutes of mobility.';
  }
  if (lower.includes('email') || lower.includes('correo')) {
    return lang === 'es'
      ? 'Perfecto. Dime destinatario, objetivo y tono y lo redacto.'
      : 'Perfect. Share the recipient, goal, and tone and I will draft it.';
  }
  if (lower.includes('travel') || lower.includes('trip') || lower.includes('viaje')) {
    return lang === 'es'
      ? 'Listo. Puedo crear itinerario, reservas y checklist según tus preferencias.'
      : 'On it. I can prepare the itinerary, reservations, and checklist based on preferences.';
  }
  return lang === 'es'
    ? 'Entendido. ¿Priorizamos agenda, entrenamiento o concierge hoy?'
    : 'Got it. Should we prioritize agenda, training, or concierge today?';
};

const AssistantWorkspace: React.FC<AssistantWorkspaceProps> = ({ lang, activePanel }) => {
  const content = CONTENT[lang];

  const [plannerInput, setPlannerInput] = useState({
    tasks: 'Review investor update\nDesign week priorities\nSchedule gym session\nCall with operations lead',
    focus: lang === 'es' ? 'Estrategia + comunicación' : 'Strategy + communication',
    startTime: '08:30',
    endTime: '18:00',
  });

  const [itineraryInput, setItineraryInput] = useState({
    city: 'Dubai',
    date: new Date().toISOString().slice(0, 10),
    preferences: lang === 'es' ? 'cocina mediterránea, espacios tranquilos' : 'Mediterranean cuisine, quiet lounges',
    pace: 'balanced',
  });

  const [fitnessInput, setFitnessInput] = useState({
    goal: 'strength',
    days: 4,
    equipment: lang === 'es' ? 'gimnasio completo' : 'full gym',
    experience: lang === 'es' ? 'intermedio' : 'intermediate',
    diet: lang === 'es' ? 'alto en proteína' : 'high protein',
  });

  const [emailInput, setEmailInput] = useState({
    recipient: 'Alex',
    purpose: lang === 'es' ? 'Confirmar reunión semanal' : 'Confirm weekly sync',
    tone: 'Executive',
    points: lang === 'es'
      ? 'Agenda y objetivos principales\nDecisiones pendientes\nDisponibilidad para jueves'
      : 'Agenda and main objectives\nOpen decisions\nAvailability for Thursday',
  });

  const [documentInput, setDocumentInput] = useState({
    text: lang === 'es'
      ? 'El informe destaca que el crecimiento de usuarios es sólido, pero la conversión a planes premium necesita mejorar. Se recomienda optimizar el onboarding y reforzar el plan de retención con nuevos beneficios. La próxima acción es definir el timeline de mejoras y asignar responsables.'
      : 'The report shows strong user growth, but premium conversion needs improvement. It recommends optimizing onboarding and reinforcing retention with new benefits. The next step is to define a timeline for improvements and assign owners.',
  });

  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text:
        lang === 'es'
          ? 'Hola Fadi, ¿qué necesitas priorizar hoy?'
          : 'Hi Fadi, what should we prioritize today?',
    },
  ]);

  const [setupData, setSetupData] = useState({
    name: 'Fadi',
    focus: lang === 'es' ? 'Crecimiento del negocio + rendimiento físico' : 'Business growth + peak performance',
    trainingGoal: lang === 'es' ? 'Ganar fuerza y mantener definición' : 'Build strength while staying lean',
    dietaryStyle: lang === 'es' ? 'Alto en proteína, bajo en azúcar' : 'High-protein, low sugar',
    homeCity: 'Dubai',
  });
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const plannerOutput = useMemo(
    () =>
      buildSchedule(
        plannerInput.tasks.split('\n').map((task) => task.trim()).filter(Boolean),
        plannerInput.startTime,
        plannerInput.endTime,
        plannerInput.focus
      ),
    [plannerInput]
  );

  const itineraryOutput = useMemo(
    () => buildItinerary(itineraryInput.city, itineraryInput.date, itineraryInput.preferences, itineraryInput.pace),
    [itineraryInput]
  );

  const fitnessOutput = useMemo(
    () => buildFitnessPlan(fitnessInput.goal, fitnessInput.days, fitnessInput.equipment, fitnessInput.experience, fitnessInput.diet),
    [fitnessInput]
  );

  const emailOutput = useMemo(
    () =>
      buildEmailDraft(
        emailInput.recipient,
        emailInput.purpose,
        emailInput.tone,
        emailInput.points.split('\n')
      ),
    [emailInput]
  );

  const documentOutput = useMemo(() => analyzeDocument(documentInput.text, lang), [documentInput.text, lang]);

  const handleChatSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!chatInput.trim()) return;
    const userMessage = chatInput.trim();
    const assistantReply = buildChatResponse(userMessage, lang);
    setChatMessages((prev) => [
      ...prev,
      { role: 'user', text: userMessage },
      { role: 'assistant', text: assistantReply },
    ]);
    setChatInput('');
  };

  const overviewCards = [
    {
      label: content.overview.cards.focus,
      value: plannerInput.focus,
    },
    {
      label: content.overview.cards.training,
      value: fitnessOutput.workouts[0],
    },
    {
      label: content.overview.cards.concierge,
      value: itineraryOutput.afternoon[0],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{content.sections[activePanel]?.eyebrow}</p>
          <h3 className="text-3xl font-serif mt-2">{content.sections[activePanel]?.title}</h3>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">{content.sections[activePanel]?.subtitle}</p>
        </div>
      </div>

      {activePanel === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {overviewCards.map((card) => (
            <div key={card.label} className="rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-widest text-slate-400">{card.label}</p>
              <p className="text-lg text-white mt-3">{card.value}</p>
            </div>
          ))}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
            <p className="text-xs uppercase tracking-widest text-slate-400">{content.overview.nextBlock}</p>
            <div className="mt-4 space-y-3 text-sm">
              {plannerOutput.slice(0, 4).map((block) => (
                <div key={block.time} className="flex items-start justify-between gap-4">
                  <span className="text-slate-400 min-w-[130px]">{block.time}</span>
                  <div>
                    <p className="text-white font-medium">{block.label}</p>
                    <p className="text-xs text-slate-500">{block.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-widest text-slate-400">{content.overview.brief}</p>
            <p className="text-lg text-white mt-3">{setupData.name}</p>
            <p className="text-sm text-slate-400 mt-2">{setupData.focus}</p>
            <p className="text-xs text-slate-500 mt-4">
              {content.overview.updated} {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}

      {activePanel === 'executive' && (
        <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
            <label className="text-xs uppercase tracking-widest text-slate-400">{content.executive.labels.tasks}</label>
            <textarea
              rows={6}
              className="w-full bg-transparent border border-white/10 p-3 text-sm text-white"
              value={plannerInput.tasks}
              onChange={(event) => setPlannerInput({ ...plannerInput, tasks: event.target.value })}
            />
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-slate-400">{content.executive.labels.focus}</label>
                <input
                  type="text"
                  className="w-full bg-transparent border border-white/10 p-3 text-sm text-white"
                  value={plannerInput.focus}
                  onChange={(event) => setPlannerInput({ ...plannerInput, focus: event.target.value })}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-slate-400">{content.executive.labels.startTime}</label>
                <input
                  type="time"
                  className="w-full bg-transparent border border-white/10 p-3 text-sm text-white"
                  value={plannerInput.startTime}
                  onChange={(event) => setPlannerInput({ ...plannerInput, startTime: event.target.value })}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-slate-400">{content.executive.labels.endTime}</label>
                <input
                  type="time"
                  className="w-full bg-transparent border border-white/10 p-3 text-sm text-white"
                  value={plannerInput.endTime}
                  onChange={(event) => setPlannerInput({ ...plannerInput, endTime: event.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-4">{content.executive.outputTitle}</p>
            <div className="space-y-3 text-sm">
              {plannerOutput.map((block) => (
                <div key={block.time} className="flex items-start justify-between gap-4">
                  <span className="text-slate-400 min-w-[130px]">{block.time}</span>
                  <div>
                    <p className="text-white font-medium">{block.label}</p>
                    <p className="text-xs text-slate-500">{block.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activePanel === 'concierge' && (
        <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-slate-400">{content.concierge.labels.city}</label>
                <input
                  type="text"
                  className="w-full bg-transparent border border-white/10 p-3 text-sm text-white"
                  value={itineraryInput.city}
                  onChange={(event) => setItineraryInput({ ...itineraryInput, city: event.target.value })}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-slate-400">{content.concierge.labels.date}</label>
                <input
                  type="date"
                  className="w-full bg-transparent border border-white/10 p-3 text-sm text-white"
                  value={itineraryInput.date}
                  onChange={(event) => setItineraryInput({ ...itineraryInput, date: event.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-400">{content.concierge.labels.preferences}</label>
              <input
                type="text"
                className="w-full bg-transparent border border-white/10 p-3 text-sm text-white"
                value={itineraryInput.preferences}
                onChange={(event) => setItineraryInput({ ...itineraryInput, preferences: event.target.value })}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-400">{content.concierge.labels.pace}</label>
              <select
                className="w-full bg-slate-950 border border-white/10 p-3 text-sm text-white"
                value={itineraryInput.pace}
                onChange={(event) => setItineraryInput({ ...itineraryInput, pace: event.target.value })}
              >
                <option value="relaxed">{content.concierge.pace.relaxed}</option>
                <option value="balanced">{content.concierge.pace.balanced}</option>
                <option value="intensive">{content.concierge.pace.intensive}</option>
              </select>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4 text-sm">
            <p className="text-xs uppercase tracking-widest text-slate-400">{content.concierge.outputTitle}</p>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">{content.concierge.sections.morning}</p>
              <ul className="mt-2 space-y-2">
                {itineraryOutput.morning.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">{content.concierge.sections.afternoon}</p>
              <ul className="mt-2 space-y-2">
                {itineraryOutput.afternoon.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">{content.concierge.sections.evening}</p>
              <ul className="mt-2 space-y-2">
                {itineraryOutput.evening.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">{content.concierge.sections.checklist}</p>
              <ul className="mt-2 space-y-2">
                {itineraryOutput.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activePanel === 'training' && (
        <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-slate-400">{content.fitness.labels.goal}</label>
                <select
                  className="w-full bg-slate-950 border border-white/10 p-3 text-sm text-white"
                  value={fitnessInput.goal}
                  onChange={(event) => setFitnessInput({ ...fitnessInput, goal: event.target.value })}
                >
                  <option value="strength">{content.fitness.goalOptions.strength}</option>
                  <option value="lean">{content.fitness.goalOptions.lean}</option>
                  <option value="performance">{content.fitness.goalOptions.performance}</option>
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-slate-400">{content.fitness.labels.days}</label>
                <select
                  className="w-full bg-slate-950 border border-white/10 p-3 text-sm text-white"
                  value={fitnessInput.days}
                  onChange={(event) => setFitnessInput({ ...fitnessInput, days: Number(event.target.value) })}
                >
                  {[3, 4, 5, 6].map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-slate-400">{content.fitness.labels.equipment}</label>
                <input
                  type="text"
                  className="w-full bg-transparent border border-white/10 p-3 text-sm text-white"
                  value={fitnessInput.equipment}
                  onChange={(event) => setFitnessInput({ ...fitnessInput, equipment: event.target.value })}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-slate-400">{content.fitness.labels.experience}</label>
                <input
                  type="text"
                  className="w-full bg-transparent border border-white/10 p-3 text-sm text-white"
                  value={fitnessInput.experience}
                  onChange={(event) => setFitnessInput({ ...fitnessInput, experience: event.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-widest text-slate-400">{content.fitness.outputTitle}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {fitnessOutput.workouts.map((workout) => (
                <li key={workout}>{workout}</li>
              ))}
            </ul>
            <div className="mt-6 text-xs text-slate-500">
              {fitnessOutput.notes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {activePanel === 'nutrition' && (
        <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
            <label className="text-xs uppercase tracking-widest text-slate-400">{content.fitness.labels.diet}</label>
            <input
              type="text"
              className="w-full bg-transparent border border-white/10 p-3 text-sm text-white"
              value={fitnessInput.diet}
              onChange={(event) => setFitnessInput({ ...fitnessInput, diet: event.target.value })}
            />
            <div className="text-xs text-slate-500">
              {content.nutrition.notes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-widest text-slate-400">{content.nutrition.outputTitle}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {fitnessOutput.meals.map((meal) => (
                <li key={meal}>{meal}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activePanel === 'comms' && (
        <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-slate-400">{content.email.labels.recipient}</label>
                <input
                  type="text"
                  className="w-full bg-transparent border border-white/10 p-3 text-sm text-white"
                  value={emailInput.recipient}
                  onChange={(event) => setEmailInput({ ...emailInput, recipient: event.target.value })}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-slate-400">{content.email.labels.tone}</label>
                <select
                  className="w-full bg-slate-950 border border-white/10 p-3 text-sm text-white"
                  value={emailInput.tone}
                  onChange={(event) => setEmailInput({ ...emailInput, tone: event.target.value })}
                >
                  <option value="Executive">{content.email.tones.executive}</option>
                  <option value="Direct">{content.email.tones.direct}</option>
                  <option value="Warm">{content.email.tones.warm}</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-400">{content.email.labels.purpose}</label>
              <input
                type="text"
                className="w-full bg-transparent border border-white/10 p-3 text-sm text-white"
                value={emailInput.purpose}
                onChange={(event) => setEmailInput({ ...emailInput, purpose: event.target.value })}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-400">{content.email.labels.points}</label>
              <textarea
                rows={4}
                className="w-full bg-transparent border border-white/10 p-3 text-sm text-white"
                value={emailInput.points}
                onChange={(event) => setEmailInput({ ...emailInput, points: event.target.value })}
              />
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-widest text-slate-400">{content.email.outputTitle}</p>
            <div className="mt-4 space-y-3 text-sm">
              <p>
                <span className="text-slate-500 uppercase text-xs tracking-widest">Subject</span>
                <br />
                {emailOutput.subject}
              </p>
              <div className="bg-black/30 p-4 whitespace-pre-line border border-white/5">
                {emailOutput.body}
              </div>
            </div>
          </div>
        </div>
      )}

      {activePanel === 'documents' && (
        <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <label className="text-xs uppercase tracking-widest text-slate-400">{content.analyzer.labels.document}</label>
            <textarea
              rows={12}
              className="w-full mt-3 bg-transparent border border-white/10 p-3 text-sm text-white"
              value={documentInput.text}
              onChange={(event) => setDocumentInput({ text: event.target.value })}
            />
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm">
            <p className="text-xs uppercase tracking-widest text-slate-400">{content.analyzer.outputTitle}</p>
            <p className="mt-4 text-white">{documentOutput.summary}</p>
            <p className="text-xs uppercase tracking-widest text-slate-500 mt-6">{content.analyzer.sections.keyPoints}</p>
            <ul className="mt-3 space-y-2">
              {documentOutput.keyPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p className="text-xs uppercase tracking-widest text-slate-500 mt-6">{content.analyzer.sections.actions}</p>
            <ul className="mt-3 space-y-2">
              {documentOutput.actions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
            <p className="text-xs text-slate-500 mt-6">{documentOutput.stats}</p>
          </div>
        </div>
      )}

      {activePanel === 'chat' && (
        <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="h-96 overflow-y-auto space-y-4 text-sm">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md ${
                    message.role === 'assistant' ? 'bg-white/10 text-white' : 'bg-slate-800 text-white'
                  }`}
                >
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">
                    {message.role === 'assistant' ? content.chat.roles.assistant : content.chat.roles.user}
                  </p>
                  {message.text}
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={handleChatSubmit} className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
            <label className="text-xs uppercase tracking-widest text-slate-400">{content.chat.labels.message}</label>
            <textarea
              rows={6}
              className="w-full bg-transparent border border-white/10 p-3 text-sm text-white"
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
            />
            <p className="text-xs text-slate-500">{content.chat.labels.hint}</p>
            <button
              type="submit"
              className="w-full bg-white text-slate-900 py-3 text-sm font-semibold rounded-md hover:bg-slate-200"
            >
              {content.chat.cta}
            </button>
          </form>
        </div>
      )}

      {activePanel === 'setup' && (
        <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-400">{content.setup.labels.name}</label>
              <input
                type="text"
                className="w-full bg-transparent border border-white/10 p-3 text-sm text-white"
                value={setupData.name}
                onChange={(event) => setSetupData({ ...setupData, name: event.target.value })}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-400">{content.setup.labels.focus}</label>
              <textarea
                rows={3}
                className="w-full bg-transparent border border-white/10 p-3 text-sm text-white"
                value={setupData.focus}
                onChange={(event) => setSetupData({ ...setupData, focus: event.target.value })}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-400">{content.setup.labels.trainingGoal}</label>
              <textarea
                rows={2}
                className="w-full bg-transparent border border-white/10 p-3 text-sm text-white"
                value={setupData.trainingGoal}
                onChange={(event) => setSetupData({ ...setupData, trainingGoal: event.target.value })}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-400">{content.setup.labels.dietaryStyle}</label>
              <input
                type="text"
                className="w-full bg-transparent border border-white/10 p-3 text-sm text-white"
                value={setupData.dietaryStyle}
                onChange={(event) => setSetupData({ ...setupData, dietaryStyle: event.target.value })}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-400">{content.setup.labels.homeCity}</label>
              <input
                type="text"
                className="w-full bg-transparent border border-white/10 p-3 text-sm text-white"
                value={setupData.homeCity}
                onChange={(event) => setSetupData({ ...setupData, homeCity: event.target.value })}
              />
            </div>
            <button
              type="button"
              onClick={() => setLastUpdated(new Date())}
              className="w-full bg-white text-slate-900 py-3 text-sm font-semibold rounded-md hover:bg-slate-200"
            >
              {content.setup.cta}
            </button>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-widest text-slate-400">{content.setup.outputTitle}</p>
            <p className="text-lg text-white mt-4">{setupData.name}</p>
            <p className="text-sm text-slate-400 mt-2">{setupData.focus}</p>
            <p className="text-xs text-slate-500 mt-4">
              {content.setup.updated} {lastUpdated.toLocaleTimeString()}
            </p>
            <div className="mt-6 text-sm text-white space-y-2">
              <p>• {content.setup.summaryLabels.goal}: {setupData.trainingGoal}</p>
              <p>• {content.setup.summaryLabels.diet}: {setupData.dietaryStyle}</p>
              <p>• {content.setup.summaryLabels.city}: {setupData.homeCity}</p>
            </div>
            <div className="mt-6 text-sm text-slate-400 space-y-2">
              {content.setup.nextSteps.map((step) => (
                <p key={step}>• {step}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistantWorkspace;
