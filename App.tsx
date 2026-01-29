import React from 'react';
import {
  Calendar,
  FileText,
  Home,
  Instagram,
  Mail,
  Music2,
  PlayCircle,
  Swords,
  Twitch,
  Youtube,
  MessageCircle,
} from 'lucide-react';

const navItems = [
  { label: 'Inicio', href: '#inicio', icon: Home },
  { label: 'Videos', href: '#videos', icon: PlayCircle },
  { label: 'Batallas', href: '#batallas', icon: Swords },
  { label: 'Música', href: '#musica', icon: Music2 },
  { label: 'Agenda', href: '#agenda', icon: Calendar },
  { label: 'Press Kit', href: '#press-kit', icon: FileText },
  { label: 'Contacto', href: '#contacto', icon: Mail },
];

const battleCards = [
  {
    title: 'FMS España Jornada 5',
    rival: 'vs. Chuty',
    date: '15 Mar 2024',
    round: 'Final',
  },
  {
    title: 'Red Bull Nacional',
    rival: 'vs. Bnet',
    date: '22 Ene 2024',
    round: 'Semifinal',
  },
  {
    title: 'FMS Internacional',
    rival: 'vs. Aczino',
    date: '10 Dic 2023',
    round: 'Cuartos',
  },
  {
    title: 'God Level',
    rival: 'vs. Teorema',
    date: '08 Sep 2023',
    round: 'Clasificatoria',
  },
  {
    title: 'FMS España Jornada 3',
    rival: 'vs. Skone',
    date: '20 Jun 2023',
    round: 'Clasificatoria',
  },
  {
    title: 'Red Bull Regional',
    rival: 'vs. Errecé',
    date: '14 Abr 2023',
    round: 'Final',
  },
];

const discography = [
  { title: 'Sin Retorno', year: '2023', tone: 'from-purple-500/60 to-fuchsia-500/30' },
  { title: 'Espejo Roto', year: '2023', tone: 'from-sky-500/60 to-blue-500/30' },
  { title: 'Realidad Alterna', year: '2022', tone: 'from-emerald-500/60 to-lime-500/30' },
  { title: 'Nuevo Single', year: '2025', tone: 'from-white/5 to-white/10', muted: true },
];

const shows = [
  {
    date: '15',
    month: 'MAR',
    title: 'Red Bull Batalla',
    location: 'Ciudad de México, CDMX',
    tag: 'Liga Nacional',
    action: 'Comprar Boletos',
  },
  {
    date: '22',
    month: 'ABR',
    title: 'FMS Internacional',
    location: 'Buenos Aires, Argentina',
    tag: 'Festival',
    action: 'Comprar Boletos',
  },
  {
    date: '08',
    month: 'MAY',
    title: 'Showcase Privado',
    location: 'Monterrey, Nuevo León',
    tag: 'Evento Privado',
    note: 'Sin boletos disponibles',
  },
  {
    date: '19',
    month: 'JUN',
    title: 'God Level Fest',
    location: 'Madrid, España',
    tag: 'Festival Internacional',
    action: 'Comprar Boletos',
  },
];

