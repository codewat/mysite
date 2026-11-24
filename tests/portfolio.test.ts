import { describe, expect, it } from 'vitest';
import { PROFILE, PROJECTS } from '../src/data/portfolio';
import { filterProjects } from '../src/utils/filterProjects';
import { mergeLaunches } from '../src/utils/mergeLaunches';

describe('Portfolio Catalog & Filtering', () => {
  it('contains all 7 requested live apps with unique IDs and valid HTTPS URLs', () => {
    expect(PROJECTS).toHaveLength(7);

    const expectedDomains = [
      'songbook-70d57.web.app',
      'kara-ok.onrender.com',
      'massage-clinic.vercel.app',
      'bible-app-five-umber.vercel.app',
      'mangaapp-eta.vercel.app',
      'workout-mocha-zeta.vercel.app',
      'babyshower-iota-lime.vercel.app',
    ];

    const urls = PROJECTS.map((p) => p.url);
    for (const domain of expectedDomains) {
      expect(urls.some((u) => u.includes(domain))).toBe(true);
    }

    const uniqueIds = new Set(PROJECTS.map((p) => p.id));
    expect(uniqueIds.size).toBe(PROJECTS.length);

    expect(PROFILE.location).toBe('Canada');
    expect(PROFILE.githubUrl).toBe('https://github.com/codewat');

    for (const p of PROJECTS) {
      expect(p.url.startsWith('https://')).toBe(true);
      expect(p.repoUrl?.startsWith('https://github.com/codewat/')).toBe(true);
      expect(p.title.length).toBeGreaterThan(2);
      expect(p.highlights.length).toBeGreaterThanOrEqual(2);
      expect(p.previewImage).toMatch(/^\/previews\/[a-z0-9-]+\.png$/);
    }

    const uniquePreviews = new Set(PROJECTS.map((p) => p.previewImage));
    expect(uniquePreviews.size).toBe(PROJECTS.length);
  });

  it('filters projects accurately by platform, category, and search query', () => {
    const vercelApps = filterProjects(PROJECTS, {
      search: '',
      platform: 'Vercel',
      category: 'All',
    });
    expect(vercelApps).toHaveLength(5);

    const firebaseApps = filterProjects(PROJECTS, {
      search: '',
      platform: 'Firebase',
      category: 'All',
    });
    expect(firebaseApps).toHaveLength(1);
    expect(firebaseApps[0].id).toBe('worshipdeck-songbook');

    const renderApps = filterProjects(PROJECTS, {
      search: '',
      platform: 'Render',
      category: 'All',
    });
    expect(renderApps).toHaveLength(1);
    expect(renderApps[0].id).toBe('kara-ok');

    const faithApps = filterProjects(PROJECTS, {
      search: '',
      platform: 'All',
      category: 'Faith & Ministry',
    });
    expect(faithApps).toHaveLength(2);

    const searchWorkout = filterProjects(PROJECTS, {
      search: 'timer',
      platform: 'All',
      category: 'All',
    });
    expect(searchWorkout).toHaveLength(1);
    expect(searchWorkout[0].id).toBe('workoutwork-timer');
  });

  it('merges live Vercel and Render launches and promotes the newest launch', () => {
    const merged = mergeLaunches(
      PROJECTS,
      [
        {
          id: 'prj_mysite',
          name: 'mysite',
          url: 'https://mysite-codewat.vercel.app',
          platform: 'Vercel',
          createdAt: '2026-12-01T00:00:00.000Z',
        },
        {
          id: 'prj_existing_bible',
          name: 'bible-app',
          url: 'https://bible-app-five-umber.vercel.app/',
          platform: 'Vercel',
          createdAt: '2026-09-01T00:00:00.000Z',
          repoUrl: 'https://github.com/codewat/bible-app',
        },
        {
          id: 'srv_render_new',
          name: 'budget-buddy',
          url: 'https://budget-buddy.onrender.com',
          platform: 'Render',
          createdAt: '2026-11-20T10:00:00.000Z',
          coldStartNote: 'Hosted on Render free tier — first visit may take ~20 seconds to wake up.',
        },
        {
          id: 'prj_vercel_newest',
          name: 'choir-scheduler',
          url: 'https://choir-scheduler.vercel.app',
          platform: 'Vercel',
          createdAt: '2026-11-24T12:00:00.000Z',
          framework: 'vite',
          title: 'Choir Scheduler',
        },
      ],
      ['scratch-demo']
    );

    // Excludes `mysite` and does not duplicate curated `bible-app`.
    expect(merged).toHaveLength(PROJECTS.length + 2);
    expect(merged.some((p) => p.domainLabel.includes('mysite'))).toBe(false);

    // Newest launch becomes featured and placed first; WorshipDeck is unfeatured.
    const featured = merged.filter((p) => p.featured);
    expect(featured).toHaveLength(1);
    expect(featured[0].title).toBe('Choir Scheduler');
    expect(featured[0].platform).toBe('Vercel');
    expect(featured[0].category).toBe('Recent Launch');
    expect(merged[0].title).toBe('Choir Scheduler');
    expect(merged[1].title).toBe('Budget Buddy');
    expect(merged[1].platform).toBe('Render');
    expect(
      merged.find((p) => p.id === 'worshipdeck-songbook')?.featured
    ).toBe(false);
  });
});
