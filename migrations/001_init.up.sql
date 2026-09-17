-- -----------------------------------------------------------------------------
-- 001_init — DisciplePath Platform initial schema
--
-- Foundation for a multi-organization discipleship/education platform.
-- Hierarchy direction: Organization -> Pathways -> Stages -> Programs ->
-- Courses -> Modules -> Lessons -> Activities -> Assessments -> Progress.
--
-- Conventions used across this file:
--   * UUID primary keys (gen_random_uuid, built into PostgreSQL 13+ / Neon).
--   * Enumerated values stored as TEXT with CHECK constraints (migration friendly).
--   * `organization_id` on content/user tables: NULL means platform-wide.
--   * No plaintext secrets. Passwords are scrypt hashes (see server auth).
-- -----------------------------------------------------------------------------

-- updated_at trigger helper ------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Organizations ------------------------------------------------------------
CREATE TABLE organizations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  description text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Users --------------------------------------------------------------------
CREATE TABLE users (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   uuid REFERENCES organizations(id) ON DELETE SET NULL,
  email             text NOT NULL UNIQUE,
  password_hash     text NOT NULL,
  full_name         text,
  status            text NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'invited', 'suspended')),
  email_verified_at timestamptz,
  last_login_at     timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_users_status ON users(status);

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Roles --------------------------------------------------------------------
CREATE TABLE roles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code        text NOT NULL UNIQUE
              CHECK (code IN ('admin', 'instructor', 'mentor', 'student')),
  name        text NOT NULL,
  description text
);

CREATE TABLE user_roles (
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id     uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);

