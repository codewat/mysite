import {
  BookOpen,
  Dumbbell,
  Heart,
  Mic,
  Music2,
  Sparkles,
  Flower2,
} from 'lucide-react';
import type { ProjectItem } from '../data/portfolio';

export function ProjectIcon({
  iconKey,
  className = 'h-5 w-5',
}: {
  iconKey: ProjectItem['iconKey'];
  className?: string;
}) {
  switch (iconKey) {
    case 'music':
      return <Music2 className={className} />;
    case 'mic':
      return <Mic className={className} />;
    case 'spa':
      return <Flower2 className={className} />;
    case 'book':
      return <BookOpen className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'dumbbell':
      return <Dumbbell className={className} />;
    case 'heart':
      return <Heart className={className} />;
  }
}
