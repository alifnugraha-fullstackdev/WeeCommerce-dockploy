import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <h1 className="mb-6 font-display text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
      <Link
        href="/admin/login"
        className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background hover:bg-foreground/90"
      >
        Go to Login
      </Link>
    </div>
  );
}
