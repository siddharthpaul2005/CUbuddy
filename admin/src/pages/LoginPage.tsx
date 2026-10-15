import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { useAuth } from '../lib/auth';
import { errorMessage } from '../lib/errors';

export function LoginPage() {
  const { session, isAdmin, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (session && isAdmin) return <Navigate to="/events" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(email, password);
      navigate('/events', { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm space-y-4 p-6">
        <h1 className="text-xl font-bold">
          CUbuddy <span className="text-indigo-600">Admin</span>
        </h1>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" className="input" autoComplete="username" required
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" type="password" className="input" autoComplete="current-password" required
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
