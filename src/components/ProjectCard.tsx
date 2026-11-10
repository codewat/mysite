import { ArrowUpRight, Clock, Eye, Github, Globe, Maximize2 } from 'lucide-react';
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
      {/* Visual Mini Browser Preview */}
      <button
        type="button"
        onClick={() => onInspect(project)}
        className={`relative block w-full overflow-hidden border-b text-left ${
          darkMode ? 'border-slate-800/80 bg-slate-950' : 'border-slate-200 bg-slate-100'
        }`}
      >
        {/* Browser Chrome Bar */}
        <div
          className={`flex items-center justify-between gap-2 border-b px-3.5 py-2 ${
            darkMode
              ? 'border-slate-800 bg-slate-950/95'
              : 'border-slate-200 bg-slate-100'
          }`}
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="hidden items-center gap-1 sm:inline-flex" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-rose-400/75" />
              <span className="h-2 w-2 rounded-full bg-amber-400/75" />
              <span className="h-2 w-2 rounded-full bg-emerald-400/75" />
            </span>
            <div
              className={`flex min-w-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                darkMode
                  ? 'bg-slate-900 text-slate-300'
                  : 'border border-slate-200 bg-white text-slate-600'
              }`}
            >
              <Globe className="h-3 w-3 shrink-0 text-sky-400" />
              <span className="truncate font-mono">{project.domainLabel}</span>
            </div>
          </div>

          <span
            className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${project.badgeColor}`}
          >
            {project.platform}
          </span>
        </div>

        {/* Real App Screenshot */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
          <img
            src={project.previewImage}
            alt={`${project.title} live app preview`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.03]"
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          {project.featured && (
            <span className="absolute top-2.5 left-2.5 rounded-full border border-amber-400/40 bg-slate-950/85 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-300 uppercase backdrop-blur-sm">
              Latest Build
            </span>
          )}

          <span className="absolute right-2.5 bottom-2.5 inline-flex items-center gap-1 rounded-full border border-white/15 bg-slate-950/80 px-2.5 py-1 text-[11px] font-semibold text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
            <Maximize2 className="h-3 w-3 text-sky-400" />
            Enlarge Preview
          </span>
        </div>
      </button>

      {/* Title & Body */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br ${
                project.accentGradient
              } ${
                darkMode
                  ? 'border-slate-700/80 text-white'
                  : 'border-slate-200 text-slate-900'
              }`}
            >
              <ProjectIcon iconKey={project.iconKey} className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
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
                    className="inline-flex shrink-0 items-center gap-1 text-[11px] text-fuchsia-400"
                  >
                    <Clock className="h-3 w-3" /> Free sleep
                  </span>
                )}
              </div>

              <h3
                className={`mt-0.5 line-clamp-1 text-base font-bold ${
                  darkMode ? 'text-white' : 'text-slate-950'
                }`}
              >
                {project.title}
              </h3>
              <p
                className={`line-clamp-1 text-xs ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {project.subtitle}
              </p>
            </div>
          </div>

          <p
            className={`mt-3.5 line-clamp-3 text-sm leading-relaxed ${
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

          <div className="flex items-center gap-1.5">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} GitHub repository`}
                title="View source code on GitHub"
                className={`inline-flex items-center justify-center rounded-xl border p-2 transition ${
                  darkMode
                    ? 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Github className="h-3.5 w-3.5" />
              </a>
            )}
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
      </div>
    </article>
  );
}
