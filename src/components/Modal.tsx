import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { useLockBodyScroll } from '../hooks'

interface ModalProps {
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
}

export default function Modal({ title, subtitle, onClose, children }: ModalProps) {
  useLockBodyScroll(true)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="max-h-[92dvh] w-full max-w-lg animate-pop overflow-hidden rounded-t-[2rem] border border-white bg-white shadow-2xl sm:rounded-[2rem]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 pb-4 pt-5">
          <div>
            <h2 id="modal-title" className="text-xl font-bold text-slate-800">
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Sluiten"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="safe-bottom max-h-[calc(92dvh-5.5rem)] overflow-y-auto px-5 pt-4">
          {children}
        </div>
      </div>
    </div>
  )
}