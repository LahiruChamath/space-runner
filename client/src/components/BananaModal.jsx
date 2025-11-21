import { useEffect, useState } from 'react';
import { jget, jpost } from '../lib/api';

export default function BananaModal({ open, onCorrect, onWrong }) {
  const [puzzle, setPuzzle] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/70 flex items-center justify-center">
      <div className="card max-w-md w-full mx-4 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Second Chance Puzzle</h2>
        <p className="text-sm text-white/70">
          Solve the Banana puzzle correctly to continue with 3 seconds of immunity. A wrong answer ends your run.
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
              <button className="btn-primary w-full" disabled={!answer.trim()}>
                Submit Answer
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
