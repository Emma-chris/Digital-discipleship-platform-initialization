import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  BookOpen,
  Building2,
  ClipboardList,
  Compass,
  FileText,
  GraduationCap,
  LayoutGrid,
  MessageSquare,
  Presentation,
  Route,
  Settings,
  Shield,
  Trophy,
  User,
  Users,
} from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export const studentNav: readonly NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/learning', label: 'My Learning', icon: BookOpen },
  { to: '/my-pathway', label: 'My Pathway', icon: Route },
  { to: '/mentorship', label: 'Mentorship', icon: Users },
  { to: '/community', label: 'Community', icon: MessageSquare },
  { to: '/certificates', label: 'Certificates', icon: Trophy },
  { to: '/profile', label: 'Profile', icon: User },
];

export const mentorNav: readonly NavItem[] = [
  { to: '/mentor', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/mentor/students', label: 'My Students', icon: Users },
  { to: '/mentor/progress', label: 'Progress', icon: Compass },
  { to: '/mentor/sessions', label: 'Sessions', icon: MessageSquare },
  { to: '/mentor/profile', label: 'Profile', icon: User },
];

export const instructorNav: readonly NavItem[] = [
  { to: '/instructor', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/instructor/courses', label: 'Courses', icon: GraduationCap },
  { to: '/instructor/programs', label: 'Programs', icon: Presentation },
  { to: '/instructor/assessments', label: 'Assessments', icon: FileText },
  { to: '/instructor/profile', label: 'Profile', icon: User },
];

export const adminNav: readonly NavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/organizations', label: 'Organizations', icon: Building2 },
  { to: '/admin/pathways', label: 'Pathways', icon: Route },
  { to: '/admin/programs', label: 'Programs', icon: Presentation },
  { to: '/admin/courses', label: 'Courses', icon: GraduationCap },
  { to: '/admin/mentors', label: 'Mentors', icon: User },
  { to: '/admin/instructors', label: 'Instructors', icon: Shield },
  { to: '/admin/assessments', label: 'Assessments', icon: ClipboardList },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];