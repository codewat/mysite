import { PROJECTS } from '../src/data/portfolio';
import {
  formatProjectTitle,
  mergeLaunches,
  normalizeDomain,
  normalizeRepo,
  type RemoteLaunch,
} from '../src/utils/mergeLaunches';

declare const process: {
  env: Record<string, string | undefined>;
};

interface VercelDeploymentSummary {
  target?: string | null;
  readyState?: string;
  state?: string;
  alias?: string[];
  url?: string;
  createdAt?: number;
}

interface VercelProjectResponse {
  id: string;
  name: string;
  framework?: string | null;
  createdAt?: number;
  targets?: {
    production?: {
      alias?: string[];
      url?: string;
    };
  };
  latestDeployments?: VercelDeploymentSummary[];
  link?: {
    type?: string;
    org?: string;
    repo?: string;
  };
}

interface RenderServiceResponse {
  service?: {
    id: string;
    name: string;
    type?: string;
    repo?: string;
    createdAt?: string;
    suspended?: string;
    url?: string;
    serviceDetails?: {
      url?: string;
      env?: string;
      plan?: string;
    };
  };
}

function isDeploymentReady(d: VercelDeploymentSummary): boolean {
  const status = d.readyState || d.state;
  return status === 'READY';
}

function pickVercelLiveUrl(project: VercelProjectResponse): string | null {
  const prodTargetAliases = project.targets?.production?.alias ?? [];
  const latestReadyProd = project.latestDeployments?.find(
    (d) => d.target === 'production' && isDeploymentReady(d)
  );
  const latestAnyReady = project.latestDeployments?.find((d) => isDeploymentReady(d));

  const candidates = [
    ...prodTargetAliases,
    ...(latestReadyProd?.alias ?? []),
    project.targets?.production?.url,
    latestReadyProd?.url,
    ...(latestAnyReady?.alias ?? []),
    latestAnyReady?.url,
  ].filter((value): value is string => Boolean(value));

  if (candidates.length === 0) return null;

  // Prefer custom domain or clean `<project>.vercel.app` over git-branch preview aliases.
  const preferred =
    candidates.find((host) => !host.includes('-git-') && !host.endsWith('.vercel.app')) ||
    candidates.find((host) => !host.includes('-git-')) ||
    candidates[0];

  return preferred.startsWith('http') ? preferred : `https://${preferred}`;
}

function buildGithubUrl(link?: VercelProjectResponse['link']): string | undefined {
  if (!link || link.type !== 'github' || !link.repo) return undefined;
  if (link.repo.includes('/')) return `https://github.com/${link.repo}`;
  if (link.org) return `https://github.com/${link.org}/${link.repo}`;
  return undefined;
}

