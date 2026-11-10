import { ArrowUpRight, Clock, Eye, Globe } from 'lucide-react';
import type { ProjectItem } from '../data/portfolio';
import { ProjectIcon } from './ProjectIcon';

interface ProjectCardProps {
  project: ProjectItem;
  darkMode: boolean;
  onInspect: (project: ProjectItem) => void;
}

export function ProjectCard({ project, darkMode, onInspect }: ProjectCardProps) {
  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-3xl border transition duration-200 hover:-translate-y-1 ${
        darkMode
          ? 'border-slate-800 bg-slate-900/75 hover:border-slate-700 hover:shadow-2xl hover:shadow-sky-500/5'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xl'
      }`}
    >
      {/* Visual Mini Browser Preview Header */}
      <div
        className={`relative border-b bg-gradient-to-br p-5 ${
          project.accentGradient
        } ${darkMode ? 'border-slate-800/80' : 'border-slate-200'}`}
      >
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-slate-950/60 px-2.5 py-1 text-[11px] font-medium text-slate-300 backdrop-blur-sm">
            <Globe className="h-3 w-3 text-sky-400" />
            <span className="max-w-[175px] truncate font-mono">
              {project.domainLabel}
            </span>
          </div>

          <span
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${project.badgeColor}`}
          >
            {project.platform}
          </span>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/65 text-white shadow-lg backdrop-blur-sm">
            <ProjectIcon iconKey={project.iconKey} className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            {project.featured && (
              <span className="mb-1 inline-block rounded-md bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold tracking-wide text-amber-300 uppercase">
                Latest Build
              </span>
            )}
            <h3 className="line-clamp-1 text-base font-bold text-white">
              {project.title}
            </h3>
            <p className="line-clamp-1 text-xs text-slate-300">{project.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <span
              className={`text-[11px] font-semibold tracking-wider uppercase ${
                darkMode ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {project.category}
            </span>
            {project.coldStartNote && (
              <span
                title={project.coldStartNote}
                className="inline-flex items-center gap-1 text-[11px] text-fuchsia-400"
              >
                <Clock className="h-3 w-3" /> Free sleep
              </span>
            )}
          </div>

          <p
            className={`line-clamp-3 text-sm leading-relaxed ${
              darkMode ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            {project.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className={`rounded-lg px-2 py-1 text-[11px] font-medium ${
                  darkMode
                    ? 'bg-slate-800/90 text-slate-300'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div
          className={`mt-5 flex items-center justify-between gap-2 border-t pt-4 ${
            darkMode ? 'border-slate-800/80' : 'border-slate-100'
          }`}
        >
          <button
            type="button"
            onClick={() => onInspect(project)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              darkMode
                ? 'border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-800 hover:text-white'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Details &amp; Preview
          </button>

          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500 px-3.5 py-2 text-xs font-bold text-slate-950 transition hover:bg-sky-400"
          >
            Open Live
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}
