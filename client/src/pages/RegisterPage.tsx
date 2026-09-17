import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@church/shared';
import { authService } from '@/services/services';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/Alert';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { BookOpen } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    try {
      await authService.register(data);
      navigate('/login', {
        replace: true,
        state: { registered: true },
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setServerError(message);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Create account' }]} />
      <div className="mt-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
            <BookOpen className="size-6" />
          </span>
          <h1 className="text-2xl font-bold text-navy-900">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500">
            Join the community and begin your discipleship journey.
          </p>
        </div>

        {serverError && (
          <Alert variant="danger" className="mb-6">
            {serverError}
          </Alert>
        )}

        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4">
          <Input
            id="fullName"
            type="text"
            label="Full name"
            placeholder="Your full name"
            autoComplete="name"
            error={errors.fullName?.message}
            {...register('fullName')}
          />
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
            placeholder="At least 8 characters"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" loading={isSubmitting} className="w-full">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}