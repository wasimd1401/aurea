import React, { useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import {
  CalendarCheck,
  Sparkles,
  MapPin,
  Dumbbell,
  Mail,
  FileText,
  MessageSquareText,
  ArrowRight,
} from 'lucide-react';
import { CONTENT } from '../constants';
import { Language } from '../types';

interface AssistantStudioProps {
  lang: Language;
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
    addBlock(`${focus} focus block`, 90, 'Deep work, notifications muted');
    addBlock('Reset + hydration', 15, 'Short walk & notes');
  }

  tasks.forEach((task) => {
    addBlock(task, 45, 'Execution + quick review');
    addBlock('Buffer', 10, 'Notes & transition');
  });

  if (cursor < endMinutes) {
    addBlock('Wrap-up', Math.min(30, endMinutes - cursor), 'Inbox zero + tomorrow preview');
  }

  return blocks;
};

const buildItinerary = (city: string, date: string, preferences: string, pace: string): ItineraryPlan => {
  const paceNotes = {
    relaxed: 'Slow start with longer breaks.',
    balanced: 'Balanced rhythm with one main activity.',
    intensive: 'High-energy schedule with tighter transitions.',
  };

  return {
    morning: [
      `Breakfast reservation in ${city} with ${preferences}.`,
      `Walk + quick briefing for the day (${paceNotes[pace as keyof typeof paceNotes]}).`,
    ],
    afternoon: [
      `Primary experience curated around ${preferences}.`,
      'Working lunch with a quiet table and outlet access.',
    ],
    evening: [
      `Sunset reset: light mobility + recap notes.`,
      `Dinner with a high-protein, seasonal menu in ${city}.`,
    ],
    checklist: [
      `Confirm reservations for ${date}.`,
      'Send venue addresses + ETA reminders.',
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
      'Dinner: salmon, sweet potato, veggies',
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
    Warm: `Hi ${recipient}, hope you're doing well.`,
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
      ? 'Plan rápido: fuerza total (press banca, peso muerto rumano, dominadas), 4x8. Cierra con 10 min de movilidad.'
      : 'Quick plan: full-body strength (bench press, RDLs, pull-ups), 4x8. Finish with 10 minutes of mobility.';
  }
  if (lower.includes('email') || lower.includes('correo')) {
    return lang === 'es'
      ? 'Claro. Dime el destinatario, el objetivo y el tono para redactarlo en minutos.'
      : 'Absolutely. Share the recipient, goal, and tone, and I will draft it in minutes.';
  }
  if (lower.includes('travel') || lower.includes('trip') || lower.includes('viaje')) {
    return lang === 'es'
      ? 'Listo. Puedo preparar itinerario, reservas y checklist con tus preferencias.'
      : 'On it. I can prepare the itinerary, reservations, and checklist based on preferences.';
  }
  return lang === 'es'
    ? 'Entendido. ¿Quieres que priorice agenda, entrenamiento o concierge hoy?'
    : 'Got it. Should I prioritize agenda, training, or concierge today?';
};

const AssistantStudio: React.FC<AssistantStudioProps> = ({ lang }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const content = CONTENT[lang].generator;

  const [plannerInput, setPlannerInput] = useState({
    tasks: 'Review investor update\nDesign week priorities\nSchedule gym session\nCall with operations lead',
    focus: lang === 'es' ? 'Estrategia + comunicación' : 'Strategy + communication',
    startTime: '08:30',
    endTime: '18:00',
  });

  const [itineraryInput, setItineraryInput] = useState({
    city: 'Dubai',
    date: new Date().toISOString().slice(0, 10),
    preferences: lang === 'es' ? 'cocina mediterránea, espacios tranquilos' : 'Mediterranean food, quiet lounges',
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
          ? 'Hola Fadi, ¿qué necesitas priorizar hoy: agenda, concierge o entrenamiento?'
          : 'Hi Fadi, what should we prioritize today: agenda, concierge, or training?',
    },
  ]);

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

  return (
    <section id="studio" className="py-32 px-6 md:px-12 bg-austral-dark text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-austral-dark">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-austral-clay/10 rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-austral-gold/5 rounded-full blur-[100px] opacity-10"></div>
      </div>

      <div
        ref={ref}
        className={`max-w-6xl mx-auto relative z-10 transition-all duration-1000 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1 border border-austral-gold/30 text-austral-gold text-[10px] tracking-[0.2em] uppercase">
            <Sparkles className="w-3 h-3" />
            <span>{lang === 'es' ? 'Suite en vivo' : 'Live Suite'}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-white leading-tight">{content.title}</h2>
          <p className="text-gray-400 text-xl font-light">{content.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <CalendarCheck className="w-5 h-5 text-austral-gold" />
              <div>
                <h3 className="text-2xl font-serif">{content.executive.title}</h3>
                <p className="text-sm text-gray-400">{content.executive.description}</p>
              </div>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-austral-gold">
                  {content.executive.labels.tasks}
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-transparent border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-austral-gold"
                  value={plannerInput.tasks}
                  onChange={(event) => setPlannerInput({ ...plannerInput, tasks: event.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-austral-gold">
                    {content.executive.labels.focus}
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-austral-gold"
                    value={plannerInput.focus}
                    onChange={(event) => setPlannerInput({ ...plannerInput, focus: event.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-austral-gold">
                      {content.executive.labels.startTime}
                    </label>
                    <input
                      type="time"
                      className="w-full bg-transparent border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-austral-gold"
                      value={plannerInput.startTime}
                      onChange={(event) => setPlannerInput({ ...plannerInput, startTime: event.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-austral-gold">
                      {content.executive.labels.endTime}
                    </label>
                    <input
                      type="time"
                      className="w-full bg-transparent border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-austral-gold"
                      value={plannerInput.endTime}
                      onChange={(event) => setPlannerInput({ ...plannerInput, endTime: event.target.value })}
                    />
                  </div>
                </div>
              </div>
            </form>
            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-4">
                {content.executive.outputTitle}
              </p>
              <div className="space-y-3">
                {plannerOutput.map((block, index) => (
                  <div key={index} className="flex items-start justify-between gap-4 text-sm">
                    <div className="text-gray-400 min-w-[120px]">{block.time}</div>
                    <div>
                      <p className="font-medium text-white">{block.label}</p>
                      {block.detail && <p className="text-xs text-gray-500">{block.detail}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-5 h-5 text-austral-gold" />
              <div>
                <h3 className="text-2xl font-serif">{content.concierge.title}</h3>
                <p className="text-sm text-gray-400">{content.concierge.description}</p>
              </div>
            </div>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-austral-gold">
                    {content.concierge.labels.city}
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-austral-gold"
                    value={itineraryInput.city}
                    onChange={(event) => setItineraryInput({ ...itineraryInput, city: event.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-austral-gold">
                    {content.concierge.labels.date}
                  </label>
                  <input
                    type="date"
                    className="w-full bg-transparent border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-austral-gold"
                    value={itineraryInput.date}
                    onChange={(event) => setItineraryInput({ ...itineraryInput, date: event.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-austral-gold">
                  {content.concierge.labels.preferences}
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-austral-gold"
                  value={itineraryInput.preferences}
                  onChange={(event) => setItineraryInput({ ...itineraryInput, preferences: event.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-austral-gold">
                  {content.concierge.labels.pace}
                </label>
                <select
                  className="w-full bg-austral-dark border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-austral-gold"
                  value={itineraryInput.pace}
                  onChange={(event) => setItineraryInput({ ...itineraryInput, pace: event.target.value })}
                >
                  <option value="relaxed">{lang === 'es' ? 'Relajado' : 'Relaxed'}</option>
                  <option value="balanced">{lang === 'es' ? 'Balanceado' : 'Balanced'}</option>
                  <option value="intensive">{lang === 'es' ? 'Intenso' : 'Intensive'}</option>
                </select>
              </div>
            </form>
            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-4">
                {content.concierge.outputTitle}
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-austral-gold text-xs uppercase tracking-widest mb-2">{lang === 'es' ? 'Mañana' : 'Morning'}</p>
                  <ul className="space-y-2 text-gray-200">
                    {itineraryOutput.morning.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-austral-gold text-xs uppercase tracking-widest mb-2">{lang === 'es' ? 'Tarde' : 'Afternoon'}</p>
                  <ul className="space-y-2 text-gray-200">
                    {itineraryOutput.afternoon.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-austral-gold text-xs uppercase tracking-widest mb-2">{lang === 'es' ? 'Noche' : 'Evening'}</p>
                  <ul className="space-y-2 text-gray-200">
                    {itineraryOutput.evening.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-austral-gold text-xs uppercase tracking-widest mb-2">{lang === 'es' ? 'Checklist' : 'Checklist'}</p>
                  <ul className="space-y-2 text-gray-200">
                    {itineraryOutput.checklist.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Dumbbell className="w-5 h-5 text-austral-gold" />
              <div>
                <h3 className="text-2xl font-serif">{content.fitness.title}</h3>
                <p className="text-sm text-gray-400">{content.fitness.description}</p>
              </div>
            </div>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-austral-gold">
                    {content.fitness.labels.goal}
                  </label>
                  <select
                    className="w-full bg-austral-dark border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-austral-gold"
                    value={fitnessInput.goal}
                    onChange={(event) => setFitnessInput({ ...fitnessInput, goal: event.target.value })}
                  >
                    <option value="strength">{lang === 'es' ? 'Fuerza' : 'Strength'}</option>
                    <option value="lean">{lang === 'es' ? 'Definición' : 'Lean'}</option>
                    <option value="performance">{lang === 'es' ? 'Rendimiento' : 'Performance'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-austral-gold">
                    {content.fitness.labels.days}
                  </label>
                  <select
                    className="w-full bg-austral-dark border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-austral-gold"
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
                  <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-austral-gold">
                    {content.fitness.labels.equipment}
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-austral-gold"
                    value={fitnessInput.equipment}
                    onChange={(event) => setFitnessInput({ ...fitnessInput, equipment: event.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-austral-gold">
                    {content.fitness.labels.experience}
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-austral-gold"
                    value={fitnessInput.experience}
                    onChange={(event) => setFitnessInput({ ...fitnessInput, experience: event.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-austral-gold">
                  {content.fitness.labels.diet}
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-austral-gold"
                  value={fitnessInput.diet}
                  onChange={(event) => setFitnessInput({ ...fitnessInput, diet: event.target.value })}
                />
              </div>
            </form>
            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-4">{content.fitness.outputTitle}</p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-austral-gold text-xs uppercase tracking-widest mb-2">{lang === 'es' ? 'Rutina' : 'Workouts'}</p>
                  <ul className="space-y-2 text-gray-200">
                    {fitnessOutput.workouts.map((workout, index) => (
                      <li key={index}>{workout}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-austral-gold text-xs uppercase tracking-widest mb-2">{lang === 'es' ? 'Comidas' : 'Meals'}</p>
                  <ul className="space-y-2 text-gray-200">
                    {fitnessOutput.meals.map((meal, index) => (
                      <li key={index}>{meal}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                {fitnessOutput.notes.map((note, index) => (
                  <p key={index}>{note}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-5 h-5 text-austral-gold" />
              <div>
                <h3 className="text-2xl font-serif">{content.email.title}</h3>
                <p className="text-sm text-gray-400">{content.email.description}</p>
              </div>
            </div>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-austral-gold">
                    {content.email.labels.recipient}
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-austral-gold"
                    value={emailInput.recipient}
                    onChange={(event) => setEmailInput({ ...emailInput, recipient: event.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-austral-gold">
                    {content.email.labels.tone}
                  </label>
                  <select
                    className="w-full bg-austral-dark border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-austral-gold"
                    value={emailInput.tone}
                    onChange={(event) => setEmailInput({ ...emailInput, tone: event.target.value })}
                  >
                    <option value="Executive">{lang === 'es' ? 'Ejecutivo' : 'Executive'}</option>
                    <option value="Direct">{lang === 'es' ? 'Directo' : 'Direct'}</option>
                    <option value="Warm">{lang === 'es' ? 'Cálido' : 'Warm'}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-austral-gold">
                  {content.email.labels.purpose}
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-austral-gold"
                  value={emailInput.purpose}
                  onChange={(event) => setEmailInput({ ...emailInput, purpose: event.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-austral-gold">
                  {content.email.labels.points}
                </label>
                <textarea
                  rows={3}
                  className="w-full bg-transparent border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-austral-gold"
                  value={emailInput.points}
                  onChange={(event) => setEmailInput({ ...emailInput, points: event.target.value })}
                />
              </div>
            </form>
            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-4">{content.email.outputTitle}</p>
              <div className="space-y-3 text-sm text-gray-200">
                <p>
                  <span className="text-austral-gold uppercase text-xs tracking-widest">Subject</span>
                  <br />
                  {emailOutput.subject}
                </p>
                <div className="bg-black/20 p-4 whitespace-pre-line text-gray-100 text-sm border border-white/5">
                  {emailOutput.body}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-5 h-5 text-austral-gold" />
              <div>
                <h3 className="text-2xl font-serif">{content.analyzer.title}</h3>
                <p className="text-sm text-gray-400">{content.analyzer.description}</p>
              </div>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-austral-gold">
                  {content.analyzer.labels.document}
                </label>
                <textarea
                  rows={6}
                  className="w-full bg-transparent border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-austral-gold"
                  value={documentInput.text}
                  onChange={(event) => setDocumentInput({ text: event.target.value })}
                />
              </div>
            </form>
            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-4">{content.analyzer.outputTitle}</p>
              <p className="text-sm text-gray-200 mb-3">{documentOutput.summary}</p>
              <p className="text-xs uppercase tracking-widest text-austral-gold mb-2">
                {lang === 'es' ? 'Puntos clave' : 'Key points'}
              </p>
              <ul className="space-y-2 text-sm text-gray-200 mb-4">
                {documentOutput.keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
              <p className="text-xs uppercase tracking-widest text-austral-gold mb-2">
                {lang === 'es' ? 'Acciones' : 'Actions'}
              </p>
              <ul className="space-y-2 text-sm text-gray-200 mb-4">
                {documentOutput.actions.map((action, index) => (
                  <li key={index}>{action}</li>
                ))}
              </ul>
              <p className="text-xs text-gray-500">{documentOutput.stats}</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquareText className="w-5 h-5 text-austral-gold" />
              <div>
                <h3 className="text-2xl font-serif">{content.chat.title}</h3>
                <p className="text-sm text-gray-400">{content.chat.description}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-6">
              <div className="bg-black/20 border border-white/5 p-4 h-64 overflow-y-auto space-y-4 text-sm">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-sm ${
                      message.role === 'assistant' ? 'bg-white/5 text-gray-200' : 'bg-austral-gold/20 text-white'
                    }`}
                  >
                    <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
                      {message.role === 'assistant' ? (lang === 'es' ? 'Asistente' : 'Assistant') : 'Fadi'}
                    </p>
                    {message.text}
                  </div>
                ))}
              </div>
              <form onSubmit={handleChatSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-austral-gold">
                    {content.chat.labels.message}
                  </label>
                  <textarea
                    rows={4}
                    className="w-full bg-transparent border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-austral-gold"
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-2">{content.chat.labels.hint}</p>
                </div>
                <button
                  type="submit"
                  className="w-full bg-austral-gold text-austral-dark py-3 px-4 flex items-center justify-center gap-2 hover:bg-white transition-all duration-300"
                >
                  {content.chat.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssistantStudio;
