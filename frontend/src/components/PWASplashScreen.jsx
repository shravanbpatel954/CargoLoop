import { useEffect, useState } from 'react'
import { Truck } from 'lucide-react'

export default function PWASplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('cargoloop-splash-shown') === 'true') {
      onComplete()
      return
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          localStorage.setItem('cargoloop-splash-shown', 'true')
          setFadeOut(true)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 4
      })
    }, 40)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(16,185,129,0.15),transparent_60%)]" />

      <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-brand-500/30 bg-brand-500/10 shadow-lg shadow-brand-500/20">
        <Truck className="text-brand-400" size={40} />
        <div className="absolute inset-0 animate-ping rounded-2xl border border-brand-500/20" />
      </div>

      <h1 className="relative mt-6 text-3xl font-bold text-white">CargoLoop</h1>
      <p className="relative mt-2 text-sm text-emerald-100/60">Empty miles → opportunity</p>

      <div className="relative mt-10 w-48">
        <div className="h-1.5 overflow-hidden rounded-full bg-panel-border">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-emerald-100/50">{progress}%</p>
      </div>
    </div>
  )
}
