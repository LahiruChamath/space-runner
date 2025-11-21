import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { me, logout } from '../lib/auth';

export default function NavBar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = () => {
      me().then(setUser).catch(() => setUser(null));
    };

    loadUser();

    const handler = () => loadUser();
    window.addEventListener('auth-changed', handler);

    return () => window.removeEventListener('auth-changed', handler);
  }, []);

  async function handleLogout() {
    await logout();
    setUser(null);
    window.dispatchEvent(new Event('auth-changed'));
    navigate('/');
  }

  return (
    <header className="border-b border-white/10 bg-black/60 backdrop-blur-md">
      <div className="container flex items-center justify-between py-3 gap-4">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-300/80">
            Arcade
          </span>
          <span className="font-semibold text-sm sm:text-base">
            Space <span className="text-emerald-300">Runner</span>
          </span>
        </Link>

        <div className="flex items-center gap-3 text-sm">
          <Link className="btn-ghost hidden sm:inline-flex items-center gap-1" to="/leaderboards">
            <span role="img" aria-hidden="true">🏆</span>
            <span>Leaderboard</span>
          </Link>

          {user ? (
            <>
              <span className="hidden sm:inline text-xs text-white/70">
                Player: <span className="font-semibold">{user.username}</span>
              </span>
              <button className="btn-ghost" onClick={handleLogout}>
                ⏏ <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          ) : (
            <>
              <Link className="btn-ghost" to="/login">
                Login
              </Link>
              <Link className="btn-primary" to="/register">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
