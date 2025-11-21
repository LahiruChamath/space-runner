import { useEffect, useState } from 'react'
import { me } from '../lib/auth'

export default function ProtectedRoute({ children }){
  const [ok, setOk] = useState(false)
  useEffect(() => { me().then(()=>setOk(true)).catch(()=>setOk(false)) }, [])
  if (!ok) return <div className="py-20 text-center">Please login to continue.</div>
  return children
}
