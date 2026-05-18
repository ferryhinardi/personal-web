import {
  Home,
  User,
  FileText,
  Briefcase,
  Mail,
  LayoutDashboard,
  MessageSquare,
  Award,
  Wrench,
  History,
  Link2,
  Map,
} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Whether this navigates to a hash section on the home page */
  isSection?: boolean;
  /** Whether this navigates to a separate page route */
  isPage?: boolean;
  /** Whether this links to a static asset (bypasses React Router) */
  isStatic?: boolean;
  /** Keywords for command palette search */
  keywords?: string[];
}

/**
 * Main sections on the home page (smooth scroll targets)
 */
export const mainSections: NavItem[] = [
  {
    label: 'Home',
    href: '#home',
    icon: Home,
    isSection: true,
    keywords: ['top', 'start', 'beginning'],
  },
  {
    label: 'About',
    href: '#about',
    icon: User,
    isSection: true,
    keywords: ['bio', 'me', 'profile', 'introduction'],
  },
  {
    label: 'Resume',
    href: '#resume',
    icon: FileText,
    isSection: true,
    keywords: ['cv', 'experience', 'work history', 'skills', 'education'],
  },
  {
    label: 'Works',
    href: '#portfolio',
    icon: Briefcase,
    isSection: true,
    keywords: ['portfolio', 'projects', 'showcase'],
  },
  {
    label: 'Contact',
    href: '#contact',
    icon: Mail,
    isSection: true,
    keywords: ['email', 'message', 'reach out', 'hire'],
  },
];

/**
 * Dedicated pages (separate routes)
 */
export const pageLinks: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    isPage: true,
    keywords: ['stats', 'analytics', 'wakatime', 'activity', 'coding'],
  },
  {
    label: 'Guestbook',
    href: '/guestbook',
    icon: MessageSquare,
    isPage: true,
    keywords: ['messages', 'comments', 'sign', 'write'],
  },
  {
    label: 'Achievements',
    href: '/achievements',
    icon: Award,
    isPage: true,
    keywords: ['certificates', 'badges', 'awards', 'accomplishments'],
  },
  {
    label: 'Uses',
    href: '/uses',
    icon: Wrench,
    isPage: true,
    keywords: ['setup', 'tools', 'gear', 'hardware', 'software', 'stack'],
  },
  {
    label: 'Changelog',
    href: '/changelog',
    icon: History,
    isPage: true,
    keywords: ['updates', 'versions', 'releases', 'history', 'changes'],
  },
  {
    label: 'Links',
    href: '/links',
    icon: Link2,
    isPage: true,
    keywords: ['social', 'linktree', 'connect', 'profiles'],
  },
];

/**
 * All navigation items combined
 */
export const allNavItems: NavItem[] = [...mainSections, ...pageLinks];
