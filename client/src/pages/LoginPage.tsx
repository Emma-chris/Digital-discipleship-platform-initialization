import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@church/shared';
import { authService } from '@/services/services';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/Alert';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { BookOpen } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    try {
      await authService.login(data);
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Login failed. Please try again.';
      setServerError(message);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Log in' }]} />
      <div className="mt-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
            <BookOpen className="size-6" />
          </span>
          <h1 className="text-2xl font-bold text-navy-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">
            Log in to continue your learning journey.
          </p>
        </div>

        {serverError && (
          <Alert variant="danger" className="mb-6">
            {serverError}
          </Alert>
        )}

        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4">
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" loading={isSubmitting} className="w-full">
            Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-brand-600 hover:text-brand-700">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}