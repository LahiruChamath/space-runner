import { useEffect, useState } from 'react'
import { me } from '../lib/auth'

export default function Profile(){
  const [u, setU] = useState(null)
  useEffect(() => { me().then(setU).catch(()=>{}) }, [])
  if (!u) return <div className="py-20 text-center">Not logged in.</div>
  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      <div className="card p-4 space-y-2">
        <div><span className="text-white/60">Username:</span> {u.username}</div>
        <div><span className="text-white/60">Email:</span> {u.email}</div>
        <div><span className="text-white/60">Joined:</span> {new Date(u.createdAt).toLocaleString()}</div>
      </div>
    </div>
  )
}
