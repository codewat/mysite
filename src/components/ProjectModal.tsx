import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Monitor,
  X,
} from 'lucide-react';
import type { ProjectItem } from '../data/portfolio';
import { ProjectIcon } from './ProjectIcon';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [tab, setTab] = useState<'overview' | 'live'>('overview');

  useEffect(() => {
    setTab('overview');
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl"
      >
        {/* Header */}
        <div
          className={`flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-gradient-to-r p-5 ${project.accentGradient}`}
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-slate-950/70 text-white">
              <ProjectIcon iconKey={project.iconKey} className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-white">{project.title}</h2>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${project.badgeColor}`}
                >
                  {project.platform}
                </span>
              </div>
              <p className="font-mono text-xs text-slate-300">{project.url}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-sky-400"
            >
              Visit Live App
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-950/60 p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-5 py-2.5">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTab('overview')}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                tab === 'overview'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Overview &amp; Highlights
            </button>
            <button
              type="button"
              onClick={() => setTab('live')}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                tab === 'live'
                  ? 'bg-slate-800 text-sky-300'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              Live Frame Preview
            </button>
          </div>

          <span className="hidden text-xs text-slate-400 sm:inline">
            {project.category}
          </span>
        </div>

        {/* Body */}
        {tab === 'overview' ? (
          <div className="flex-1 space-y-5 overflow-y-auto p-6">
            <div>
              <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                About This App
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                {project.description}
              </p>
              {project.coldStartNote && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-2 text-xs text-fuchsia-200">
                  <Clock className="h-4 w-4 shrink-0" />
                  {project.coldStartNote}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Key Features
              </h3>
              <ul className="mt-2.5 space-y-2">
                {project.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-slate-200"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Tech &amp; Infrastructure
              </h3>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-[65vh] flex-col bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2 text-xs text-slate-400">
              <span>
                If a host blocks embedded previews or takes a moment to wake up, open it
                directly in a new tab.
              </span>
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-1 font-semibold text-sky-400 hover:underline"
              >
                Open Tab <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <iframe
              src={project.url}
              title={project.title}
              className="h-full w-full flex-1 bg-white"
            />
          </div>
        )}
      </div>
    </div>
  );
}
