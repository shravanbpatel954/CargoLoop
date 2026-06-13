import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Leaf,
  MapPin,
  Sparkles,
  Truck,
  Zap,
  Shield,
  Smartphone,
  Hexagon,
  Activity,
  CheckCircle2,
  XCircle,
  Play
} from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

const stats = [
  { value: '35%', label: 'Deadhead Ratio' },
  { value: '18%', label: 'Profit Bleed via Fuel' },
  { value: '1.2B', label: 'Tons of Wasted CO₂' },
  { value: '₹0', label: 'Revenue on Returns' },
]

const steps = [
  { n: '01', title: 'Capacity Tokenization', text: 'Carriers broadcast their empty return routes and vehicle specifications.' },
  { n: '02', title: 'Agentic Load Parsing', text: 'Shippers type requirements. Gemini AI instantly geocodes and configures the load.' },
  { n: '03', title: 'Algorithmic Match Engine', text: 'Our system evaluates Haversine distance, trust scores, and cold-chain constraints.' },
  { n: '04', title: 'Yield Optimization', text: 'Carriers monetize deadhead miles while shippers secure capacity at competitive rates.' },
]

const features = [
  {
    icon: Zap,
    title: 'Agentic Dispatch',
    text: 'Ditch manual forms. Gemini AI instantly extracts load constraints, geocodes locations, and initiates searches from natural text.',
  },
  {
    icon: Sparkles,
    title: 'Algorithmic Fleet Matching',
    text: 'A proprietary recommendation engine matching idle capacity with pending shipments using predictive routing overlap.',
  },
  {
    icon: Shield,
    title: 'Enterprise Trust Scoring',
    text: 'A robust verification pipeline assessing carrier reliability through historical performance and RC document validation.',
  },
  {
    icon: MapPin,
    title: 'Dynamic Risk Radar',
    text: 'Command center UI with live fleet tracking, proactively flagging weather anomalies and suggesting algorithmic reroutes.',
  },
  {
    icon: Activity,
    title: 'Predictive Economics',
    text: 'Real-time telemetry on revenue generated from backhauls and overall fleet efficiency metrics.',
  },
  {
    icon: Leaf,
    title: 'Carbon Tokenization',
    text: 'Automatically quantify your environmental impact by tracking precise CO₂ emissions avoided via combined journeys.',
  },
]

const liveUpdates = [
  "Agentic Match: 14t Cold-Chain (Saved 82kg CO₂)",
  "Yield Optimized: ₹5,200 recovered on return route",
  "Algorithmic Pairing: 5t Electronics matched in 1.2s",
  "Risk Alert: Rerouting fleet to avoid Nashik sector",
  "Capacity Tokenized: 20t General Cargo added",
  "Impact: 45 liters of fuel conserved on recent run",
]

const impactMetrics = [
  { label: 'Deadhead Miles Saved', value: 124500, suffix: '+' },
  { label: 'Yield Recovered', value: 8500000, prefix: '₹', suffix: '+' },
  { label: 'Green Credits Generated', value: 3200, suffix: ' kg' },
  { label: 'Fleet ROI Increase', value: 42, suffix: '%' },
]