-- Profiles -----------------------------------------------------------------
CREATE TABLE profiles (
  user_id      uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url   text,
  bio          text,
  phone        text,
  language     text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- User tokens (email verification / password reset; hashed values stored) ---
CREATE TABLE user_tokens (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind       text NOT NULL CHECK (kind IN ('email_verification', 'password_reset')),
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  used_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_tokens_user_id ON user_tokens(user_id);
CREATE INDEX idx_user_tokens_expires_at ON user_tokens(expires_at);

-- Pathways -----------------------------------------------------------------
CREATE TABLE pathways (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  slug            text NOT NULL UNIQUE,
  title           text NOT NULL,
  description     text,
  is_published    boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_pathways_organization_id ON pathways(organization_id);

CREATE TRIGGER trg_pathways_updated_at
  BEFORE UPDATE ON pathways
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE pathway_stages (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pathway_id          uuid NOT NULL REFERENCES pathways(id) ON DELETE CASCADE,
  title               text NOT NULL,
  description         text,
  sort_order          integer NOT NULL DEFAULT 0,
  completion_criteria jsonb,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (pathway_id, sort_order)
);

CREATE INDEX idx_pathway_stages_pathway_id ON pathway_stages(pathway_id);

CREATE TRIGGER trg_pathway_stages_updated_at
  BEFORE UPDATE ON pathway_stages
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Programs -----------------------------------------------------------------
CREATE TABLE programs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  pathway_id      uuid REFERENCES pathways(id) ON DELETE SET NULL,
  stage_id        uuid REFERENCES pathway_stages(id) ON DELETE SET NULL,
  slug            text NOT NULL UNIQUE,
  title           text NOT NULL,
  description     text,
  is_published    boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_programs_organization_id ON programs(organization_id);
CREATE INDEX idx_programs_pathway_id ON programs(pathway_id);
CREATE INDEX idx_programs_stage_id ON programs(stage_id);

CREATE TRIGGER trg_programs_updated_at
  BEFORE UPDATE ON programs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Courses ------------------------------------------------------------------
CREATE TABLE courses (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  uuid REFERENCES organizations(id) ON DELETE CASCADE,
  slug             text NOT NULL UNIQUE,
  title            text NOT NULL,
  description      text,
  cover_image_url  text,
  level            text CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  estimated_minutes integer,
  is_published     boolean NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_courses_organization_id ON courses(organization_id);

CREATE TRIGGER trg_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE program_courses (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  course_id  uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  UNIQUE (program_id, course_id),
  UNIQUE (program_id, sort_order)
);

CREATE INDEX idx_program_courses_course_id ON program_courses(course_id);

-- Modules & lessons --------------------------------------------------------
CREATE TABLE course_modules (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title       text NOT NULL,
  description text,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_id, sort_order)
);

CREATE INDEX idx_course_modules_course_id ON course_modules(course_id);

CREATE TRIGGER trg_course_modules_updated_at
  BEFORE UPDATE ON course_modules
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE lessons (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id        uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_id        uuid REFERENCES course_modules(id) ON DELETE SET NULL,
  title            text NOT NULL,
  summary          text,
  content_type     text NOT NULL DEFAULT 'text'
                   CHECK (content_type IN ('video', 'text', 'audio', 'quiz')),
  content_url      text,
  content_text     text,
  duration_minutes integer,
  sort_order       integer NOT NULL DEFAULT 0,
  is_published     boolean NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_id, sort_order)
);

CREATE INDEX idx_lessons_course_id ON lessons(course_id);
CREATE INDEX idx_lessons_module_id ON lessons(module_id);

CREATE TRIGGER trg_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE lesson_activities (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id     uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  activity_type text NOT NULL
                CHECK (activity_type IN ('reflection', 'discussion', 'journal', 'quiz')),
  title         text NOT NULL,
  prompt        text,
  sort_order    integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_lesson_activities_lesson_id ON lesson_activities(lesson_id);

CREATE TRIGGER trg_lesson_activities_updated_at
  BEFORE UPDATE ON lesson_activities
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Assessments ---------------------------------------------------------------
CREATE TABLE assessments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  course_id       uuid REFERENCES courses(id) ON DELETE CASCADE,
  module_id       uuid REFERENCES course_modules(id) ON DELETE CASCADE,
  lesson_id       uuid REFERENCES lessons(id) ON DELETE CASCADE,
  title           text NOT NULL,
  description     text,
  pass_threshold  integer NOT NULL DEFAULT 70 CHECK (pass_threshold BETWEEN 0 AND 100),
  is_published    boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CHECK (num_nonnulls(course_id, module_id, lesson_id) = 1)
);

CREATE INDEX idx_assessments_course_id ON assessments(course_id);
CREATE INDEX idx_assessments_lesson_id ON assessments(lesson_id);

CREATE TRIGGER trg_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE assessment_questions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  prompt        text NOT NULL,
  question_type text NOT NULL DEFAULT 'choice'
    CHECK (question_type IN ('choice', 'multiple_choice', 'text')),
  points        integer NOT NULL DEFAULT 1 CHECK (points > 0),
  sort_order    integer NOT NULL DEFAULT 0
);

CREATE INDEX idx_assessment_questions_assessment_id ON assessment_questions(assessment_id);

CREATE TABLE assessment_options (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES assessment_questions(id) ON DELETE CASCADE,
  text        text NOT NULL,
  is_correct  boolean NOT NULL DEFAULT false,
  sort_order  integer NOT NULL DEFAULT 0
);

CREATE INDEX idx_assessment_options_question_id ON assessment_options(question_id);

CREATE TABLE assessment_attempts (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status        text NOT NULL DEFAULT 'in_progress'
                CHECK (status IN ('in_progress', 'submitted', 'graded')),
  score         integer,
  passed        boolean,
  answers       jsonb,
  started_at    timestamptz NOT NULL DEFAULT now(),
  submitted_at  timestamptz
);

CREATE INDEX idx_assessment_attempts_user_id ON assessment_attempts(user_id);
CREATE INDEX idx_assessment_attempts_assessment_id ON assessment_attempts(assessment_id);

-- Enrollments & progress -----------------------------------------------------
CREATE TABLE enrollments (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  program_id   uuid REFERENCES programs(id) ON DELETE CASCADE,
  course_id    uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status       text NOT NULL DEFAULT 'active'
               CHECK (status IN ('active', 'completed', 'dropped')),
  enrolled_at  timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  UNIQUE (user_id, course_id)
);

CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);

