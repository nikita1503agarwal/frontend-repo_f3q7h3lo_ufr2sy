import React from 'react'

function Header() {
  return (
    <div className="sticky top-0 z-30 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-blue-500/30" />
          <div className="text-white font-semibold tracking-tight">NeoGlass Fit</div>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/70">
          <span className="hidden sm:inline">Today</span>
          <span className="px-2 py-1 rounded-lg bg-white/10 border border-white/20">{new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}

export default Header
