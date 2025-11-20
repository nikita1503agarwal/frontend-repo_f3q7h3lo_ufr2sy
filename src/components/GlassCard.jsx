import React from 'react'

function GlassCard({ children, className = '' }) {
  return (
    <div className={`relative rounded-2xl p-4 sm:p-5 md:p-6 backdrop-blur-xl bg-white/10 border border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_10px_30px_rgba(2,6,23,0.35)] ${className}`}>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default GlassCard
