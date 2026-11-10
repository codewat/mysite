export type HostingPlatform = 'Firebase' | 'Vercel' | 'Render';

export type ProjectCategory =
  | 'Faith & Ministry'
  | 'Media & Fun'
  | 'Business & Wellness'
  | 'Health & Fitness'
  | 'Events & Personal';

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  url: string;
  domainLabel: string;
  platform: HostingPlatform;
  category: ProjectCategory;
  featured?: boolean;
  coldStartNote?: string;
  highlights: string[];
  techStack: string[];
  accentGradient: string;
  badgeColor: string;
  iconKey: 'music' | 'mic' | 'spa' | 'book' | 'sparkles' | 'dumbbell' | 'heart';
}

export interface DeveloperProfile {
  brandName: string;
  fullName: string;
  role: string;
  location: string;
  headline: string;
  bio: string;
  email: string;
  availability: string;
  skills: { group: string; items: string[] }[];
}

export const PROFILE: DeveloperProfile = {
  brandName: 'onin.dev',
  fullName: 'Onin',
  role: 'Full-Stack Web & PWA Builder',
  location: 'Philippines',
  headline: 'Building practical, fast, and offline-ready web apps for real life.',
  bio: 'I design and ship focused web applications — from church worship songbooks and faith companions to booking portals, media readers, and workout timers — deployed across Firebase, Vercel, and Render.',
  email: 'oninninoonin@gmail.com',
  availability: 'Open for freelance builds & web app collaborations',
  skills: [
    {
      group: 'Frontend & PWA',
      items: ['React', 'TypeScript', 'Next.js / Vite', 'Tailwind CSS', 'Offline-First IndexedDB', 'Service Workers'],
    },
    {
      group: 'Backend & Cloud',
      items: ['Firebase Firestore', 'Firebase Hosting', 'Vercel', 'Render', 'REST & Realtime Sync'],
    },
    {
      group: 'Product Focus',
      items: ['Mobile-First UX', 'Church & Community Tools', 'Booking & Business Sites', 'Interactive Media Apps'],
    },
  ],
};

