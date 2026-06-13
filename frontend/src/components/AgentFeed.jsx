import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, CheckCircle2, AlertCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react'

export default function AgentFeed() {
  const [feed, setFeed] = useState([])
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    // We connect to the WebSocket endpoint for live autonomous match feeds
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const ws = new WebSocket(`${protocol}//localhost:8000/ws/agent`)
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setFeed(prev => {
        const newFeed = [{ ...data, id: Date.now(), time: new Date().toLocaleTimeString('en-US', { hour12: false }) }, ...prev]
        return newFeed.slice(0, 50)
      })
    }
    
    return () => ws.close()
  }, [])

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const getTypeStyle = (type) => {
    if (type === 'match_made') return { color: 'text-green-400', border: 'border-green-500/30', bg: 'bg-green-500/10', icon: CheckCircle2, label: 'RECOMMENDED MATCH' }
    if (type === 'match_suggested') return { color: 'text-yellow-400', border: 'border-yellow-500/30', bg: 'bg-yellow-400/10', icon: AlertCircle, label: 'HUMAN REVIEW REQUIRED' }
    return { color: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/10', icon: XCircle, label: 'NO MATCH FOUND' }
  }

  return (
    <div className="glass-panel p-5 rounded-2xl flex flex-col h-full overflow-hidden border-brand-500/20 shadow-xl relative">
       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 via-purple-500 to-transparent opacity-50" />
       
       <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800">
         <h2 className="font-bold heading-font text-white flex items-center gap-2 group cursor-help">
           <Bot size={20} className="text-brand-400" />
           CargoLoop Agent Feed
           <div className="hidden group-hover:block absolute top-12 left-4 z-50 bg-slate-900 border border-slate-700 p-3 rounded-lg text-xs font-normal text-slate-300 shadow-2xl w-64 leading-relaxed">
             <span className="font-bold text-white">How is this different?</span><br />
             BlackBuck requires human dispatch. CargoLoop's agent scans unmatched loads and capacity listings autonomously every 60 seconds — no dispatcher in the loop.
           </div>
         </h2>
         <div className="flex items-center gap-2">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live</span>
           <span className="relative flex h-3 w-3">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
           </span>
         </div>
       </div>

       <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
         {feed.length === 0 ? (
           <div className="h-full flex items-center justify-center text-slate-500 text-sm">
             Waiting for agent cycle...
           </div>
         ) : (
           <AnimatePresence>
             {feed.map((item) => {
               const style = getTypeStyle(item.type)
               const Icon = style.icon
               const isExpanded = expandedId === item.id

               return (
                 <motion.div 
                   key={item.id}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   className={`p-3 rounded-xl border ${style.border} ${style.bg} transition-all cursor-pointer hover:bg-slate-800/50`}
                   onClick={() => toggleExpand(item.id)}
                 >
                   <div className="flex justify-between items-start mb-2">
                     <div className="flex items-center gap-2">
                       <span className="text-xs font-mono text-slate-500">{item.time}</span>
                       <Icon size={14} className={style.color} />
                       <span className={`text-xs font-bold uppercase tracking-wider ${style.color}`}>
                         {style.label}
                       </span>
                     </div>
                     <span className="text-xs font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                       Score: {Math.round(item.score)}/100
                     </span>
                   </div>

                   <p className="text-sm font-bold text-slate-200 truncate mb-1">
                     Load: {item.load_details}
                   </p>
                   <p className="text-xs text-slate-400 truncate mb-2">
                     Carrier: {item.carrier_details}
                   </p>

                   <div className="relative">
                     <p className={`text-xs italic text-slate-300 font-medium border-l-2 pl-2 border-slate-600 ${isExpanded ? '' : 'line-clamp-2'}`}>
                       "{item.explanation}"
                     </p>
                     <div className="flex justify-end mt-1">
                       {isExpanded ? <ChevronUp size={14} className="text-slate-500"/> : <ChevronDown size={14} className="text-slate-500"/>}
                     </div>
                   </div>
                 </motion.div>
               )
             })}
           </AnimatePresence>
         )}
       </div>
    </div>
  )
}
