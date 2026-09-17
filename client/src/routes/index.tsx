import type { ComponentType } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminRoute } from '@/components/auth/AdminRoute';

type LazyImporter = () => Promise<{ default: ComponentType }>;

function lazyComponent(importer: LazyImporter) {
  return {
    lazy: async () => ({ Component: (await importer()).default }),
  };
}

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { index: true, ...lazyComponent(() => import('@/pages/HomePage')) },
      { path: 'about', ...lazyComponent(() => import('@/pages/AboutPage')) },
      { path: 'programs', ...lazyComponent(() => import('@/pages/ProgramsPage')) },
      { path: 'courses', ...lazyComponent(() => import('@/pages/CoursesPage')) },
      { path: 'pathways', ...lazyComponent(() => import('@/pages/PathwaysPage')) },
      { path: 'mentorship', ...lazyComponent(() => import('@/pages/MentorshipPage')) },
      { path: 'resources', ...lazyComponent(() => import('@/pages/ResourcesPage')) },
      { path: 'events', ...lazyComponent(() => import('@/pages/EventsPage')) },
      { path: 'login', ...lazyComponent(() => import('@/pages/LoginPage')) },
      { path: 'register', ...lazyComponent(() => import('@/pages/RegisterPage')) },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: 'dashboard', ...lazyComponent(() => import('@/pages/DashboardPage')) },
          { path: 'learning', ...lazyComponent(() => import('@/pages/LearningPage')) },
          { path: 'my-courses', ...lazyComponent(() => import('@/pages/MyCoursesPage')) },
          { path: 'my-progress', ...lazyComponent(() => import('@/pages/MyProgressPage')) },
          { path: 'mentorship', ...lazyComponent(() => import('@/pages/MyMentorshipPage')) },
          { path: 'community', ...lazyComponent(() => import('@/pages/CommunityPage')) },
          { path: 'certificates', ...lazyComponent(() => import('@/pages/CertificatesPage')) },
          { path: 'profile', ...lazyComponent(() => import('@/pages/ProfilePage')) },
          { path: 'settings', ...lazyComponent(() => import('@/pages/SettingsPage')) },
          {
            path: 'admin',
            element: <AdminRoute />,
            children: [
              { index: true, ...lazyComponent(() => import('@/pages/admin/AdminOverviewPage')) },
              { path: 'users', ...lazyComponent(() => import('@/pages/admin/AdminUsersPage')) },
              { path: 'programs', ...lazyComponent(() => import('@/pages/admin/AdminProgramsPage')) },
              { path: 'courses', ...lazyComponent(() => import('@/pages/admin/AdminCoursesPage')) },
              { path: 'pathways', ...lazyComponent(() => import('@/pages/admin/AdminPathwaysPage')) },
              { path: 'mentors', ...lazyComponent(() => import('@/pages/admin/AdminMentorsPage')) },
              { path: 'assessments', ...lazyComponent(() => import('@/pages/admin/AdminAssessmentsPage')) },
              { path: 'analytics', ...lazyComponent(() => import('@/pages/admin/AdminAnalyticsPage')) },
              { path: 'settings', ...lazyComponent(() => import('@/pages/admin/AdminSettingsPage')) },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    ...lazyComponent(() => import('@/pages/NotFoundPage')),
  },
]);