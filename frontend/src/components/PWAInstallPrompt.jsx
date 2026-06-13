import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isStandalone() || localStorage.getItem('cargoloop-pwa-dismissed') === 'true') return

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const dismiss = () => {
    setVisible(false)
    localStorage.setItem('cargoloop-pwa-dismissed', 'true')
  }

  const install = async () => {
    if (!deferredPrompt) {
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        alert('Tap Share → Add to Home Screen to install CargoLoop on iOS.')
      }
      return
    }
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    dismiss()
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md lg:bottom-6">
      <div className="flex items-center gap-3 rounded-2xl border border-brand-500/30 bg-panel p-4 shadow-2xl shadow-black/40">
        <div className="rounded-xl bg-brand-500/15 p-2.5 text-brand-400">
          <Download size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-white">Install CargoLoop</p>
          <p className="text-xs text-emerald-100/60">Add to home screen for fast demo access</p>
        </div>
        <button
          type="button"
          onClick={install}
          className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white"
        >
          Install
        </button>
        <button type="button" onClick={dismiss} aria-label="Dismiss" className="text-emerald-100/50">
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
