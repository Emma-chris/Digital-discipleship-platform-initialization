import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-white px-4 text-center">
      <p className="text-6xl font-extrabold text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-navy-900">Page not found</h1>
      <p className="mt-2 max-w-md text-slate-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="mt-8">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}