'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Login failed');
        setLoading(false);
        return;
      }

      const data = await res.json();
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      router.push('/admin/posts');
    } catch {
      setError('Network error. Is the API running?');
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <div className="mb-8 text-center">
        <h1 className="mb-2 font-display text-2xl font-semibold tracking-tight">Admin Login</h1>
        <p className="text-sm text-muted-foreground">Sign in to manage WeeCommerce</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@weecommerce.web.id" required />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">Password</label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
        </div>

        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm text-destructive">{error}</p>
        )}

        <Button type="submit" disabled={loading} className="w-full rounded-full">
          {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          {loading ? 'Signing in...' : 'Log in'}
        </Button>
      </form>

      <a href="/" className="mt-8 text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Back to site
      </a>
    </div>
  );
}
