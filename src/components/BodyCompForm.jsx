import React, { useState } from 'react'
import GlassCard from './GlassCard'

function BodyCompForm({ onSaved, backendUrl }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0,10),
    weight_kg: '',
    body_fat_pct: '',
    waist_cm: '',
    hips_cm: '',
    chest_cm: ''
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
        weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : undefined,
        body_fat_pct: form.body_fat_pct ? parseFloat(form.body_fat_pct) : undefined,
        waist_cm: form.waist_cm ? parseFloat(form.waist_cm) : undefined,
        hips_cm: form.hips_cm ? parseFloat(form.hips_cm) : undefined,
        chest_cm: form.chest_cm ? parseFloat(form.chest_cm) : undefined,
      }
      const res = await fetch(`${backendUrl}/api/bodycomp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if(!res.ok) throw new Error('Failed to save measurement')
      setForm({ date: new Date().toISOString().slice(0,10), weight_kg:'', body_fat_pct:'', waist_cm:'', hips_cm:'', chest_cm:'' })
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
        <div className="col-span-2 font-semibold mb-1">Body Composition</div>
        <input name="date" value={form.date} onChange={handleChange} type="date" className="col-span-1 rounded-lg bg-white/10 border border-white/20 px-3 py-2 outline-none"/>
        <input name="weight_kg" value={form.weight_kg} onChange={handleChange} type="number" step="0.1" placeholder="Weight (kg)" className="col-span-1 rounded-lg bg-white/10 border border-white/20 px-3 py-2"/>
        <input name="body_fat_pct" value={form.body_fat_pct} onChange={handleChange} type="number" step="0.1" placeholder="Body fat %" className="col-span-1 rounded-lg bg-white/10 border border-white/20 px-3 py-2"/>
        <input name="waist_cm" value={form.waist_cm} onChange={handleChange} type="number" step="0.1" placeholder="Waist (cm)" className="col-span-1 rounded-lg bg-white/10 border border-white/20 px-3 py-2"/>
        <input name="hips_cm" value={form.hips_cm} onChange={handleChange} type="number" step="0.1" placeholder="Hips (cm)" className="col-span-1 rounded-lg bg-white/10 border border-white/20 px-3 py-2"/>
        <input name="chest_cm" value={form.chest_cm} onChange={handleChange} type="number" step="0.1" placeholder="Chest (cm)" className="col-span-1 rounded-lg bg-white/10 border border-white/20 px-3 py-2"/>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="col-span-2 rounded-lg bg-white/10 border border-white/20 px-3 py-2"/>
        <button disabled={loading} className="col-span-2 mt-1 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-semibold py-2 disabled:opacity-60">{loading? 'Saving...' : 'Save Measurement'}</button>
      </form>
    </GlassCard>
  )
}

export default BodyCompForm
