import { startGoogleAuth } from '../utils/googleAuth'
import { motion } from 'framer-motion'

export default function GoogleAuthButton({ role = 'shipper', mode = 'signin', label }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      onClick={() => startGoogleAuth({ role, mode })}
      className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 hover:border-slate-600 sm:py-3 shadow-sm"
    >
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
        <path
          fill="#FFC107"
          d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.223 36 24 36c-5.514 0-10-4.486-10-10s4.486-10 10-10c2.837 0 5.402 1.193 7.207 3.093l5.657-5.657C33.64 10.053 29.082 8 24 8 12.955 8 4 16.955 4 28s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
        />
        <path
          fill="#FF3D00"
          d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 13 24 13c2.837 0 5.402 1.193 7.207 3.093l5.657-5.657C33.64 10.053 29.082 8 24 8c-7.682 0-14.288 4.337-17.694 10.691z"
        />
        <path
          fill="#4CAF50"
          d="M24 48c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 38.091 26.715 39 24 39c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 43.556 16.227 48 24 48z"
        />
        <path
          fill="#1976D2"
          d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
        />
      </svg>
      {label || 'Continue with Google'}
    </motion.button>
  )
}