function AnimatedCounter({ value, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const incrementTime = 20;
      const steps = duration / incrementTime;
      const stepValue = end / steps;

      const timer = setInterval(() => {
        start += stepValue;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [value, isInView]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

function LiveFleetPulse() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % liveUpdates.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mt-14 max-w-2xl mx-auto">
      <div className="glass-panel rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden border-brand-500/20">
        <div className="absolute top-0 left-0 w-1 h-full bg-brand-500 animate-pulse" />
        <div className="bg-brand-500/10 p-2 rounded-lg text-brand-400 shrink-0 relative">
          <Activity size={20} />
          <div className="absolute top-0 right-0 w-2 h-2 bg-brand-400 rounded-full animate-ping" />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Global Fleet Pulse (Live)</p>
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm font-medium text-white truncate"
          >
            {liveUpdates[currentIndex]}
          </motion.p>
        </div>
      </div>
    </div>
  )
}

function CyberNetworkGrid() {
  return (
    <div className="absolute inset-x-0 top-0 h-[90vh] pointer-events-none overflow-hidden opacity-60 z-0">
      {/* 3D Perspective Floor Grid */}
      <div 
        className="absolute bottom-0 left-0 w-full h-[70vh]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(14, 165, 233, 0.15) 1px, transparent 1px),
            linear-gradient(to top, rgba(14, 165, 233, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: 'perspective(600px) rotateX(65deg) translateY(100px)',
          transformOrigin: 'bottom',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)'
        }}
      >
         <motion.div
            className="w-full h-[200%]"
            animate={{ y: [0, 50] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{
              backgroundImage: `linear-gradient(to top, rgba(14, 165, 233, 0.3) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
         />
      </div>

      {/* Floating Network Nodes */}
      {[...Array(40)].map((_, i) => {
        const startX = (i * 137) % 1500;
        const startY = (i * 83) % 800;
        return (
          <motion.div
            key={`node-${i}`}
            className="absolute w-2 h-2 bg-brand-400 rounded-full blur-[1px]"
            initial={{ x: startX, y: startY, opacity: 0.5 }}
            animate={{
              y: [startY, startY - 150, startY],
              opacity: [0.2, 0.9, 0.2],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{ duration: 15 + (i % 15), repeat: Infinity, ease: 'linear' }}
          />
        )
      })}

      {/* Cyber Trucks */}
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
  )
}

function BootSplash({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 2800)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div 
      className="fixed inset-0 z-[1000] bg-slate-950 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div className="relative w-64 h-32 flex items-center justify-center">
         {/* Animated Road Lines */}
         <div className="absolute bottom-0 w-[200%] h-px border-t-2 border-dashed border-brand-500/50 flex">
           <motion.div 
             className="w-full h-full"
             animate={{ x: ['0%', '-50%'] }}
             transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
             style={{ backgroundImage: 'linear-gradient(to right, transparent 50%, #0ea5e9 50%)', backgroundSize: '40px 100%' }}
           />
         </div>
         
         {/* Driving Truck */}
         <motion.div 
           animate={{ y: [0, -5, 0], x: [-10, 10, -10] }} 
           transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
           className="relative z-10 text-brand-400"
         >
           <Truck size={80} className="drop-shadow-[0_0_25px_rgba(14,165,233,0.8)]" />
           <motion.div 
             animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
             transition={{ duration: 0.5, repeat: Infinity }}
             className="absolute top-1/2 -right-4 w-12 h-2 bg-brand-400 blur-sm rounded-full"
           />
         </motion.div>
      </div>
      
      <div className="mt-8 text-center">
        <motion.p 
          animate={{ opacity: [0.5, 1, 0.5] }} 
          transition={{ duration: 1.2, repeat: Infinity }}
          className="text-white font-bold tracking-[0.2em] uppercase text-lg mb-2 heading-font"
        >
          Initializing CargoLoop AI
        </motion.p>
        <p className="text-brand-400/60 text-xs uppercase tracking-widest mb-6">Optimizing autonomous routes...</p>
        
        <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden mx-auto relative">
          <motion.div 
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.5, ease: "circOut" }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-600 to-brand-400 shadow-[0_0_15px_rgba(14,165,233,1)]"
          />
        </div>
      </div>
    </motion.div>
  )
}

export default function Landing() {
  const [isBooting, setIsBooting] = useState(true)

  // Staggered text animation variants
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.4 }
    }
  }
  
  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-brand-500/30 overflow-x-hidden">
      {isBooting && <BootSplash onComplete={() => setIsBooting(false)} />}
      
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.1),transparent_50%)]" />

      <header className="relative border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-xl z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2 text-white">
            <Hexagon className="text-brand-400" size={24} />
            <span className="font-bold heading-font tracking-wide text-lg">CargoLoop</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-400 hover:text-white transition-colors hidden sm:block"
            >
              Sign in
            </Link>
            <Link
              to="/login"
              className="relative overflow-hidden rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-950 hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 group"
            >
              <span className="relative z-10">Get started</span>
              <motion.div 
                className="absolute inset-0 bg-brand-400/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
            </Link>
          </div>
        </div>
      </header>

      {/* SECTION 1 - HERO */}
      <section className="relative mx-auto max-w-7xl px-6 py-20 md:py-32 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/20 rounded-full blur-[120px] pointer-events-none opacity-50" />
        <CyberNetworkGrid />
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isBooting ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-4xl text-center mx-auto flex flex-col items-center"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isBooting ? 0 : 1, scale: isBooting ? 0.8 : 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-400 mb-8 tracking-wider uppercase shadow-[0_0_15px_rgba(14,165,233,0.2)]"
          >
            <Sparkles size={14} className="animate-pulse" /> Turning Empty Miles Into Opportunity
          </motion.span>
          
          {!isBooting && (
            <motion.h1 
              variants={containerVars}
              initial="hidden"
              animate="show"
              className="text-5xl font-extrabold leading-[1.1] text-white md:text-7xl heading-font tracking-tight flex flex-col items-center"
            >
              <div className="flex flex-wrap justify-center gap-x-4">
                {['Every', 'Empty', 'Mile', 'Is'].map((word, i) => (
                  <motion.span key={i} variants={itemVars}>{word}</motion.span>
                ))}
              </div>
              <motion.span 
                variants={itemVars}
                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-brand-200 to-accent mt-2 drop-shadow-lg"
              >
                A Wasted Asset.
              </motion.span>
            </motion.h1>
          )}

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isBooting ? 0 : 1, y: isBooting ? 20 : 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 text-lg leading-relaxed text-slate-400 md:text-xl max-w-2xl mx-auto"
          >
            35% of trucks run empty after delivery. CargoLoop deploys Agentic AI to autonomously pair idle fleet capacity with real-time shipment demand—recovering lost margins and slashing carbon emissions.
          </motion.p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/login"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-brand-500 px-8 py-4 font-bold text-white hover:bg-brand-400 transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:scale-105 active:scale-95"
            >
              Initialize Command Center
              <ArrowRight size={18} />
            </Link>
          </div>
          
          <LiveFleetPulse />
        </motion.div>
      </section>

      {/* SECTION 2 - THE PROBLEM */}
      <section className="relative border-y border-slate-800 bg-slate-900/20 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
             <h2 className="text-3xl font-bold heading-font text-white tracking-tight">The Hidden Cost of Empty Miles</h2>
             <p className="mt-4 text-slate-400">The logistics industry is bleeding margins due to structural inefficiencies.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={s.label} 
                className="text-center md:text-left border-l-2 border-brand-500/20 pl-6"
              >
                <p className="text-4xl font-extrabold heading-font text-white">{s.value}</p>
                <p className="mt-2 text-sm font-medium text-slate-400 uppercase tracking-wider">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 - HOW CARGOLOOP WORKS */}
      <section className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold heading-font text-white md:text-4xl tracking-tight">How CargoLoop Works</h2>
          <p className="mt-4 text-slate-400 text-lg">A simple 4-step workflow to turn unused capacity into revenue.</p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10, scale: 1.02 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
              key={step.n}
              className="group relative rounded-3xl border border-slate-800 bg-slate-900/50 p-8 hover:bg-slate-800/80 transition-all shadow-lg hover:shadow-brand-500/10 cursor-default"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 opacity-50">
                   <ArrowRight className="text-brand-500" />
                </div>
              )}
              <span className="text-5xl font-black heading-font text-slate-800 transition-colors group-hover:text-brand-500/40">{step.n}</span>
              <h3 className="mt-6 text-xl font-bold text-white heading-font leading-tight">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-slate-400 text-sm">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 4 - WHY CARGOLOOP IS DIFFERENT */}
      <section className="relative border-t border-slate-800 bg-slate-900/30 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.05),transparent_70%)]" />
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
             <h2 className="text-3xl font-bold heading-font text-white tracking-tight">Why CargoLoop Is Different</h2>
             <p className="mt-4 text-slate-400">A paradigm shift from manual marketplaces to intelligent optimization.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Traditional Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-slate-800 bg-slate-950 p-10"
            >
              <h3 className="text-2xl font-bold text-white mb-6 heading-font flex items-center gap-3">
                <XCircle className="text-rose-500" />
                Traditional Freight Platforms
              </h3>
              <ul className="space-y-4">
                {[
                  "Manual load boards & phone calls",
                  "Reactive, delayed matching",
                  "Zero visibility into actual capacity",
                  "No carbon tracking or incentives"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-400">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* CargoLoop Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-brand-500/40 bg-brand-500/5 p-10 relative overflow-hidden shadow-[0_0_30px_rgba(14,165,233,0.1)]"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Hexagon size={120} className="text-brand-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 heading-font flex items-center gap-3 relative z-10">
                <CheckCircle2 className="text-brand-400" />
                CargoLoop
              </h3>
              <ul className="space-y-4 relative z-10">
                {[
                  "Agentic natural language parsing",
                  "Instant algorithmic pairing",
                  "Enterprise-grade trust scoring",
                  "Automated Green Credit generation"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white font-medium">
                    <Sparkles size={18} className="text-brand-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 5 - PLATFORM CAPABILITIES */}
      <section className="relative border-t border-slate-800 bg-slate-950 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
             <h2 className="text-3xl font-bold heading-font text-white tracking-tight">Platform Capabilities</h2>
             <p className="mt-4 text-slate-400">Tools designed to deliver tangible business value.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text }, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: 'spring' }}
                key={title} 
                className="group rounded-3xl border border-slate-800 bg-slate-900/40 p-8 hover:border-brand-500/50 transition-colors shadow-xl hover:shadow-brand-500/20 cursor-default relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="mb-6 inline-flex rounded-2xl bg-brand-500/10 p-4 text-brand-400 ring-1 ring-brand-500/20 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-white heading-font relative z-10">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400 relative z-10">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 - LIVE IMPACT */}
      <section className="relative border-t border-slate-800 bg-slate-900/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
             <h2 className="text-3xl font-bold heading-font text-white tracking-tight">Live Impact</h2>
             <p className="mt-4 text-slate-400">Measurable results driving a more efficient logistics network.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {impactMetrics.map((metric, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={metric.label} 
                className="text-center p-8 rounded-3xl bg-slate-950 border border-slate-800"
              >
                <div className="text-4xl font-extrabold heading-font text-brand-400 drop-shadow-[0_0_10px_rgba(14,165,233,0.5)]">
                  <AnimatedCounter value={metric.value} prefix={metric.prefix} suffix={metric.suffix} />
                </div>
                <p className="mt-4 text-sm font-semibold text-white uppercase tracking-wider">{metric.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 - FOOTER */}
      <footer className="relative border-t border-slate-800 py-16 text-center text-sm text-slate-500 font-medium bg-slate-950">
        <div className="mx-auto flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 text-white/80">
            <Hexagon className="text-brand-500" size={28} />
            <span className="font-bold heading-font tracking-wide text-xl">CargoLoop</span>
          </div>
          
          <p className="text-brand-400/80 font-semibold tracking-wide">Turning Empty Miles Into Opportunity</p>
          
          <div className="flex flex-col gap-2 mt-4">
            <p>Built by Team StackStorm</p>
            <p>FAR AWAY 2026 – Logistics & Transit</p>
          </div>
          
          <a 
            href="https://github.com/shravanbpatel954/CargoLoop" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-800 hover:border-slate-600 hover:text-white hover:bg-slate-900 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            <span>View Source on GitHub</span>
          </a>
        </div>
      </footer>
    </div>
  )
}
