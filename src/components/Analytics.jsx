import React, { useEffect, useState } from 'react'
import GlassCard from './GlassCard'

function Line({ points, color='stroke-cyan-400' }){
  if(!points || points.length===0) return null
  const width = 260, height = 80, pad = 10
  const xs = points.map((p)=>p.x)
  const ys = points.map((p)=>p.y)
  const minY = Math.min(...ys), maxY = Math.max(...ys)
  const dx = (width - pad*2) / Math.max(1, points.length-1)
  const norm = (v)=> maxY===minY ? height/2 : height - pad - ((v - minY) / (maxY - minY)) * (height - pad*2)
  let d = ''
  points.forEach((p,i)=>{
    const x = pad + i*dx
    const y = norm(p.y)
    d += (i===0? 'M':' L') + x + ' ' + y
  })
  return (
    <svg width={width} height={height} className="overflow-visible">
      <path d={d} className={`${color} fill-none`} strokeWidth={2.5} strokeLinecap="round"/>
    </svg>
  )
}

function Analytics({ backendUrl, email }) {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async ()=>{
    setLoading(true)
    try{
      const res = await fetch(`${backendUrl}/api/insights?user_email=${encodeURIComponent(email)}&days=30`)
      const data = await res.json()
      setInsights(data)
    }catch(e){
      console.error(e)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{ load() },[])

  if(loading) return <GlassCard><div className="text-white">Loading analytics...</div></GlassCard>
  if(!insights) return <GlassCard><div className="text-white">No data yet.</div></GlassCard>

  const volPoints = Object.entries(insights.volume_by_day || {}).sort((a,b)=>a[0].localeCompare(b[0])).map(([x,y])=>({x, y:Number(y)}))

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <GlassCard>
        <div className="text-white font-semibold mb-2">Overview (30d)</div>
        <div className="grid grid-cols-4 gap-2 text-white/90 text-sm">
          <div className="col-span-1 rounded-xl bg-white/10 border border-white/20 p-3">
            <div className="text-xs text-white/60">Sessions</div>
            <div className="text-xl font-bold">{insights.totals.sessions}</div>
          </div>
          <div className="col-span-1 rounded-xl bg-white/10 border border-white/20 p-3">
            <div className="text-xs text-white/60">Minutes</div>
            <div className="text-xl font-bold">{insights.totals.minutes}</div>
          </div>
          <div className="col-span-1 rounded-xl bg-white/10 border border-white/20 p-3">
            <div className="text-xs text-white/60">Avg Min</div>
            <div className="text-xl font-bold">{insights.totals.avg_duration}</div>
          </div>
          <div className="col-span-1 rounded-xl bg-white/10 border border-white/20 p-3">
            <div className="text-xs text-white/60">Streak</div>
            <div className="text-xl font-bold">{insights.totals.streak_days}d</div>
          </div>
        </div>
      </GlassCard>
      <GlassCard>
        <div className="text-white font-semibold mb-2">Volume by Day</div>
        <Line points={volPoints} />
      </GlassCard>
      <GlassCard>
        <div className="text-white font-semibold mb-2">Workout Mix</div>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(insights.types||{}).map(([k,v])=> (
            <div key={k} className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm">{k}: {v}</div>
          ))}
          {Object.keys(insights.types||{}).length===0 && <div className="text-white/70 text-sm">No workouts logged yet</div>}
        </div>
      </GlassCard>
      <GlassCard>
        <div className="text-white font-semibold mb-2">Suggestions</div>
        <ul className="list-disc list-inside text-white/90 text-sm space-y-1">
          {(insights.suggestions||[]).map((s,i)=> <li key={i}>{s}</li>)}
          {(!insights.suggestions || insights.suggestions.length===0) && <li>Keep up the great work!</li>}
        </ul>
      </GlassCard>
    </div>
  )
}

export default Analytics
