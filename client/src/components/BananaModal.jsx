import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jget, jpost } from '../lib/api';

export default function BananaModal({ open, onCorrect, onWrong }) {
  const [puzzle, setPuzzle] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    if (!open) return;
    setAnswer('');
    setErr('');
    setPuzzle(null);
    setLoading(true);

    jget('/api/banana/new')
      .then((data) => setPuzzle(data))
      .catch(() => setErr('Could not load Banana puzzle'))
      .finally(() => setLoading(false));
  }, [open]);

  async function submit(e) {
    e.preventDefault();
    if (!puzzle) return;
    setErr('');
    try {
      const res = await jpost('/api/banana/answer', {
        token: puzzle.token,
        answer
      });
      if (res.correct) onCorrect();
      else onWrong();
    } catch (e) {
      setErr(String(e.message || e));
    }
  }

  function handleGiveUp() {
    // Go back to main menu
    nav('/');
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/70 flex items-center justify-center">
      <div className="card max-w-md w-full mx-4 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Second Chance Shield 🚀🛡️</h2>
        <p className="text-sm text-white/70">
          You’ve been hit, but it’s not over yet. Solve the banana puzzle 🍌 to earn a 3 second shield 🛡️ and keep your run alive 🚀. Fail, and your second chance is gone. Game Over ☠️
        </p>

        {loading && <div className="text-sm text-white/70">Loading puzzle…</div>}
        {err && <div className="text-sm text-red-400">{err}</div>}

        {puzzle && (
          <>
            <img
              src={puzzle.imageUrl}
              alt="Banana puzzle"
              className="w-full rounded-lg border border-white/10"
            />
            <form className="space-y-3" onSubmit={submit}>
              <div>
                <label className="label">Your answer</label>
                <input
                  className="input"
                  inputMode="numeric"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  required
                />
              </div>

              {/* Buttons side by side */}
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn-primary flex-1"
                  onClick={handleGiveUp}
                >
                  Give Up & Return
                </button>

                <button
                  className="btn-primary flex-1"
                  disabled={!answer.trim()}
                >
                  Submit Answer
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}