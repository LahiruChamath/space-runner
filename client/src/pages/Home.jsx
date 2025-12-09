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
    <div className="min-h-[calc(100vh-80px)] flex items-center px-4">
      <div className="relative w-full max-w-5xl mx-auto">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-24 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.35),transparent_55%),radial-gradient(circle_at_bottom,_rgba(129,140,248,0.35),transparent_55%)] opacity-70"
        />

        <div className="relative space-y-10">
          <div className="flex items-center justify-between gap-4 pt-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                <span className="text-cyan-300">Space</span>{' '}
                <span className="text-emerald-300">Runner</span>
              </h1>
              <p className="mt-1 text-xs md:text-sm text-white/60">
                A fast-paced space dodging game. Pilot your ship, avoid the field, and push your best run.
              </p>
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
                      Commander
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

          <div className="flex flex-col md:flex-row items-start justify-between gap-10 md:gap-14 pb-8">
            <div className="flex-1 flex flex-col items-center md:items-start gap-6">
              <p className="text-center md:text-left text-sm md:text-base text-white/70 max-w-xl">
                Dodge incoming asteroids while you race through space. The first hit triggers a Banana
                puzzle that can give you a brief shield fail it and your run ends on the spot.
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 text-xs md:text-sm text-white/70">
                <div className="px-3 py-1 rounded-full bg-black/60 border border-white/10 flex items-center gap-2">
                  <span>🎮</span>
                  <span>Controls: ← → to steer</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-black/60 border border-white/10 flex items-center gap-2">
                  <span>🍌</span>
                  <span>First hit: solve banana for a 3s shield</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-black/60 border border-white/10 flex items-center gap-2">
                  <span>📈</span>
                  <span>Score = Time + Dodges</span>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-start gap-2 pt-2">
                <button
                  onClick={handleStart}
                  className="relative btn-primary mt-1 px-10 py-4 text-lg md:text-xl font-semibold tracking-wide flex items-center gap-3"
                >
                  <span
                    className="absolute -inset-1 rounded-full bg-cyan-400/40 blur-2xl -z-10"
                    aria-hidden="true"
                  />
                  <span role="img" aria-hidden="true" className="text-2xl">
                    🚀
                  </span>
                  Launch Mission
                </button>

                {!loading && !user && (
                  <p className="text-xs md:text-sm text-white/60 pt-1 text-center md:text-left">
                    Log in or create an account to save your best scores on the leaderboard.
                  </p>
                )}
              </div>
            </div>

            <div className="flex-1 flex justify-center md:justify-end">
              <div className="space-y-4 text-xs md:text-sm text-white/70 max-w-sm">
                <h2 className="text-base md:text-lg font-semibold text-white">
                  Mission Briefing
                </h2>
                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <span className="mt-1 text-lg">1.</span>
                    <div>
                      <div className="font-semibold text-white">Take the controls</div>
                      <p className="text-white/70">
                        Use the left and right arrow keys to keep your ship clear of oncoming asteroids.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 text-lg">2.</span>
                    <div>
                      <div className="font-semibold text-white">Stay in motion</div>
                      <p className="text-white/70">
                        Asteroids keep spawning and speeding up over time. The longer you last, the higher
                        your score.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 text-lg">3.</span>
                    <div>
                      <div className="font-semibold text-white">Use your second chance</div>
                      <p className="text-white/70">
                        On your first hit, solve the Banana puzzle to gain a short shield. Miss it, and the
                        run ends immediately.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 text-lg">4.</span>
                    <div>
                      <div className="font-semibold text-white">Push your best run</div>
                      <p className="text-white/70">
                        Your score grows with time survived and asteroids dodged. Climb the leaderboard by
                        flying just a little bit further each time.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}