import type { HostingPlatform, ProjectCategory, ProjectItem } from '../data/portfolio';

export function filterProjects(
  projects: ProjectItem[],
  options: {
    search: string;
    platform: HostingPlatform | 'All';
    category: ProjectCategory | 'All';
  }
): ProjectItem[] {
  const q = options.search.trim().toLowerCase();
  return projects.filter((project) => {
    if (options.platform !== 'All' && project.platform !== options.platform) {
      return false;
    }
    if (options.category !== 'All' && project.category !== options.category) {
      return false;
    }
    if (!q) return true;
    return (
      project.title.toLowerCase().includes(q) ||
      project.subtitle.toLowerCase().includes(q) ||
      project.description.toLowerCase().includes(q) ||
      project.techStack.some((t) => t.toLowerCase().includes(q)) ||
      project.platform.toLowerCase().includes(q)
    );
  });
}
