import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jget } from '../lib/api';

export default function Leaderboards() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    jget('/api/scores/top-best')
      .then(setRows)
      .catch((e) => setErr(String(e.message || e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Leaderboard</h2>
        <Link to="/" className="btn-ghost">
          ← Back to menu
        </Link>
      </div>

      {loading && <div className="text-sm text-white/70">Loading…</div>}
      {err && <div className="text-sm text-red-400 mb-2">{err}</div>}
      {!loading && !rows.length && (
        <div className="text-sm text-white/60">No scores yet. Be the first to play!</div>
      )}

      {!!rows.length && (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-white/60 bg-white/5">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Player</th>
                <th className="px-4 py-2 text-right">Best Score</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={r._id || idx} className="border-t border-white/5">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{r.username}</td>
                  <td className="px-4 py-2 text-right">
                    {r.bestScore ?? r.scoreMixed}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
