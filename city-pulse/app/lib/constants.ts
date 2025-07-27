import {
  LayoutDashboard,
  Newspaper,
  Map,
  AlertTriangle,
  Database,
  Wand2,
  ArrowRightLeft,
  Bot,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/news-feed', label: 'News Feed', icon: Newspaper },
  { href: '/city-pulse', label: 'City Pulse', icon: Map },
  { href: '/issues', label: 'Issues', icon: AlertTriangle },
  { href: '/ingested-data', label: 'Ingested Data', icon: Database },
  { href: '/extraction', label: 'Extraction', icon: Wand2 },
  { href: '/transformations', label: 'Transformations', icon: ArrowRightLeft },
  { href: '/monitoring-assistant', label: 'Monitoring Assistant', icon: Bot },
  { href: '/admin', label: 'Admin', icon: Settings },
];