export const PROJECTS: ProjectItem[] = [
  {
    id: 'worshipdeck-songbook',
    title: 'WorshipDeck — Church Chords & Lyrics',
    subtitle: 'Offline-First Worship Songbook PWA',
    description:
      'Built for church worship teams to store PDF chord charts and lyric images directly on their devices for zero-internet stage use, with automatic Firestore cloud sync across bandmates.',
    url: 'https://songbook-70d57.web.app',
    domainLabel: 'songbook-70d57.web.app',
    platform: 'Firebase',
    category: 'Faith & Ministry',
    featured: true,
    highlights: [
      'Default 1. Chords and 2. Lyrics folders plus custom folders & Sunday setlist playlists',
      'True offline PDF & image storage in IndexedDB with built-in PDF.js canvas viewer',
      'Stage Mode with dark-sheet invert, Keep Screen Awake, and pedal-friendly Prev/Next navigation',
      'Real-time cross-device updates powered by Cloud Firestore',
    ],
    techStack: ['React', 'TypeScript', 'Vite PWA', 'IndexedDB', 'PDF.js', 'Firebase Firestore'],
    accentGradient: 'from-amber-500/25 via-orange-500/10 to-slate-900',
    badgeColor: 'text-amber-300 bg-amber-500/15 border-amber-500/30',
    iconKey: 'music',
  },
  {
    id: 'catholic-holy-bible',
    title: 'Catholic Holy Bible | 73 Books & Prayers',
    subtitle: 'Complete Faith & Prayer Companion',
    description:
      'A comprehensive Catholic Bible web application featuring all 73 books (Douay-Rheims Version), Holy Rosary, Divine Mercy Chaplet, daily prayers, mood guidance, and Audio Bible.',
    url: 'https://bible-app-five-umber.vercel.app/',
    domainLabel: 'bible-app-five-umber.vercel.app',
    platform: 'Vercel',
    category: 'Faith & Ministry',
    highlights: [
      'Full 73-book Catholic Canon in Douay-Rheims Version',
      'Guided Holy Rosary, Divine Mercy, and Daily Catholic Prayers',
      'Mood-based scripture guidance and Audio Bible playback',
    ],
    techStack: ['React', 'Next.js / Web', 'Audio Playback', 'Responsive UI', 'Vercel'],
    accentGradient: 'from-sky-500/25 via-indigo-500/10 to-slate-900',
    badgeColor: 'text-sky-300 bg-sky-500/15 border-sky-500/30',
    iconKey: 'book',
  },
  {
    id: 'charlene-massage-clinic',
    title: 'Charlene Agdan RMT | Massage Clinic',
    subtitle: 'Therapeutic Wellness & Appointment Portal',
    description:
      'Modern clinic website and appointment booking portal for Charlene Agdan RMT, presenting therapeutic massage treatments, wellness services, and easy client scheduling.',
    url: 'https://massage-clinic.vercel.app/',
    domainLabel: 'massage-clinic.vercel.app',
    platform: 'Vercel',
    category: 'Business & Wellness',
    highlights: [
      'Clean service showcase for personalized therapeutic massage sessions',
      'Streamlined clinic appointment & inquiry flow for clients',
      'Mobile-friendly layout tailored for local wellness bookings',
    ],
    techStack: ['React', 'Tailwind CSS', 'Firebase / Web', 'Vercel'],
    accentGradient: 'from-emerald-500/25 via-teal-500/10 to-slate-900',
    badgeColor: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30',
    iconKey: 'spa',
  },
  {
    id: 'kara-ok',
    title: 'Kara-OK',
    subtitle: 'Interactive Karaoke Web Application',
    description:
      'A web-based karaoke and sing-along application built for quick song lookup, queue management, and group entertainment sessions.',
    url: 'https://kara-ok.onrender.com',
    domainLabel: 'kara-ok.onrender.com',
    platform: 'Render',
    category: 'Media & Fun',
    coldStartNote: 'Hosted on Render free tier — first visit may take ~20 seconds to wake up.',
    highlights: [
      'Full-stack web application hosted on Render cloud infrastructure',
      'Designed for interactive sing-along queues and live entertainment',
      'Responsive controls optimized for laptops, TVs, and mobile screens',
    ],
    techStack: ['Full-Stack Web', 'Node.js / Web App', 'Render Cloud'],
    accentGradient: 'from-fuchsia-500/25 via-purple-500/10 to-slate-900',
    badgeColor: 'text-fuchsia-300 bg-fuchsia-500/15 border-fuchsia-500/30',
    iconKey: 'mic',
  },
  {
    id: 'mangaverse-reader',
    title: 'MangaVerse — Manga, Manhwa & Manhua',
    subtitle: 'High-Quality Comic & Chapter Reader',
    description:
      'Online reader for Manga, Manhwa, and Manhua featuring crisp chapter reading, personal bookmarks, reading history, and cross-device sync.',
    url: 'https://mangaapp-eta.vercel.app/',
    domainLabel: 'mangaapp-eta.vercel.app',
    platform: 'Vercel',
    category: 'Media & Fun',
    highlights: [
      'Smooth high-resolution vertical & page reader for Manga, Manhwa, and Manhua',
      'Library bookmarks, chapter reading history, and cross-device sync',
      'Fast search and discovery across series',
    ],
    techStack: ['React', 'TypeScript', 'Cloud Sync', 'Tailwind CSS', 'Vercel'],
    accentGradient: 'from-rose-500/25 via-pink-500/10 to-slate-900',
    badgeColor: 'text-rose-300 bg-rose-500/15 border-rose-500/30',
    iconKey: 'sparkles',
  },
  {
    id: 'workoutwork-timer',
    title: 'Workoutwork — Routine & Rest Timer',
    subtitle: 'Gym Workout Builder & Interval Timer',
    description:
      'A fast, distraction-free workout routine builder and interval rest timer designed for smooth gym sessions and consistent set tracking.',
    url: 'https://workout-mocha-zeta.vercel.app/',
    domainLabel: 'workout-mocha-zeta.vercel.app',
    platform: 'Vercel',
    category: 'Health & Fitness',
    highlights: [
      'Customizable workout routines with clean exercise & set flow',
      'Built-in interval rest timer to keep gym pacing tight',
      'Instant-loading mobile interface built for one-handed gym use',
    ],
    techStack: ['React', 'TypeScript', 'Web Audio / Timers', 'Vercel'],
    accentGradient: 'from-cyan-500/25 via-blue-500/10 to-slate-900',
    badgeColor: 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30',
    iconKey: 'dumbbell',
  },
  {
    id: 'baby-shower-celebration',
    title: 'Baby Shower Celebration | Charlene & Onin',
    subtitle: 'Event Invitation, RSVP & Gift Registry',
    description:
      'Custom event celebration website for Charlene and Onin featuring interactive invitation details, guest RSVP management, and Amazon Baby Registry links.',
    url: 'https://babyshower-iota-lime.vercel.app/',
    domainLabel: 'babyshower-iota-lime.vercel.app',
    platform: 'Vercel',
    category: 'Events & Personal',
    highlights: [
      'Bespoke invitation experience with warm visual storytelling',
      'Online guest RSVP workflow and event schedule details',
      'Integrated registry links for family & friends',
    ],
    techStack: ['React', 'Tailwind CSS', 'Interactive RSVP', 'Vercel'],
    accentGradient: 'from-violet-500/25 via-indigo-500/10 to-slate-900',
    badgeColor: 'text-violet-300 bg-violet-500/15 border-violet-500/30',
    iconKey: 'heart',
  },
];