const pressPhotos = [
  { title: 'Foto 1', tone: 'from-slate-600/70 to-slate-900/80' },
  { title: 'Foto 2', tone: 'from-indigo-600/70 to-blue-900/80' },
  { title: 'Foto 3', tone: 'from-orange-500/70 to-rose-900/80' },
];

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white font-sans">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0b0b0d]/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3 text-lg font-semibold tracking-[0.2em]">
            <span className="h-9 w-9 rounded-lg bg-gradient-to-br from-rose-500 via-red-600 to-orange-400" />
            GARZAMF
          </div>
          <div className="hidden items-center gap-6 text-xs font-semibold uppercase tracking-widest text-white/70 md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-2 transition hover:text-white"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </a>
            ))}
          </div>
          <a
            href="#contacto"
            className="rounded-full bg-gradient-to-r from-rose-500 to-red-500 px-4 py-2 text-xs font-semibold uppercase tracking-wider"
          >
            Reserva
          </a>
        </nav>
      </header>

      <main>
        <section id="inicio" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,_rgba(0,0,0,0.9),_rgba(0,0,0,0.6))]" />
          <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center px-6 py-20 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-white/60">Arte urbano · Freestyle · Comunidad</p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white md:text-6xl">
              GARZAMF<br />
              <span className="text-white/70">Be FREE</span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm text-white/70 md:text-base">
              Plataforma oficial para contenido, música y eventos en vivo. Explora el universo creativo de GARZAMF y
              conecta con la comunidad.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#videos"
                className="rounded-full bg-rose-500 px-6 py-3 text-xs font-semibold uppercase tracking-wider"
              >
                Ver Videos
              </a>
              <a
                href="#agenda"
                className="rounded-full border border-white/20 px-6 py-3 text-xs font-semibold uppercase tracking-wider"
              >
                Ver Agenda
              </a>
              <a
                href="#contacto"
                className="rounded-full border border-white/20 px-6 py-3 text-xs font-semibold uppercase tracking-wider"
              >
                Contacto
              </a>
            </div>
          </div>
        </section>

        <section id="videos" className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3 text-sm font-semibold">
                <span className="rounded-full bg-rose-500/20 p-2 text-rose-400">
                  <PlayCircle className="h-4 w-4" />
                </span>
                En Vivo en Twitch
              </div>
              <p className="mt-2 text-xs text-white/50">Offline · Ver último stream</p>
              <div className="mt-6 h-48 rounded-xl bg-gradient-to-br from-purple-900/80 via-purple-600/40 to-black/60" />
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-white/60">Último stream disponible</span>
                <button className="rounded-full bg-rose-500 px-4 py-2 font-semibold">Ver último stream</button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3 text-sm font-semibold">
                <span className="rounded-full bg-rose-500/20 p-2 text-rose-400">
                  <MessageCircle className="h-4 w-4" />
                </span>
                Únete al Nido
              </div>
              <p className="mt-2 text-xs text-white/50">Suscríbete al newsletter y mantente al día con todo el contenido.</p>
              <div className="mt-6 flex flex-col gap-3 md:flex-row">
                <input
                  className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40"
                  placeholder="tu@email.com"
                />
                <button className="rounded-full bg-rose-500 px-6 py-2 text-xs font-semibold uppercase tracking-wider">
                  Suscribirme
                </button>
              </div>
              <div className="mt-6 text-xs text-white/50">Únete también en:</div>
              <div className="mt-3 flex items-center gap-3">
                <span className="rounded-full border border-white/10 p-2">
                  <Twitch className="h-4 w-4" />
                </span>
                <span className="rounded-full border border-white/10 p-2">
                  <MessageCircle className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">Stats de la Comunidad</h3>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase text-white/40">Suscriptores YouTube</p>
                <p className="mt-3 text-3xl font-semibold text-emerald-400">125K</p>
              </div>
              <div>
                <p className="text-xs uppercase text-white/40">Videos Totales</p>
                <p className="mt-3 text-3xl font-semibold text-emerald-400">342</p>
              </div>
            </div>
          </div>
        </section>

        <section id="batallas" className="mx-auto max-w-6xl px-6 py-16">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
              <Swords className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-3xl font-semibold">Archivo de Batallas</h2>
            <p className="mt-2 text-sm text-white/60">Archivo organizado de las batallas más recientes.</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/70">
            <span className="rounded-full border border-white/10 px-4 py-2">Todas las ligas</span>
            <span className="rounded-full border border-white/10 px-4 py-2">Todos los años</span>
            <span className="flex-1 rounded-full border border-white/10 px-4 py-2">Buscar rival...</span>
            <span className="rounded-full border border-white/10 px-4 py-2">Todas las rondas</span>
            <button className="rounded-full bg-rose-500 px-5 py-2 font-semibold text-white">Filtrar</button>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {battleCards.map((battle) => (
              <div key={battle.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="h-28 rounded-xl bg-gradient-to-br from-rose-500/20 to-black/40" />
                <h3 className="mt-4 text-base font-semibold">{battle.title}</h3>
                <p className="mt-2 text-xs text-white/60">{battle.rival}</p>
                <div className="mt-4 flex items-center justify-between text-[10px] text-white/40">
                  <span>{battle.round}</span>
                  <span>{battle.date}</span>
                </div>
                <button className="mt-4 w-full rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold">
                  Ver batalla
                </button>
              </div>
            ))}
          </div>
        </section>

        <section id="musica" className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-semibold">Discografía</h2>
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-8 lg:flex lg:items-center lg:gap-10">
            <div className="h-56 w-full rounded-2xl bg-gradient-to-br from-white/90 to-black/10 lg:w-72" />
            <div className="mt-6 flex-1 lg:mt-0">
              <p className="text-xs text-rose-400">2024</p>
              <h3 className="mt-2 text-2xl font-semibold">Contacto Cero</h3>
              <p className="mt-2 text-sm text-white/60">Disponible en plataformas digitales.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold">Spotify</span>
                <span className="rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold">Apple Music</span>
                <span className="rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold">YouTube Music</span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {discography.map((album) => (
              <div
                key={album.title}
                className={`rounded-2xl border border-white/10 bg-white/5 p-4 ${album.muted ? 'text-white/40' : ''}`}
              >
                <div className={`h-40 rounded-xl bg-gradient-to-br ${album.tone}`} />
                <h4 className="mt-4 text-sm font-semibold">{album.title}</h4>
                <p className="mt-1 text-xs text-rose-400">{album.year}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="agenda" className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex items-center gap-3 text-2xl font-semibold">
            <Calendar className="h-6 w-6 text-rose-400" />
            Próximos Shows
          </div>
          <div className="mt-8 grid gap-6">
            {shows.map((show) => (
              <div key={show.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl border border-rose-500/40 px-4 py-3 text-center">
                      <p className="text-xl font-semibold text-rose-400">{show.date}</p>
                      <p className="text-xs uppercase text-rose-400">{show.month}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{show.title}</h3>
                      <p className="mt-1 text-xs text-white/60">{show.location}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-wider text-white/60">
                        <span className="rounded-full border border-white/10 px-3 py-1">{show.tag}</span>
                        {show.note ? <span className="rounded-full border border-white/10 px-3 py-1">{show.note}</span> : null}
                      </div>
                    </div>
                  </div>
                  {show.action ? (
                    <button className="rounded-full bg-rose-500 px-5 py-2 text-xs font-semibold">
                      {show.action}
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-left text-sm font-semibold">
            Ver eventos pasados
          </button>
        </section>

        <section id="press-kit" className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-semibold">Kit de Prensa</h2>
          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">Bio Corta</h3>
              <p className="mt-2 text-sm text-white/60">
                GARZAMF es un artista urbano emergente que fusiona rap, trap y música experimental con letras crudas y
                auténticas.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">Bio Media</h3>
              <p className="mt-2 text-sm text-white/60">
                GARZAMF ha capturado la atención del público con un estilo que combina rap consciente, trap y elementos
                experimentales. Letras de lucha personal y realidades urbanas se mezclan con producción cinematográfica.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">Bio Completa</h3>
              <p className="mt-2 text-sm text-white/60">
                Artista multifacético con presencia escénica única, colaboraciones internacionales y una comunidad global
                que respalda cada lanzamiento. Su propuesta integra música, visuales y conexión auténtica con su público.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-semibold">Fotos de Prensa</h3>
            <div className="mt-4 grid gap-6 md:grid-cols-3">
              {pressPhotos.map((photo) => (
                <div key={photo.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className={`h-40 rounded-xl bg-gradient-to-br ${photo.tone}`} />
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-white/60">{photo.title}</span>
                    <button className="rounded-full bg-rose-500 px-3 py-1 text-[10px] font-semibold">Descargar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-semibold">Logos</h3>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="grid gap-6 md:grid-cols-3">
                {['SVG Claro', 'PNG Claro', 'SVG Oscuro'].map((label) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                    <div className="mx-auto h-32 w-32 rounded-xl bg-gradient-to-br from-orange-500/60 to-rose-500/60" />
                    <button className="mt-4 rounded-full bg-rose-500 px-3 py-1 text-[10px] font-semibold">
                      {label}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-semibold">Rider Técnico GARZAMF</h4>
                <p className="text-xs text-white/60">Especificaciones técnicas para presentaciones en vivo.</p>
              </div>
              <button className="rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold">Descargar Tech Rider</button>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button className="rounded-full bg-rose-500 px-6 py-3 text-xs font-semibold uppercase tracking-wider">
              Descargar Press Kit Completo
            </button>
          </div>
        </section>

        <section id="contacto" className="mx-auto max-w-6xl px-6 py-16">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <h2 className="text-3xl font-semibold">Contacto</h2>
            <p className="mt-4 text-sm text-white/60">Para booking, colaboraciones o prensa, escríbenos directamente.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <button className="rounded-full bg-rose-500 px-6 py-3 text-xs font-semibold">hello@garzamf.com</button>
              <button className="rounded-full border border-white/10 px-6 py-3 text-xs font-semibold">
                Descarga dossier
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#0b0b0d] px-6 py-12 text-sm text-white/60">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="text-lg font-semibold text-white">GARZAMF</div>
            <p className="mt-4 text-white/60">Be FREE</p>
            <p className="mt-4 text-xs">© 2024 GARZAMF. Todos los derechos reservados.</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white">Enlaces Rápidos</h4>
            <ul className="mt-4 space-y-2 text-xs">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white">Síguenos</h4>
            <div className="mt-4 flex items-center gap-4">
              <Instagram className="h-5 w-5" />
              <Youtube className="h-5 w-5" />
              <Twitch className="h-5 w-5" />
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="mt-6 flex items-center gap-3 text-xs">
              <a href="#" className="hover:text-white">
                Privacidad
              </a>
              <span>•</span>
              <a href="#" className="hover:text-white">
                Términos
              </a>
            </div>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-white/40">Hecho con ♥ en México</p>
      </footer>
    </div>
  );
};

export default App;
