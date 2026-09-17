import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Compass, GraduationCap, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const features = [
  {
    icon: Compass,
    title: 'Structured Pathways',
    description:
      'Clear, progressive learning routes from first steps to mature leadership. No wandering through random videos — every course builds on the last.',
  },
  {
    icon: BookOpen,
    title: 'Rigorous Courses',
    description:
      'Well-structured modules, lessons and assessments designed to transfer knowledge, shape character and form real spiritual maturity.',
  },
  {
    icon: Users,
    title: 'Mentorship',
    description:
      'Connect with experienced mentors who monitor your progress, provide guidance and help you grow into the person God intends you to be.',
  },
  {
    icon: GraduationCap,
    title: 'Measurable Growth',
    description:
      'Track your development across courses and stages. Earn certificates as you progress. Move forward with clarity, not guesswork.',
  },
];

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,_#1d4ed8_0%,_transparent_70%)] opacity-60" />
        <div className="relative mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:py-32">
          <span className="mb-4 rounded-full border border-brand-400/30 bg-brand-600/10 px-4 py-1 text-sm font-medium text-brand-200">
            Digital Discipleship Platform
          </span>
          <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Discover. Learn. Practice.{' '}
            <span className="text-brand-300">Multiply.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            DisciplePath helps churches, ministries and Christian communities build structured
            discipleship systems — not just content libraries. Move every learner from first steps
            through spiritual maturity, leadership and reproducing disciples.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/programs">
              <Button size="lg">
                Explore Programs
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy strip */}
      <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-3xl font-bold text-navy-900">
          More Than a Course Library
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-slate-600">
          A true discipleship system understands where each student is, what they have
          completed, what they need next, and how they grow from learner to mentor to
          leader who reproduces the process in others.
        </p>
        <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-2 text-sm font-medium text-brand-700">
          {['Discover', 'Learn', 'Practice', 'Connect', 'Get Mentored', 'Serve', 'Lead', 'Multiply'].map(
            (step, i) => (
              <span key={step} className="flex items-center gap-1.5">
                <span className="flex size-6 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
                  {i + 1}
                </span>
                {step}
                {i < 7 && <span className="text-slate-300">→</span>}
              </span>
            ),
          )}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="flex flex-col p-6">
              <feature.icon className="mb-4 size-8 text-brand-600" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-navy-900">{feature.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="rounded-3xl bg-navy-950 px-6 py-16 text-center text-white sm:px-12">
          <h2 className="text-3xl font-bold">Begin Your Discipleship Journey</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            Sign up for free, explore the pathways available to you, and take the
            next step in your spiritual formation.
          </p>
          <Link to="/register" className="mt-8 inline-flex">
            <Button size="lg" className="bg-white text-navy-900 hover:bg-slate-100">
              Get Started Free
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}