export default function LeaderboardTable({ rows, type='time' }){
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="text-white/70">
          <tr>
            <th className="py-2 pr-4">#</th>
            <th className="py-2 pr-4">Player</th>
            {type==='time' ? <th className="py-2 pr-4">Time (s)</th> : <th className="py-2 pr-4">Score</th>}
            <th className="py-2 pr-4">Dodges</th>
            <th className="py-2 pr-4">Correct</th>
            <th className="py-2 pr-4">Wrong</th>
            <th className="py-2 pr-4">When</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r,i) => (
            <tr key={r._id} className="border-t border-white/10">
              <td className="py-2 pr-4">{i+1}</td>
              <td className="py-2 pr-4">{r.username}</td>
              {type==='time' ? (
                <td className="py-2 pr-4">{(r.durationMs/1000).toFixed(2)}</td>
              ) : (
                <td className="py-2 pr-4">{r.scoreMixed}</td>
              )}
              <td className="py-2 pr-4">{r.dodges}</td>
              <td className="py-2 pr-4">{r.correctAnswers}</td>
              <td className="py-2 pr-4">{r.wrongAnswers}</td>
              <td className="py-2 pr-4">{new Date(r.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
