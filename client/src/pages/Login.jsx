import { useState } from 'react';
import { login } from '../lib/auth';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr('');
    try {
      await login({ email, password });
      window.dispatchEvent(new Event('auth-changed'));
      nav('/game');
    } catch (e) {
      setErr(String(e.message || e));
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-4">
        <Link to="/" className="btn-ghost">
          ← Home
        </Link>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form className="space-y-3" onSubmit={submit}>
        <div>
          <div className="label">Email</div>
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <div className="label">Password</div>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {err && <div className="text-red-400 text-sm">{err}</div>}
        <button className="btn-primary w-full">Login</button>
      </form>
      <p className="mt-3 text-sm text-white/60">
        No account? <Link className="underline" to="/register">Register</Link>
      </p>
    </div>
  );
}
