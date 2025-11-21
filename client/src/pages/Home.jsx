import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { me, logout } from '../lib/auth';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  function handleStart() {
    if (!user) {
      nav('/login');
    } else {
      nav('/game');
    }
  }

  async function handleLogout() {
    await logout();
    setUser(null);
    window.dispatchEvent(new Event('auth-changed'));
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
      <div className="relative w-full max-w-4xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-24 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.35),transparent_55%),radial-gradient(circle_at_bottom,_rgba(129,140,248,0.35),transparent_55%)] opacity-70"
        />

        <div className="relative rounded-3xl border border-white/10 bg-black/50 backdrop-blur-xl px-6 py-8 md:px-10 md:py-10 space-y-10 shadow-[0_25px_80px_rgba(0,0,0,0.7)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] tracking-[0.28em] uppercase text-emerald-300/80 mb-1">
                Arcade mode
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                <span className="text-cyan-300">Space</span>{' '}
                <span className="text-emerald-300">Runner</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => nav('/leaderboards')}
                className="btn-ghost flex items-center gap-2 text-sm"
              >
                <span role="img" aria-hidden="true">
                  🏆
                </span>
                <span className="hidden sm:inline">Leaderboard</span>
              </button>

              {user ? (
                <div className="flex items-center gap-2">
                  <div className="text-right text-xs text-white/60">
                    <div className="uppercase tracking-wide text-[11px] text-emerald-300/80">
                      Player
                    </div>
                    <div className="font-semibold text-sm">{user.username}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn-ghost flex items-center gap-2 text-sm"
                  >
                    <span role="img" aria-hidden="true">
                      ⏏
                    </span>
                    <span className="hidden sm:inline">Sign out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => nav('/login')}
                    className="btn-ghost flex items-center gap-2 text-sm"
                  >
                    <span role="img" aria-hidden="true">
                      🔐
                    </span>
                    <span className="hidden sm:inline">Login</span>
                  </button>
                  <button
                    onClick={() => nav('/register')}
                    className="btn-primary flex items-center gap-2 text-sm"
                  >
                    <span role="img" aria-hidden="true">
                      👾
                    </span>
                    <span className="hidden sm:inline">Sign up</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 pt-4">
            <p className="text-center text-sm md:text-base text-white/70 max-w-xl">
              Dodge incoming asteroids in an endless hyperspace tunnel. Survive a hit by solving the
              Banana puzzle for one extra chance — or get vaporised trying.
            </p>

            <button
              onClick={handleStart}
              className="relative btn-primary mt-2 px-10 py-4 text-lg md:text-xl font-semibold tracking-wide flex items-center gap-3"
            >
              <span
                className="absolute -inset-1 rounded-full bg-cyan-400/40 blur-2xl -z-10"
                aria-hidden="true"
              />
              <span role="img" aria-hidden="true" className="text-2xl">
                🚀
              </span>
              Start Game
            </button>

            {!loading && !user && (
              <p className="text-xs md:text-sm text-white/60 pt-2">
                Log in or create an account to save your best scores on the leaderboard.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
