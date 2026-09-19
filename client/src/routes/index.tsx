import type { ComponentType } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { MentorLayout } from '@/components/layout/MentorLayout';
import { InstructorLayout } from '@/components/layout/InstructorLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleRoute } from '@/components/auth/RoleRoute';
import { RoleCode } from '@church/shared';

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
        element: <StudentLayout />,
        children: [
          { path: 'dashboard', ...lazyComponent(() => import('@/pages/DashboardPage')) },
          { path: 'learning', ...lazyComponent(() => import('@/pages/LearningPage')) },
          { path: 'my-courses', ...lazyComponent(() => import('@/pages/MyCoursesPage')) },
          { path: 'my-pathway', ...lazyComponent(() => import('@/pages/MyPathwayPage')) },
          { path: 'my-progress', ...lazyComponent(() => import('@/pages/MyProgressPage')) },
          { path: 'mentorship', ...lazyComponent(() => import('@/pages/MyMentorshipPage')) },
          { path: 'community', ...lazyComponent(() => import('@/pages/CommunityPage')) },
          { path: 'certificates', ...lazyComponent(() => import('@/pages/CertificatesPage')) },
          { path: 'profile', ...lazyComponent(() => import('@/pages/ProfilePage')) },
          { path: 'settings', ...lazyComponent(() => import('@/pages/SettingsPage')) },
        ],
      },
      {
        element: <RoleRoute roles={[RoleCode.ADMIN]} />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: 'admin', ...lazyComponent(() => import('@/pages/admin/AdminOverviewPage')) },
              { path: 'admin/users', ...lazyComponent(() => import('@/pages/admin/AdminUsersPage')) },
              {
                path: 'admin/organizations',
                ...lazyComponent(() => import('@/pages/admin/AdminOrganizationsPage')),
              },
              { path: 'admin/pathways', ...lazyComponent(() => import('@/pages/admin/AdminPathwaysPage')) },
              { path: 'admin/programs', ...lazyComponent(() => import('@/pages/admin/AdminProgramsPage')) },
              { path: 'admin/courses', ...lazyComponent(() => import('@/pages/admin/AdminCoursesPage')) },
              { path: 'admin/mentors', ...lazyComponent(() => import('@/pages/admin/AdminMentorsPage')) },
              {
                path: 'admin/instructors',
                ...lazyComponent(() => import('@/pages/admin/AdminInstructorsPage')),
              },
              {
                path: 'admin/assessments',
                ...lazyComponent(() => import('@/pages/admin/AdminAssessmentsPage')),
              },
              { path: 'admin/analytics', ...lazyComponent(() => import('@/pages/admin/AdminAnalyticsPage')) },
              { path: 'admin/settings', ...lazyComponent(() => import('@/pages/admin/AdminSettingsPage')) },
            ],
          },
        ],
      },
      {
        element: <RoleRoute roles={[RoleCode.MENTOR]} />,
        children: [
          {
            element: <MentorLayout />,
            children: [
              { path: 'mentor', ...lazyComponent(() => import('@/pages/mentor/MentorDashboardPage')) },
              { path: 'mentor/students', ...lazyComponent(() => import('@/pages/mentor/MentorStudentsPage')) },
              { path: 'mentor/progress', ...lazyComponent(() => import('@/pages/mentor/MentorProgressPage')) },
              { path: 'mentor/sessions', ...lazyComponent(() => import('@/pages/mentor/MentorSessionsPage')) },
              { path: 'mentor/profile', ...lazyComponent(() => import('@/pages/mentor/MentorProfilePage')) },
            ],
          },
        ],
      },
      {
        element: <RoleRoute roles={[RoleCode.INSTRUCTOR]} />,
        children: [
          {
            element: <InstructorLayout />,
            children: [
              {
                path: 'instructor',
                ...lazyComponent(() => import('@/pages/instructor/InstructorDashboardPage')),
              },
              {
                path: 'instructor/courses',
                ...lazyComponent(() => import('@/pages/instructor/InstructorCoursesPage')),
              },
              {
                path: 'instructor/programs',
                ...lazyComponent(() => import('@/pages/instructor/InstructorProgramsPage')),
              },
              {
                path: 'instructor/assessments',
                ...lazyComponent(() => import('@/pages/instructor/InstructorAssessmentsPage')),
              },
              {
                path: 'instructor/profile',
                ...lazyComponent(() => import('@/pages/instructor/InstructorProfilePage')),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: 'forbidden',
    ...lazyComponent(() => import('@/pages/ForbiddenPage')),
  },
  {
    path: '*',
    ...lazyComponent(() => import('@/pages/NotFoundPage')),
  },
]);