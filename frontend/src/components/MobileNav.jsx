import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function MobileNav({ items }) {
  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 lg:hidden pointer-events-none">
      <div className="mx-auto max-w-sm rounded-3xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-2xl shadow-2xl p-1 pointer-events-auto flex items-stretch justify-around">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex min-w-0 flex-1 flex-col items-center gap-1 px-2 py-3 text-[10px] font-semibold sm:text-xs transition-colors rounded-2xl ${
                isActive ? 'text-white bg-slate-800/80' : 'text-slate-500 hover:text-slate-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-brand-400" : ""} />
                <span className="truncate">{label}</span>
                {isActive && (
                   <motion.div layoutId="activeTab" className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-brand-500 rounded-full shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