CREATE TABLE lesson_progress (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id            uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  status               text NOT NULL DEFAULT 'not_started'
                       CHECK (status IN ('not_started', 'in_progress', 'completed')),
  last_position_seconds integer NOT NULL DEFAULT 0,
  completed_at         timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);

CREATE TRIGGER trg_lesson_progress_updated_at
  BEFORE UPDATE ON lesson_progress
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE course_progress (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id       uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status          text NOT NULL DEFAULT 'not_started'
                  CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percent integer NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  started_at      timestamptz,
  completed_at    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);

CREATE INDEX idx_course_progress_user_id ON course_progress(user_id);
CREATE INDEX idx_course_progress_course_id ON course_progress(course_id);

CREATE TRIGGER trg_course_progress_updated_at
  BEFORE UPDATE ON course_progress
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE pathway_progress (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pathway_id      uuid NOT NULL REFERENCES pathways(id) ON DELETE CASCADE,
  current_stage_id uuid REFERENCES pathway_stages(id) ON DELETE SET NULL,
  status          text NOT NULL DEFAULT 'not_started'
                  CHECK (status IN ('not_started', 'in_progress', 'completed')),
  started_at      timestamptz,
  completed_at    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, pathway_id)
);

CREATE INDEX idx_pathway_progress_user_id ON pathway_progress(user_id);
CREATE INDEX idx_pathway_progress_pathway_id ON pathway_progress(pathway_id);

CREATE TRIGGER trg_pathway_progress_updated_at
  BEFORE UPDATE ON pathway_progress
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Mentorship ---------------------------------------------------------------
CREATE TABLE mentors (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  bio             text,
  status          text NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active', 'inactive')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_mentors_organization_id ON mentors(organization_id);

CREATE TRIGGER trg_mentors_updated_at
  BEFORE UPDATE ON mentors
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE mentor_assignments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id  uuid NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status     text NOT NULL DEFAULT 'assigned'
             CHECK (status IN ('assigned', 'active', 'completed', 'cancelled')),
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at   timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (mentor_id, student_id)
);

CREATE INDEX idx_mentor_assignments_student_id ON mentor_assignments(student_id);
CREATE INDEX idx_mentor_assignments_mentor_id ON mentor_assignments(mentor_id);

CREATE TRIGGER trg_mentor_assignments_updated_at
  BEFORE UPDATE ON mentor_assignments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Notifications ------------------------------------------------------------
CREATE TABLE notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       text NOT NULL,
  title      text NOT NULL,
  body       text,
  data       jsonb,
  read_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_created
  ON notifications(user_id, created_at DESC);

-- Audit log ----------------------------------------------------------------
CREATE TABLE audit_logs (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     uuid REFERENCES users(id) ON DELETE SET NULL,
  action      text NOT NULL,
  entity_type text,
  entity_id   uuid,
  details     jsonb,
  ip          inet,
  user_agent  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Sessions (connect-pg-simple / express-session) ---------------------------
CREATE TABLE "session" (
  "sid"    varchar NOT NULL COLLATE "default" PRIMARY KEY,
  "sess"   json NOT NULL,
  "expire" timestamp(6) NOT NULL
);

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

-- Seed: built-in roles -----------------------------------------------------
INSERT INTO roles (code, name, description) VALUES
  ('admin',       'Administrator', 'Manages the platform, users, content and settings.'),
  ('instructor',  'Instructor',    'Creates and publishes courses, modules, lessons and assessments.'),
  ('mentor',      'Mentor',        'Guides assigned students and tracks their development.'),
  ('student',     'Student',       'Enrolls, learns, completes activities and grows in discipleship.')
ON CONFLICT (code) DO NOTHING;