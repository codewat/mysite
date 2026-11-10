import { describe, expect, it } from 'vitest';
import { PROJECTS } from '../src/data/portfolio';
import { filterProjects } from '../src/utils/filterProjects';

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

    for (const p of PROJECTS) {
      expect(p.url.startsWith('https://')).toBe(true);
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
});
