import { Link } from 'react-router-dom'
import { Hexagon, Truck } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-dvh flex-col bg-slate-950 lg:flex-row">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-slate-900 lg:flex lg:w-1/2 p-8 xl:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
        
        {/* Animated Background Nodes for "Wow Factor" */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
          {[...Array(50)].map((_, i) => {
            const startX = (i * 87 + 13) % 800;
            const startY = (i * 123 + 47) % 1000;
            return (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-brand-400 rounded-full blur-[1px]"
                initial={{ x: startX, y: startY, opacity: 0.5 + (i % 5)*0.1 }}
                animate={{
                  x: [startX, (startX + 200) % 800, (startX - 100) % 800, startX],
                  y: [startY, (startY - 150) % 1000, (startY + 200) % 1000, startY],
                  opacity: [0.5, 1, 0.3, 0.5],
                  scale: [1, 1.5, 0.8, 1]
                }}
                transition={{
                  duration: 20 + (i % 15),
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            )
          })}
          {[...Array(20)].map((_, i) => {
            const startX = (i * 60) % 800;
            const startY = (i * 100) % 1000;
            return (
              <motion.div
                key={`line-${i}`}
                className="absolute h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent"
                style={{ width: `${100 + (i * 30)}px`, transform: `rotate(${i * 37}deg)` }}
                initial={{ x: startX, y: startY, opacity: 0.5 }}
                animate={{
                  x: [startX, (startX + 150) % 800, startX],
                  y: [startY, (startY + 100) % 1000, startY],
                  opacity: [0.5, 0.8, 0.2, 0.5]
                }}
                transition={{
                  duration: 15 + (i % 10),
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            )
          })}
        </div>

        {/* Cyber Trucks */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div
            initial={{ x: -200 }}
            animate={{ x: '100vw' }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/4 text-brand-400 flex items-center gap-2"
          >
            <Truck size={72} className="drop-shadow-[0_0_25px_rgba(14,165,233,1)]" />
            <div className="w-48 h-1.5 bg-brand-400 rounded-full blur-[4px]" />
          </motion.div>

          <motion.div
            initial={{ x: '100vw' }}
            animate={{ x: -200 }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear', delay: 3 }}
            className="absolute top-1/3 flex items-center gap-2"
            style={{ transform: 'scaleX(-1)' }}
          >
            <Truck size={56} className="text-accent drop-shadow-[0_0_25px_rgba(16,185,129,1)]" />
            <div className="w-32 h-1.5 bg-accent rounded-full blur-[4px]" />
          </motion.div>

          <motion.div
            initial={{ x: -200 }}
            animate={{ x: '100vw' }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear', delay: 7 }}
            className="absolute top-[40%] text-purple-500 flex items-center gap-2"
          >
            <Truck size={64} className="drop-shadow-[0_0_25px_rgba(168,85,247,1)]" />
            <div className="w-64 h-1.5 bg-purple-500 rounded-full blur-[4px]" />
          </motion.div>
        </div>
        
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white hover:text-brand-300 transition-colors">
            <Hexagon size={28} className="text-brand-400" />
            <span className="text-xl font-bold heading-font tracking-wide">CargoLoop</span>
          </Link>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-16 max-w-lg"
          >
            <h2 className="text-3xl font-bold leading-tight heading-font text-white xl:text-5xl">
              Logistics intelligence, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent">fully autonomous.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-400">
              Join the premier network connecting shippers with intelligent backhaul capacity. Reduce deadhead miles, cut carbon emissions, and optimize your freight operations instantly.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10">
          <p className="text-sm text-slate-500 font-medium">Enterprise Grade · FAR AWAY 2026</p>
        </div>
      </aside>

      <main className="flex flex-1 flex-col relative overflow-hidden bg-slate-950">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex items-center justify-between px-6 py-4 lg:px-12 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white hover:text-brand-300 lg:hidden">
            <Hexagon size={24} className="text-brand-400" />
            <span className="font-bold heading-font">CargoLoop</span>
          </Link>
          <div className="hidden lg:block" />
          <Link
            to="/"
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Back to portal
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 pb-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[420px]"
          >
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold heading-font text-white">{title}</h1>
              {subtitle && (
                <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
              )}
            </div>

            {children}

            {footer && <div className="mt-6 text-center text-sm font-medium text-slate-400">{footer}</div>}
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export function AuthDivider() {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-800" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-slate-950 px-4 text-slate-500 font-medium">or continue with email</span>
      </div>
    </div>
  )
}

export const authInputClass =
  'mt-1 w-full rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-sm'

export const authLabelClass = 'text-sm font-medium text-slate-300'
