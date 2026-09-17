import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileUpdateSchema, type ProfileUpdateInput } from '@church/shared';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/services';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/input';
import { Alert } from '@/components/ui/Alert';

export default function ProfilePage() {
  const { user, roles } = useAuth();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: user?.fullName ?? '',
      displayName: user?.displayName ?? '',
    },
  });

  if (!user) return null;

  const onSubmit = async (data: ProfileUpdateInput) => {
    setServerError(null);
    setSuccess(false);
    try {
      await authService.updateProfile(data);
      setSuccess(true);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Could not update profile.');
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Profile' }]} />
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-navy-900 text-2xl font-bold text-white">
          {(user.displayName ?? user.fullName ?? user.email).slice(0, 1).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-navy-900">
            {user.displayName ?? user.fullName ?? 'Your profile'}
          </h1>
          <p className="text-slate-500">{user.email}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {roles.map((role) => (
          <Badge key={role} variant="brand">
            {role}
          </Badge>
        ))}
        <Badge variant={user.emailVerified ? 'success' : 'warning'}>
          {user.emailVerified ? 'Email verified' : 'Email not verified'}
        </Badge>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Account details</CardTitle>
          <CardDescription>Update the information shown on your profile.</CardDescription>
        </CardHeader>
        <CardContent>
          {serverError && (
            <Alert variant="danger" className="mb-4">
              {serverError}
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="mb-4" title="Profile updated">
              Your changes have been saved.
            </Alert>
          )}
          <form
            onSubmit={(e) => void handleSubmit(onSubmit)(e)}
            className="space-y-4"
            data-testid="profile-form"
          >
            <Input
              id="fullName"
              label="Full name"
              placeholder="Your full name"
              error={errors.fullName?.message}
              {...register('fullName')}
            />
            <Input
              id="displayName"
              label="Display name"
              placeholder="Name shown to others"
              error={errors.displayName?.message}
              {...register('displayName')}
            />
            <Textarea
              id="bio"
              label="Biography"
              placeholder="Tell the community a little about yourself"
              rows={4}
              error={errors.bio?.message}
              {...register('bio')}
            />
            <Button type="submit" loading={isSubmitting}>
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}