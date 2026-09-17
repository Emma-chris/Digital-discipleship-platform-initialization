import type {
  CurrentUser,
  LoginInput,
  ProfileUpdateInput,
  PublicCourseSummary,
  PublicLessonSummary,
  PublicPathwaySummary,
  PublicProgramSummary,
  RegisterInput,
} from '@church/shared';
import { api } from './api';

export interface Paginated<T> {
  items: T[];
}

export interface RegisterResponse {
  user: CurrentUser;
  verificationToken?: string;
}

export interface LoginResponse {
  user: CurrentUser;
  accessToken: string;
}

export interface AssessmentSummary {
  id: string;
  courseId: string | null;
  moduleId: string | null;
  lessonId: string | null;
  title: string;
  description: string | null;
  passThreshold: number;
  isPublished: boolean;
  createdAt: Date;
}

export interface EnrolledCourse {
  courseId: string;
  title: string;
  slug: string;
  status: string;
  enrolledAt: Date;
  completedAt: Date | null;
}

export interface CourseProgressState {
  courseId: string;
  status: string;
  progressPercent: number;
  startedAt: Date | null;
  completedAt: Date | null;
}

export interface MentorSummary {
  id: string;
  userId: string;
  displayName: string | null;
  bio: string | null;
}

export const authService = {
  register: (input: RegisterInput) => api.post<RegisterResponse>('/auth/register', input),
  login: (input: LoginInput) => api.post<LoginResponse>('/auth/login', input),
  logout: () => api.post<undefined>('/auth/logout'),
  me: () => api.get<{ user: CurrentUser }>('/auth/me'),
  updateProfile: (input: ProfileUpdateInput) =>
    api.patch<{ user: CurrentUser }>('/users/me', input),
  verifyEmail: (token: string) => api.post<{ verified: boolean }>('/auth/verify-email', { token }),
  requestPasswordReset: (email: string) =>
    api.post<{ sent: boolean; resetToken?: string }>('/auth/password-reset/request', { email }),
  confirmPasswordReset: (token: string, password: string) =>
    api.post<{ reset: boolean }>('/auth/password-reset/confirm', { token, password }),
};

export const contentService = {
  programs: (page = 1, pageSize = 20) =>
    api.get<Paginated<PublicProgramSummary>>(`/programs?page=${page}&pageSize=${pageSize}`),
  courses: (page = 1, pageSize = 20) =>
    api.get<Paginated<PublicCourseSummary>>(`/courses?page=${page}&pageSize=${pageSize}`),
  pathways: (page = 1, pageSize = 20) =>
    api.get<Paginated<PublicPathwaySummary>>(`/pathways?page=${page}&pageSize=${pageSize}`),
  lessons: (page = 1, pageSize = 20, courseId?: string) =>
    api.get<Paginated<PublicLessonSummary>>(
      `/lessons?page=${page}&pageSize=${pageSize}${courseId ? `&courseId=${courseId}` : ''}`,
    ),
  assessments: (page = 1, pageSize = 20) =>
    api.get<Paginated<AssessmentSummary>>(`/assessments?page=${page}&pageSize=${pageSize}`),
  mentors: (page = 1, pageSize = 20) =>
    api.get<Paginated<MentorSummary>>(`/mentorship?page=${page}&pageSize=${pageSize}`),
  enrollments: (page = 1, pageSize = 20) =>
    api.get<Paginated<EnrolledCourse>>(`/enrollments?page=${page}&pageSize=${pageSize}`),
  progress: (page = 1, pageSize = 20) =>
    api.get<Paginated<CourseProgressState>>(`/progress?page=${page}&pageSize=${pageSize}`),
};