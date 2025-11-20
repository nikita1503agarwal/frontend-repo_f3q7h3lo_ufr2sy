import React, { useState } from 'react'
import GlassCard from './GlassCard'

function WorkoutForm({ onSaved, backendUrl }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0,10),
    type: 'Strength',
    duration_min: '',
    intensity: 'Medium',
    notes: '',
    calories: '',
    exercises: ''
  })
  const [email, setEmail] = useState('user@example.com')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        user_email: email,
        date: form.date,
        type: form.type,
        duration_min: parseFloat(form.duration_min),
        intensity: form.intensity,
        notes: form.notes || undefined,
        calories: form.calories ? parseFloat(form.calories) : undefined,
        exercises: form.exercises ? form.exercises.split(',').map(s=>s.trim()).filter(Boolean) : undefined,
      }
      const res = await fetch(`${backendUrl}/api/workouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if(!res.ok) throw new Error('Failed to save workout')
      setForm((f)=>({...f, duration_min:'', calories:'', notes:'', exercises:''}))
      onSaved && onSaved()
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <GlassCard>
      <form onSubmit={submit} className="grid grid-cols-2 gap-3 text-white">
        <div className="col-span-2 font-semibold mb-1">Log Workout</div>
        <input name="date" value={form.date} onChange={handleChange} type="date" className="col-span-1 rounded-lg bg-white/10 border border-white/20 px-3 py-2 outline-none"/>
        <select name="type" value={form.type} onChange={handleChange} className="col-span-1 rounded-lg bg-white/10 border border-white/20 px-3 py-2">
          <option>Strength</option>
          <option>Cardio</option>
          <option>Mobility</option>
          <option>HIIT</option>
          <option>Yoga</option>
        </select>
        <input name="duration_min" value={form.duration_min} onChange={handleChange} type="number" step="1" placeholder="Minutes" className="col-span-1 rounded-lg bg-white/10 border border-white/20 px-3 py-2"/>
        <select name="intensity" value={form.intensity} onChange={handleChange} className="col-span-1 rounded-lg bg-white/10 border border-white/20 px-3 py-2">
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <input name="calories" value={form.calories} onChange={handleChange} type="number" step="1" placeholder="Calories (opt)" className="col-span-1 rounded-lg bg-white/10 border border-white/20 px-3 py-2"/>
        <input name="exercises" value={form.exercises} onChange={handleChange} placeholder="Exercises comma-separated (opt)" className="col-span-1 rounded-lg bg-white/10 border border-white/20 px-3 py-2"/>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="col-span-2 rounded-lg bg-white/10 border border-white/20 px-3 py-2"/>
        <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes (opt)" className="col-span-2 rounded-lg bg-white/10 border border-white/20 px-3 py-2"/>
        <button disabled={loading} className="col-span-2 mt-1 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 font-semibold py-2 disabled:opacity-60">{loading? 'Saving...' : 'Save Workout'}</button>
      </form>
    </GlassCard>
  )
}

export default WorkoutForm
