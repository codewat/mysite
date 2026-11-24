import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import type { ProjectItem } from '../data/portfolio';
import { ProjectIcon } from './ProjectIcon';

interface PreviewImageProps {
  project: ProjectItem;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function PreviewImage({
  project,
  alt,
  className = 'h-full w-full object-cover object-top',
  loading = 'lazy',
}: PreviewImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [project.previewImage]);

  if (failed || !project.previewImage) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br p-6 text-center ${project.accentGradient}`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-slate-950/70 text-white shadow-lg">
          <ProjectIcon iconKey={project.iconKey} className="h-6 w-6" />
        </div>
        <p className="mt-3 line-clamp-1 text-sm font-bold text-white">{project.title}</p>
        <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-white/15 bg-slate-950/60 px-2.5 py-0.5 font-mono text-[11px] text-slate-300">
          <Globe className="h-3 w-3 text-sky-400" />
          {project.domainLabel}
        </span>
      </div>
    );
  }

  return (
    <img
      src={project.previewImage}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
