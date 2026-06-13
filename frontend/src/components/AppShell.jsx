import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Truck,
  Route as RouteIcon,
  BarChart3,
  LogOut,
  Menu,
  X,
  Hexagon
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import MobileNav from './MobileNav'
import { motion, AnimatePresence } from 'framer-motion'

const ALL_NAV = [
  { to: '/app', label: 'Command Center', icon: LayoutDashboard, end: true, roles: ['shipper', 'carrier', 'admin'] },
  { to: '/app/loads', label: 'Dispatch', icon: Package, roles: ['shipper', 'admin'] },
  { to: '/app/vehicles', label: 'Fleet Hub', icon: Truck, roles: ['carrier', 'admin'] },
  { to: '/app/matches', label: 'Autonomous Match', icon: RouteIcon, roles: ['shipper', 'carrier', 'admin'] },
  { to: '/app/analytics', label: 'Impact Data', icon: BarChart3, roles: ['shipper', 'carrier', 'admin'] },
]

const roleLabels = {
  shipper: 'Shipper',
  carrier: 'Carrier',
  admin: 'Admin',
}

function NavItem({ to, label, icon: Icon, end, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all ${
          isActive
            ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-[0_0_15px_rgba(14,165,233,0.1)]'
            : 'text-slate-400 border border-transparent hover:bg-slate-800/50 hover:text-slate-200'
        }`
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  )
}

export default function AppShell() {
  const { user, logout, role } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = useMemo(
    () => ALL_NAV.filter((item) => item.roles.includes(role)),
    [role],
  )

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-slate-950 text-slate-200">
      <aside className="hidden w-72 flex-shrink-0 border-r border-slate-800 bg-slate-950/80 p-6 lg:flex flex-col z-20 backdrop-blur-xl sticky top-0 h-screen">
        <BrandBlock />
        
        <div className="mb-8 mt-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <div className="flex items-center gap-3">
            {user?.photo ? (
              <img src={user.photo} alt="" className="h-10 w-10 rounded-full border border-slate-700" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-brand-500/20 flex items-center justify-center border border-brand-500/30 text-brand-400 font-bold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="truncate text-sm font-bold text-white">{user?.name}</p>
              <p className="text-xs font-medium text-brand-400 mt-0.5">{roleLabels[role]}</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
          {role === 'admin' && (
          <NavLink
            to="/app/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white border border-transparent'
              }`
            }
          >
            <ShieldAlert size={18} />
            Verification
          </NavLink>
        )}
      </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-colors"
        >
          <LogOut size={18} />
          Log out
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 px-4 py-4 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
               <Hexagon size={20} className="text-brand-400" />
               <span className="text-lg font-bold heading-font text-white tracking-wide">CargoLoop</span>
            </div>
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <AnimatePresence>
            {menuOpen && (
              <motion.nav 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 space-y-2 border-t border-slate-800 pt-4 overflow-hidden"
              >
                <div className="mb-4 flex items-center gap-3 px-2">
                  <div className="h-8 w-8 rounded-full bg-brand-500/20 flex items-center justify-center border border-brand-500/30 text-brand-400 font-bold text-xs">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{user?.name}</p>
                    <p className="text-xs text-brand-400">{roleLabels[role]}</p>
                  </div>
                </div>
                {navItems.map((item) => (
                  <NavItem key={item.to} {...item} onClick={() => setMenuOpen(false)} />
                ))}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-400"
                >
                  <LogOut size={18} />
                  Log out
                </button>
              </motion.nav>
            )}
          </AnimatePresence>
        </header>

        <main className="flex-1 p-4 pb-24 md:p-8 lg:pb-8 relative z-10 overflow-x-hidden">
          <Outlet />
        </main>

        <MobileNav items={navItems} />
      </div>
    </div>
  )
}

function BrandBlock() {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-brand-500/10 p-2 rounded-xl border border-brand-500/20 text-brand-400 shadow-[0_0_15px_rgba(14,165,233,0.15)]">
         <Hexagon size={24} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Enterprise</p>
        <h1 className="text-xl font-bold leading-tight text-white heading-font">CargoLoop</h1>
      </div>
    </div>
  )
}
