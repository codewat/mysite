import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Copy,
  Github,
  Layers,
  Mail,
  MapPin,
  Search,
  Send,
  Sparkles,
  Terminal,
} from 'lucide-react';
import {
  PROFILE,
  PROJECTS,
  type HostingPlatform,
  type ProjectCategory,
  type ProjectItem,
} from './data/portfolio';
import { filterProjects } from './utils/filterProjects';
import { Navbar } from './components/Navbar';
import { ProjectCard } from './components/ProjectCard';
import { ProjectModal } from './components/ProjectModal';
import FaultyTerminal from './components/FaultyTerminal';

const PLATFORM_FILTERS: Array<HostingPlatform | 'All'> = [
  'All',
  'Vercel',
  'Firebase',
  'Render',
];

const CATEGORY_FILTERS: Array<ProjectCategory | 'All'> = [
  'All',
  'Faith & Ministry',
  'Business & Wellness',
  'Media & Fun',
  'Health & Fitness',
  'Events & Personal',
];

export function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState<HostingPlatform | 'All'>('All');
  const [category, setCategory] = useState<ProjectCategory | 'All'>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const [msgName, setMsgName] = useState('');
  const [msgText, setMsgText] = useState('');

  const featuredProject = PROJECTS.find((p) => p.featured) || PROJECTS[0];

  const visibleProjects = useMemo(
    () => filterProjects(PROJECTS, { search, platform, category }),
    [search, platform, category]
  );

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(PROFILE.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleSendMailto = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Portfolio Inquiry from ${msgName.trim() || 'Visitor'}`
    );
    const body = encodeURIComponent(msgText.trim());
    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div
      id="top"
      className={`relative min-h-screen transition-colors ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Interactive FaultyTerminal Background */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <FaultyTerminal
          tint="#095d4f"
          glyphs="characters"
          scale={3.8}
          digitSize={1.1}
          timeScale={0}
          brightness={0.7}
          glow={0.35}
          persistence={0.14}
          mouseStrength={0.1}
          mouseGlow={0.05}
          curvature={0}
          vignette={0.44}
          clickEffect="glitch"
          scramble={0.2}
          scanlineIntensity={0.15}
          glitchAmount={1}
          flickerAmount={0}
          noiseAmp={1}
          chromaticAberration={0}
          mouseReact
          pageLoadAnimation
          pause={false}
          lightMode={!darkMode}
        />
      </div>

      <Navbar darkMode={darkMode} onToggleTheme={() => setDarkMode((d) => !d)} />

      {/* Hero Section */}
      <section className="relative z-10 overflow-hidden border-b border-slate-800/40">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-[44rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-sky-500/20 via-indigo-500/15 to-amber-500/15 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-22">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {PROFILE.availability}
              </div>

              <h1
                className={`mt-5 text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl ${
                  darkMode ? 'text-white' : 'text-slate-950'
                }`}
              >
                Hi, I&apos;m {PROFILE.fullName}.{' '}
                <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-amber-400 bg-clip-text text-transparent">
                  {PROFILE.headline}
                </span>
              </h1>

              <p
                className={`mt-5 max-w-2xl text-base leading-relaxed sm:text-lg ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {PROFILE.bio}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
                >
                  <Layers className="h-4 w-4" />
                  View All {PROJECTS.length} Live Apps
                </a>
                <a
                  href={PROFILE.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition ${
                    darkMode
                      ? 'border-slate-700 bg-slate-900 text-white hover:bg-slate-800'
                      : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Github className="h-4 w-4" />
                  GitHub (@codewat)
                </a>
                <a
                  href="#contact"
                  className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition ${
                    darkMode
                      ? 'border-slate-700 bg-slate-900 text-white hover:bg-slate-800'
                      : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Mail className="h-4 w-4" />
                  Get in Touch
                </a>
              </div>

              {/* Quick Stats */}
              <div className="mt-9 grid max-w-lg grid-cols-3 gap-4 border-t border-slate-800/40 pt-6">
                <div>
                  <p
                    className={`text-2xl font-extrabold ${
                      darkMode ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    {PROJECTS.length}
                  </p>
                  <p className="text-xs text-slate-400">Live Deployed Apps</p>
                </div>
                <div>
                  <p
                    className={`text-2xl font-extrabold ${
                      darkMode ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    3
                  </p>
                  <p className="text-xs text-slate-400">Cloud Hosts (Vercel / Firebase / Render)</p>
                </div>
                <div>
                  <p
                    className={`text-2xl font-extrabold ${
                      darkMode ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    100%
                  </p>
                  <p className="text-xs text-slate-400">Mobile Responsive</p>
                </div>
              </div>
            </div>

            {/* Featured Spotlight Card */}
            <div className="lg:col-span-5">
              <div
                className={`rounded-3xl border p-6 shadow-2xl ${
                  darkMode
                    ? 'border-amber-500/30 bg-gradient-to-b from-slate-900 to-slate-950'
                    : 'border-amber-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-400">
                    <Sparkles className="h-3.5 w-3.5" />
                    Newest Launch
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    {featuredProject.platform}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProject(featuredProject)}
                  className="group relative mt-4 block w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-left shadow-lg"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden">
                    <img
                      src={featuredProject.previewImage}
                      alt={`${featuredProject.title} live UI preview`}
                      className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                </button>

                <h2
                  className={`mt-4 text-xl font-bold ${
                    darkMode ? 'text-white' : 'text-slate-950'
                  }`}
                >
                  {featuredProject.title}
                </h2>
                <p
                  className={`mt-2 text-sm leading-relaxed ${
                    darkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {featuredProject.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {featuredProject.techStack.map((tech) => (
                    <span
                      key={tech}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                        darkMode
                          ? 'bg-slate-800 text-slate-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2.5">
                  <a
                    href={featuredProject.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-amber-400"
                  >
                    Launch App
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelectedProject(featuredProject)}
                    className={`rounded-xl border px-4 py-2.5 text-xs font-semibold transition ${
                      darkMode
                        ? 'border-slate-700 bg-slate-800 text-white hover:bg-slate-700'
                        : 'border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="font-mono text-xs font-semibold tracking-wider text-sky-400 uppercase">
              Deployed Portfolio
            </span>
            <h2
              className={`mt-1 text-2xl font-extrabold sm:text-3xl ${
                darkMode ? 'text-white' : 'text-slate-950'
              }`}
            >
              Featured Live Applications
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Click any app to inspect highlights, preview inline, or launch it live.
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search apps or tech stack..."
              className={`w-full rounded-2xl border py-2.5 pr-4 pl-10 text-sm outline-none transition focus:border-sky-500 ${
                darkMode
                  ? 'border-slate-800 bg-slate-900 text-white placeholder-slate-500'
                  : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  category === cat
                    ? 'bg-sky-500 text-slate-950'
                    : darkMode
                      ? 'border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div
            className={`inline-flex self-start rounded-xl border p-1 text-xs font-medium ${
              darkMode
                ? 'border-slate-800 bg-slate-900'
                : 'border-slate-200 bg-white'
            }`}
          >
            {PLATFORM_FILTERS.map((host) => (
              <button
                key={host}
                type="button"
                onClick={() => setPlatform(host)}
                className={`rounded-lg px-3 py-1 transition ${
                  platform === host
                    ? darkMode
                      ? 'bg-slate-800 text-sky-300'
                      : 'bg-slate-900 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {host}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {visibleProjects.length === 0 ? (
          <div
            className={`mt-10 rounded-3xl border border-dashed p-10 text-center ${
              darkMode
                ? 'border-slate-800 bg-slate-900/40'
                : 'border-slate-300 bg-white'
            }`}
          >
            <p className="text-sm font-medium text-slate-400">
              No projects match your current filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setPlatform('All');
                setCategory('All');
              }}
              className="mt-3 rounded-xl bg-sky-500 px-4 py-2 text-xs font-bold text-slate-950"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                darkMode={darkMode}
                onInspect={setSelectedProject}
              />
            ))}
          </div>
        )}
      </section>

      {/* Skills & Architecture Section */}
      <section
        id="skills"
        className={`relative z-10 border-y py-16 backdrop-blur-[2px] ${
          darkMode
            ? 'border-slate-800/70 bg-slate-900/35'
            : 'border-slate-200 bg-slate-100/70'
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-sky-400 uppercase">
            <Terminal className="h-4 w-4" />
            Capabilities &amp; Stack
          </div>
          <h2
            className={`mt-1 text-2xl font-extrabold sm:text-3xl ${
              darkMode ? 'text-white' : 'text-slate-950'
            }`}
          >
            Tools Behind These Apps
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {PROFILE.skills.map((group) => (
              <div
                key={group.group}
                className={`rounded-3xl border p-6 ${
                  darkMode
                    ? 'border-slate-800 bg-slate-900/80'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <h3
                  className={`text-base font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {group.group}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-medium ${
                        darkMode
                          ? 'border-slate-700/80 bg-slate-950 text-slate-300'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div
          className={`grid gap-8 rounded-3xl border p-6 sm:p-10 lg:grid-cols-12 ${
            darkMode
              ? 'border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950'
              : 'border-slate-200 bg-white shadow-sm'
          }`}
        >
          <div className="lg:col-span-5">
            <span className="font-mono text-xs font-semibold tracking-wider text-sky-400 uppercase">
              Let&apos;s Work Together
            </span>
            <h2
              className={`mt-2 text-2xl font-extrabold sm:text-3xl ${
                darkMode ? 'text-white' : 'text-slate-950'
              }`}
            >
              Have an app idea or need a custom web build?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Whether it&apos;s a church tool, business booking site, or interactive web
              application, send a message anytime.
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-2.5 text-slate-300">
                <MapPin className="h-4 w-4 text-sky-400" />
                <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
                  {PROFILE.location}
                </span>
              </div>

              <div>
                <a
                  href={PROFILE.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-sm font-medium text-sky-400 hover:underline"
                >
                  <Github className="h-4 w-4" />
                  github.com/codewat
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="inline-flex items-center gap-2 font-mono text-sm font-medium text-sky-400 hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  {PROFILE.email}
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium ${
                    darkMode
                      ? 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
                      : 'border-slate-200 bg-slate-100 text-slate-700'
                  }`}
                >
                  {copiedEmail ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSendMailto} className="space-y-4 lg:col-span-7">
            <div>
              <label
                className={`mb-1.5 block text-xs font-semibold ${
                  darkMode ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Your Name
              </label>
              <input
                type="text"
                required
                value={msgName}
                onChange={(e) => setMsgName(e.target.value)}
                placeholder="Juan Dela Cruz"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-sky-500 ${
                  darkMode
                    ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-500'
                    : 'border-slate-300 bg-slate-50 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label
                className={`mb-1.5 block text-xs font-semibold ${
                  darkMode ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Project Details / Message
              </label>
              <textarea
                rows={4}
                required
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                placeholder="Tell me about the website or app you want to build..."
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-sky-500 ${
                  darkMode
                    ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-500'
                    : 'border-slate-300 bg-slate-50 text-slate-900'
                }`}
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-sky-400"
            >
              <Send className="h-4 w-4" />
              Send Email Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/40 py-8 text-center text-xs text-slate-500">
        <p>
          &copy; {new Date().getFullYear()} {PROFILE.fullName} ({PROFILE.brandName}). Built
          with React, TypeScript &amp; Tailwind CSS.
        </p>
      </footer>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}

export default App;