async function fetchVercelProjectsForScope(
  token: string,
  teamId?: string
): Promise<VercelProjectResponse[]> {
  const params = new URLSearchParams({ limit: '100' });
  if (teamId) params.set('teamId', teamId);

  const res = await fetch(`https://api.vercel.com/v9/projects?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) {
    throw new Error(`Vercel API error (${res.status}) for scope ${teamId || 'personal'}`);
  }

  const data = (await res.json()) as { projects?: VercelProjectResponse[] };
  return data.projects ?? [];
}

async function fetchAccessibleVercelTeamIds(token: string): Promise<string[]> {
  try {
    const res = await fetch('https://api.vercel.com/v2/teams?limit=20', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { teams?: Array<{ id?: string }> };
    return (data.teams ?? []).map((t) => t.id).filter((id): id is string => Boolean(id));
  } catch {
    return [];
  }
}

async function fetchVercelLaunches(
  token?: string,
  configuredTeamId?: string
): Promise<{ launches: RemoteLaunch[]; skipped: string[] }> {
  if (!token) return { launches: [], skipped: [] };

  const teamIds = new Set<string>();
  if (configuredTeamId) teamIds.add(configuredTeamId);

  const discoveredTeams = await fetchAccessibleVercelTeamIds(token);
  for (const id of discoveredTeams) {
    teamIds.add(id);
  }

  // Query personal scope (undefined) + all accessible teams in parallel.
  const scopeList: Array<string | undefined> = [undefined, ...teamIds];
  const scopeResults = await Promise.allSettled(
    scopeList.map((scopeId) => fetchVercelProjectsForScope(token, scopeId))
  );

  const seenProjectIds = new Set<string>();
  const allProjects: VercelProjectResponse[] = [];
  let anySucceeded = false;
  let lastError: unknown = null;

  for (const result of scopeResults) {
    if (result.status === 'fulfilled') {
      anySucceeded = true;
      for (const project of result.value) {
        if (!seenProjectIds.has(project.id)) {
          seenProjectIds.add(project.id);
          allProjects.push(project);
        }
      }
    } else {
      lastError = result.reason;
    }
  }

  if (!anySucceeded && lastError) {
    throw lastError;
  }

  const launches: RemoteLaunch[] = [];
  const skipped: string[] = [];

  for (const project of allProjects) {
    const url = pickVercelLiveUrl(project);
    if (!url || !project.createdAt) {
      skipped.push(project.name);
      continue;
    }

    launches.push({
      id: project.id,
      name: project.name,
      url,
      platform: 'Vercel',
      createdAt: new Date(project.createdAt).toISOString(),
      repoUrl: buildGithubUrl(project.link),
      framework: project.framework ?? undefined,
    });
  }

  return { launches, skipped };
}

async function fetchRenderLaunches(
  apiKey?: string
): Promise<{ launches: RemoteLaunch[]; skipped: string[] }> {
  if (!apiKey) return { launches: [], skipped: [] };

  const res = await fetch('https://api.render.com/v1/services?limit=100', {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) {
    throw new Error(`Render API error: ${res.status}`);
  }

  const items = (await res.json()) as RenderServiceResponse[];
  const launches: RemoteLaunch[] = [];
  const skipped: string[] = [];

  for (const entry of items) {
    const service = entry.service;
    if (!service) continue;
    if (service.suspended === 'suspended') {
      skipped.push(`${service.name} (suspended)`);
      continue;
    }
    const url = service.serviceDetails?.url || service.url;
    if (!url || !url.startsWith('https://')) {
      skipped.push(`${service.name} (no public URL)`);
      continue;
    }

    const isFree = service.serviceDetails?.plan === 'free';
    launches.push({
      id: service.id,
      name: service.name,
      url,
      platform: 'Render',
      createdAt: service.createdAt || new Date().toISOString(),
      repoUrl: service.repo || undefined,
      framework: service.serviceDetails?.env || service.type || undefined,
      coldStartNote: isFree
        ? 'Hosted on Render free tier — first visit may take ~20 seconds to wake up.'
        : undefined,
    });
  }

  return { launches, skipped };
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function extractMetaContent(html: string, key: string): string | undefined {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:name|property)=["']${escaped}["'][^>]+content=["']([^"']+)["']`,
      'i'
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${escaped}["']`,
      'i'
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeHtmlEntities(match[1]);
  }
  return undefined;
}

const GENERIC_TITLES = new Set([
  'vite + react + ts',
  'vite + react',
  'react app',
  'create next app',
  'document',
  'home',
]);

async function enrichNewLaunch(launch: RemoteLaunch): Promise<RemoteLaunch> {
  try {
    const res = await fetch(launch.url, {
      headers: { Accept: 'text/html' },
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return launch;

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return launch;

    const html = (await res.text()).slice(0, 65_000);
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const rawTitle = titleMatch?.[1] ? decodeHtmlEntities(titleMatch[1]) : undefined;
    const ogTitle = extractMetaContent(html, 'og:title');
    const chosenTitle = ogTitle || rawTitle;

    const title =
      chosenTitle && !GENERIC_TITLES.has(chosenTitle.toLowerCase())
        ? chosenTitle
        : formatProjectTitle(launch.name);

    const description =
      extractMetaContent(html, 'description') ||
      extractMetaContent(html, 'og:description');

    const rawOgImage = extractMetaContent(html, 'og:image');
    let previewImage: string | undefined;
    if (rawOgImage) {
      try {
        previewImage = new URL(rawOgImage, launch.url).toString();
      } catch {
        previewImage = undefined;
      }
    }

    return {
      ...launch,
      title,
      description,
      previewImage,
    };
  } catch {
    return launch;
  }
}

export async function GET(request: Request): Promise<Response> {
  const vercelToken = process.env.VERCEL_TOKEN?.trim();
  const vercelTeamId = process.env.VERCEL_TEAM_ID?.trim();
  const renderApiKey = process.env.RENDER_API_KEY?.trim();
  const excludedNames = (process.env.EXCLUDED_PROJECTS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const sources = {
    vercel: Boolean(vercelToken),
    render: Boolean(renderApiKey),
  };

  const remoteLaunches: RemoteLaunch[] = [];
  let vercelCount = 0;
  let renderCount = 0;
  let vercelError: string | null = null;
  let renderError: string | null = null;
  let skippedVercelProjects: string[] = [];
  let skippedRenderServices: string[] = [];

  const [vercelResult, renderResult] = await Promise.allSettled([
    fetchVercelLaunches(vercelToken, vercelTeamId),
    fetchRenderLaunches(renderApiKey),
  ]);

  if (vercelResult.status === 'fulfilled') {
    vercelCount = vercelResult.value.launches.length;
    skippedVercelProjects = vercelResult.value.skipped;
    remoteLaunches.push(...vercelResult.value.launches);
  } else {
    vercelError =
      vercelResult.reason instanceof Error
        ? vercelResult.reason.message
        : String(vercelResult.reason);
    console.error('Failed to fetch Vercel projects:', vercelResult.reason);
  }

  if (renderResult.status === 'fulfilled') {
    renderCount = renderResult.value.launches.length;
    skippedRenderServices = renderResult.value.skipped;
    remoteLaunches.push(...renderResult.value.launches);
  } else {
    renderError =
      renderResult.reason instanceof Error
        ? renderResult.reason.message
        : String(renderResult.reason);
    console.error('Failed to fetch Render services:', renderResult.reason);
  }

  // Enrich only newly discovered apps (skip curated projects and excluded names).
  const curatedDomains = new Set(PROJECTS.map((p) => normalizeDomain(p.url)));
  const curatedRepos = new Set(
    PROJECTS.map((p) => normalizeRepo(p.repoUrl)).filter(Boolean)
  );
  const exclusionSet = new Set([
    'mysite',
    'mysite-portfolio',
    ...excludedNames.map((n) => n.toLowerCase()),
  ]);

  const enrichedLaunches = await Promise.all(
    remoteLaunches.map((launch) => {
      const domain = normalizeDomain(launch.url);
      const repo = normalizeRepo(launch.repoUrl);
      const isExcluded =
        exclusionSet.has(launch.name.toLowerCase()) || exclusionSet.has(domain);
      const isAlreadyCurated =
        curatedDomains.has(domain) ||
        (repo && curatedRepos.has(repo)) ||
        PROJECTS.some((p) => p.id.toLowerCase() === launch.name.toLowerCase());

      if (isExcluded || isAlreadyCurated) {
        return Promise.resolve(launch);
      }
      return enrichNewLaunch(launch);
    })
  );

  const projects = mergeLaunches(PROJECTS, enrichedLaunches, excludedNames);
  const forceFresh = new URL(request.url).searchParams.get('fresh') === '1';

  return Response.json(
    {
      projects,
      sources,
      diagnostics: {
        vercelCount,
        renderCount,
        vercelError,
        renderError,
        skippedVercelProjects,
        skippedRenderServices,
      },
      syncedAt: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': forceFresh
          ? 'no-store'
          : 'public, s-maxage=15, stale-while-revalidate=30',
      },
    }
  );
}
