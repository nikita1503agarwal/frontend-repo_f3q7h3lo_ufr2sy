import React, { useEffect, useState } from 'react'
import GlassCard from './components/GlassCard'
import Header from './components/Header'
import WorkoutForm from './components/WorkoutForm'
import BodyCompForm from './components/BodyCompForm'
import Analytics from './components/Analytics'

function App() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [refreshKey, setRefreshKey] = useState(0)
  const [email, setEmail] = useState('user@example.com')
  const [workouts, setWorkouts] = useState([])
  const [body, setBody] = useState([])

  const load = async () => {
    try {
      const w = await fetch(`${backendUrl}/api/workouts?user_email=${encodeURIComponent(email)}&limit=20`).then(r=>r.json())
      const b = await fetch(`${backendUrl}/api/bodycomp?user_email=${encodeURIComponent(email)}&limit=15`).then(r=>r.json())
      setWorkouts(w)
      setBody(b)
    } catch (e) { console.error(e) }
  }

  useEffect(()=>{ load() }, [refreshKey, email])

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-48 -left-40 w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-48 -right-40 w-[28rem] h-[28rem] bg-blue-500/20 blur-3xl rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(34,211,238,0.08),transparent_30%),radial-gradient(circle_at_90%_100%,rgba(59,130,246,0.08),transparent_30%)]" />
      </div>

      <div className="max-w-xl mx-auto px-4 py-6">
        <Header />

        <div className="flex items-center gap-2 mb-4">
          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Your email to link entries" className="flex-1 rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/50 outline-none" />
          <button onClick={()=>setRefreshKey(k=>k+1)} className="rounded-xl bg-white/10 border border-white/20 text-white px-3 py-2">Reload</button>
        </div>

        <div className="grid gap-4">
          <WorkoutForm backendUrl={backendUrl} onSaved={()=>setRefreshKey(k=>k+1)} />
          <BodyCompForm backendUrl={backendUrl} onSaved={()=>setRefreshKey(k=>k+1)} />
          <Analytics backendUrl={backendUrl} email={email} key={refreshKey} />

          <GlassCard>
            <div className="text-white font-semibold mb-2">Recent Workouts</div>
            <div className="space-y-2">
              {workouts.map(w => (
                <div key={w.id} className="flex items-center justify-between text-white/90">
                  <div className="text-white/70 text-sm">{new Date(w.date).toLocaleDateString()}</div>
                  <div className="font-medium">{w.type}</div>
                  <div className="text-white/70">{w.duration_min}m</div>
                </div>
              ))}
              {workouts.length===0 && <div className="text-white/70 text-sm">No workouts yet. Log your first one above.</div>}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="text-white font-semibold mb-2">Body Composition</div>
            <div className="space-y-2">
              {body.map(b => (
                <div key={b.id} className="grid grid-cols-3 text-white/90 gap-2 items-center">
                  <div className="text-white/70 text-sm">{new Date(b.date).toLocaleDateString()}</div>
                  <div>{b.weight_kg ? `${b.weight_kg} kg` : '-'}</div>
                  <div className="text-white/70 text-sm">{b.body_fat_pct ? `${b.body_fat_pct}%` : ''}</div>
                </div>
              ))}
              {body.length===0 && <div className="text-white/70 text-sm">No measurements yet. Add one above.</div>}
            </div>
          </GlassCard>
        </div>

        <div className="py-8 text-center text-white/50 text-xs">NeoGlass glassmorphism UI • Mobile-first layout</div>
      </div>
    </div>
  )
}

export default App
