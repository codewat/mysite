import type { HostingPlatform, ProjectItem } from '../data/portfolio';

export interface RemoteLaunch {
  id: string;
  name: string;
  url: string;
  platform: Extract<HostingPlatform, 'Vercel' | 'Render'>;
  createdAt: string;
  repoUrl?: string;
  framework?: string;
  title?: string;
  description?: string;
  previewImage?: string;
  coldStartNote?: string;
}

const DEFAULT_EXCLUDED_NAMES = new Set(['mysite', 'mysite-portfolio']);

/** Normalize a URL or hostname into a lowercase bare domain for matching. */
export function normalizeDomain(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
    .split('?')[0];
}

/** Normalize a GitHub repo URL into `owner/repo` lowercase form. */
export function normalizeRepo(input?: string): string {
  if (!input) return '';
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/github\.com\//, '')
    .replace(/\.git$/, '')
    .replace(/\/+$/, '');
}

/** Turn a slug like `my-new-app` into `My New App`. */
export function formatProjectTitle(slug: string): string {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

/** Build a `ProjectItem` from a newly discovered Vercel or Render deployment. */
export function remoteLaunchToProjectItem(launch: RemoteLaunch): ProjectItem {
  const domainLabel = normalizeDomain(launch.url);
  const title = launch.title?.trim() || formatProjectTitle(launch.name);
  const isRender = launch.platform === 'Render';

  const techStack = [
    launch.framework ? formatProjectTitle(launch.framework) : 'Web Application',
    launch.platform,
    'Auto-Synced Launch',
  ];

  const highlights = [
    `Automatically synced from ${launch.platform} on ${new Date(
      launch.createdAt
    ).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}`,
    `Live deployment accessible at ${domainLabel}`,
    ...(launch.repoUrl
      ? [`Source repository connected at ${normalizeRepo(launch.repoUrl)}`]
      : []),
  ];

  return {
    id: `${launch.platform.toLowerCase()}-${launch.id}`,
    title,
    subtitle: `${launch.platform} Live Launch`,
    description:
      launch.description?.trim() ||
      `Newly deployed ${launch.platform} application (${domainLabel}), automatically synced to this portfolio as a live launch.`,
    url: launch.url,
    repoUrl: launch.repoUrl,
    domainLabel,
    platform: launch.platform,
    category: 'Recent Launch',
    previewImage:
      launch.previewImage ||
      `https://s.wordpress.com/mshots/v1/${encodeURIComponent(launch.url)}?w=1200`,
    createdAt: launch.createdAt,
    isAutoSynced: true,
    coldStartNote: launch.coldStartNote,
    highlights,
    techStack,
    accentGradient: isRender
      ? 'from-fuchsia-500/25 via-purple-500/10 to-slate-900'
      : 'from-sky-500/25 via-indigo-500/10 to-slate-900',
    badgeColor: isRender
      ? 'text-fuchsia-300 bg-fuchsia-500/15 border-fuchsia-500/30'
      : 'text-sky-300 bg-sky-500/15 border-sky-500/30',
    iconKey: 'rocket',
  };
}

function isCuratedMatch(curated: ProjectItem, remote: RemoteLaunch): boolean {
  const curatedDomain = normalizeDomain(curated.url);
  const remoteDomain = normalizeDomain(remote.url);
  if (curatedDomain && curatedDomain === remoteDomain) return true;

  const curatedRepo = normalizeRepo(curated.repoUrl);
  const remoteRepo = normalizeRepo(remote.repoUrl);
  if (curatedRepo && remoteRepo && curatedRepo === remoteRepo) return true;

  return curated.id.toLowerCase() === remote.name.toLowerCase();
}

/**
 * Merge curated projects with live Vercel/Render launches.
 * Any newly created app (or app newer than the baseline featured project)
 * automatically becomes the sole `featured` ("Newest Launch") item.
 */
export function mergeLaunches(
  curatedProjects: ProjectItem[],
  remoteLaunches: RemoteLaunch[],
  excludedNames: string[] = []
): ProjectItem[] {
  const exclusions = new Set([
    ...DEFAULT_EXCLUDED_NAMES,
    ...excludedNames.map((n) => n.trim().toLowerCase()).filter(Boolean),
  ]);

  const filteredRemote = remoteLaunches.filter((remote) => {
    const name = remote.name.trim().toLowerCase();
    const domain = normalizeDomain(remote.url);
    return !exclusions.has(name) && !exclusions.has(domain);
  });

  const clonedCurated: ProjectItem[] = curatedProjects.map((item) => ({
    ...item,
    highlights: [...item.highlights],
    techStack: [...item.techStack],
  }));

  const newItems: ProjectItem[] = [];

  for (const remote of filteredRemote) {
    const match = clonedCurated.find((c) => isCuratedMatch(c, remote));
    if (match) {
      // Preserve curated copy/screenshots; attach createdAt only if not already set.
      if (!match.createdAt) {
        match.createdAt = remote.createdAt;
      }
    } else {
      newItems.push(remoteLaunchToProjectItem(remote));
    }
  }

  newItems.sort(
    (a, b) =>
      Date.parse(b.createdAt || '1970-01-01T00:00:00.000Z') -
      Date.parse(a.createdAt || '1970-01-01T00:00:00.000Z')
  );

  const combined = [...newItems, ...clonedCurated];
  if (combined.length === 0) return combined;

  // Determine the newest launch by createdAt among items that have a timestamp.
  let newestIndex = -1;
  let newestMs = -Infinity;

  combined.forEach((item, index) => {
    if (!item.createdAt) return;
    const ms = Date.parse(item.createdAt);
    if (!Number.isNaN(ms) && ms > newestMs) {
      newestMs = ms;
      newestIndex = index;
    }
  });

  if (newestIndex >= 0) {
    return combined.map((item, index) => ({
      ...item,
      featured: index === newestIndex,
    }));
  }

  return combined;
}
