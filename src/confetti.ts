import confetti from 'canvas-confetti'

const COLORS = ['#6366F1', '#F59E0B', '#10B981', '#EC4899', '#38BDF8', '#FFC93C']

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function celebrate(intensity: 'normal' | 'big' = 'normal'): void {
  if (prefersReducedMotion()) return

  const base = {
    colors: COLORS,
    ticks: 220,
    zIndex: 90,
    disableForReducedMotion: true,
  }

  confetti({
    ...base,
    particleCount: intensity === 'big' ? 160 : 70,
    spread: intensity === 'big' ? 110 : 70,
    startVelocity: 42,
    origin: { y: 0.65 },
    scalar: 1.05,
  })

  if (intensity === 'big') {
    window.setTimeout(() => {
      confetti({
        ...base,
        particleCount: 80,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 },
      })
    }, 180)

    window.setTimeout(() => {
      confetti({
        ...base,
        particleCount: 80,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.7 },
      })
    }, 320)
  }
}

export function vibrate(pattern: number | number[] = 30): void {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return
  try {
    navigator.vibrate(pattern)
  } catch {
    // Trillen wordt niet ondersteund; niet erg.
  }
}