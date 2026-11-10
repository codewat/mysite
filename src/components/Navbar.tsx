import { Code2, Github, Moon, Sun } from 'lucide-react';
import { PROFILE } from '../data/portfolio';

interface NavbarProps {
  darkMode: boolean;
  onToggleTheme: () => void;
}

export function Navbar({ darkMode, onToggleTheme }: NavbarProps) {
  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
        darkMode
          ? 'border-slate-800/80 bg-slate-950/80'
          : 'border-slate-200 bg-white/85'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 via-indigo-500 to-amber-500 text-slate-950 shadow-md">
            <Code2 className="h-5 w-5 stroke-[2.4]" />
          </div>
          <div>
            <span
              className={`font-mono text-sm font-bold tracking-tight ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {PROFILE.brandName}
            </span>
            <p className="text-[11px] text-slate-400">Web &amp; PWA Portfolio</p>
          </div>
        </a>

        <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
          <a
            href="#projects"
            className={`transition ${
              darkMode
                ? 'text-slate-300 hover:text-white'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            Projects
          </a>
          <a
            href="#skills"
            className={`transition ${
              darkMode
                ? 'text-slate-300 hover:text-white'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            Stack
          </a>
          <a
            href="#contact"
            className={`transition ${
              darkMode
                ? 'text-slate-300 hover:text-white'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={PROFILE.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
            title="github.com/codewat"
            className={`rounded-xl border p-2 transition ${
              darkMode
                ? 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
                : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Github className="h-4 w-4" />
          </a>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle color theme"
            className={`rounded-xl border p-2 transition ${
              darkMode
                ? 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
                : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <a
            href="#projects"
            className="rounded-xl bg-sky-500 px-3.5 py-2 text-xs font-bold text-slate-950 transition hover:bg-sky-400 sm:text-sm"
          >
            Explore Apps
          </a>
        </div>
      </div>
    </header>
  );
}
