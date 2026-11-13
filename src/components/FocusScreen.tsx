import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Check,
  Pause,
  Play,
  RotateCcw,
  Star,
  Trophy,
  Undo2,
} from 'lucide-react'
import { celebrate, vibrate } from '../confetti'
import { PRAISE, paletteFor } from '../data'
import { useLockBodyScroll } from '../hooks'
import type { Routine, Task } from '../types'
import { formatClock, pickRandom } from '../utils'

const CIRCUMFERENCE = 2 * Math.PI * 52

interface FocusScreenProps {
  routine: Routine
  task: Task
  taskIndex: number
  taskCount: number
  done: boolean
  doneCount: number
  onClose: () => void
  onComplete: () => void
  onUndo: () => void
}

export default function FocusScreen({
  routine,
  task,
  taskIndex,
  taskCount,
  done,
  doneCount,
  onClose,
  onComplete,
  onUndo,
}: FocusScreenProps) {
  const palette = paletteFor(taskIndex)
  const totalSeconds = task.minutes * 60

  const [remaining, setRemaining] = useState(totalSeconds)
  const [paused, setPaused] = useState(false)
  const [timeUp, setTimeUp] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [praise] = useState(() => pickRandom(PRAISE))
  // Vastleggen vóór afronden: na het afvinken verandert doneCount namelijk.
  const [isFinalTask] = useState(() => !done && doneCount === taskCount - 1)

  useLockBodyScroll(true)

  useEffect(() => {
    if (done || totalSeconds === 0 || paused || showReward || remaining <= 0) return
    const interval = window.setInterval(() => {
      setRemaining((current) => (current <= 1 ? 0 : current - 1))
    }, 1000)
    return () => window.clearInterval(interval)
  }, [done, totalSeconds, paused, showReward, remaining])

  useEffect(() => {
    if (remaining === 0 && totalSeconds > 0 && !timeUp) {
      setTimeUp(true)
      vibrate([40, 60, 40])
    }
  }, [remaining, totalSeconds, timeUp])

  useEffect(() => {
    if (!showReward || isFinalTask) return
    const timer = window.setTimeout(onClose, 2600)
    return () => window.clearTimeout(timer)
  }, [showReward, isFinalTask, onClose])

  const handleComplete = () => {
    if (done) return
    onComplete()
    setShowReward(true)
    celebrate(isFinalTask ? 'big' : 'normal')
    vibrate(isFinalTask ? [30, 50, 30, 50, 70] : 40)
  }

  const resetTimer = () => {
    setRemaining(totalSeconds)
    setPaused(false)
    setTimeUp(false)
  }

  const ringProgress = totalSeconds === 0 ? 0 : remaining / totalSeconds

  return (
    <div
      className="fixed inset-0 z-40 flex animate-fade-in flex-col overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(155deg, ${palette.from} 0%, ${palette.to} 100%)`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span className="absolute -left-16 top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <span className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <span className="absolute left-1/3 top-1/2 h-40 w-40 rounded-full bg-white/5 blur-xl" />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <header className="safe-top px-4 pb-2 sm:px-6">
          <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 rounded-2xl border border-white/25 bg-white/15 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/25 active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              Stop
            </button>
            <span className="rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
              Taak {taskIndex + 1} van {taskCount}
            </span>
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-6 py-4 text-center text-white">
          <div className="my-auto flex w-full flex-col items-center">
          <div className="relative">
            <div className="grid h-40 w-40 place-items-center rounded-full border border-white/25 bg-white/15 shadow-2xl shadow-black/10 backdrop-blur-sm sm:h-52 sm:w-52">
              <span
                className="animate-float-soft text-7xl drop-shadow-md sm:text-8xl"
                role="img"
                aria-label={task.title}
              >
                {task.emoji}
              </span>
            </div>
            <span
              className="absolute -right-3 -top-3 animate-twinkle text-3xl"
              aria-hidden="true"
            >
              ✨
            </span>
            <span
              className="absolute -bottom-2 -left-4 animate-twinkle text-2xl"
              style={{ animationDelay: '1.2s' }}
              aria-hidden="true"
            >
              ⭐
            </span>
          </div>

          <h1 className="mt-7 max-w-xl text-balance text-4xl font-bold leading-tight drop-shadow-sm sm:text-5xl">
            {task.title}
          </h1>
          <p className="mt-2 text-base font-medium text-white/80">
            {routine.name} ·{' '}
            {done ? 'Deze taak is al klaar' : 'Neem je tijd. Jij kunt dit!'}
          </p>

          {done ? (
            <div className="mt-7 flex animate-pop items-center gap-2 rounded-full border border-white/25 bg-white/15 px-5 py-3 text-base font-semibold backdrop-blur-sm">
              <Check className="h-5 w-5" strokeWidth={3} />
              Deze taak is klaar
            </div>
          ) : totalSeconds > 0 ? (
            <div className="mt-7 flex flex-col items-center">
              <div className="relative h-36 w-36">
                <svg
                  viewBox="0 0 120 120"
                  className="h-full w-full -rotate-90"
                  aria-hidden="true"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.22)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="white"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={CIRCUMFERENCE * (1 - ringProgress)}
                    className="transition-[stroke-dashoffset] duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold tabular-nums">
                    {formatClock(remaining)}
                  </span>
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/65">
                    minuten
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPaused((current) => !current)}
                  className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
                >
                  {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  {paused ? 'Verder' : 'Pauze'}
                </button>
                <button
                  type="button"
                  onClick={resetTimer}
                  className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
                >
                  <RotateCcw className="h-4 w-4" />
                  Opnieuw
                </button>
              </div>

              {timeUp && (
                <p
                  role="status"
                  className="mt-3 animate-pop rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm"
                >
                  Tijd is om! 🎉
                </p>
              )}
            </div>
          ) : null}
          </div>
        </main>

        <div className="safe-bottom px-5 pt-4 sm:px-6">
          <div className="mx-auto w-full max-w-md">
            {done ? (
              <button
                type="button"
                onClick={onUndo}
                className="flex min-h-[4.25rem] w-full items-center justify-center gap-2.5 rounded-[1.75rem] border border-white/30 bg-white/15 px-6 py-4 text-lg font-bold text-white backdrop-blur-md transition hover:bg-white/25 active:scale-[0.99]"
              >
                <Undo2 className="h-5 w-5" />
                Ongedaan maken
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                className="flex min-h-[4.5rem] w-full items-center justify-center gap-3 rounded-[1.75rem] bg-white px-6 py-4 text-xl font-bold text-slate-800 shadow-2xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-amber-50 active:translate-y-0 active:scale-[0.99]"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-400 text-white">
                  <Check className="h-5 w-5" strokeWidth={3.5} />
                </span>
                Klaar!
              </button>
            )}
          </div>
        </div>
      </div>

      {showReward && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reward-title"
        >
          <div className="w-full max-w-sm animate-pop rounded-[2rem] border border-white bg-white p-7 text-center shadow-2xl">
            <div className="relative mx-auto grid h-24 w-24 animate-star-pop place-items-center rounded-full bg-gradient-to-br from-amber-300 to-orange-400 text-white shadow-lg shadow-amber-500/30">
              {isFinalTask ? (
                <Trophy className="h-12 w-12" strokeWidth={2.2} />
              ) : (
                <Star className="h-12 w-12" fill="currentColor" strokeWidth={1.5} />
              )}
              <span className="absolute -right-2 -top-2 animate-twinkle text-2xl" aria-hidden="true">
                ✨
              </span>
            </div>

            <h2 id="reward-title" className="mt-5 text-3xl font-bold text-slate-800">
              {isFinalTask ? 'Missie voltooid!' : praise}
            </h2>
            <p className="mt-2 text-base text-slate-500">
              {isFinalTask
                ? `Je hebt alle ${taskCount} taken gedaan. Wat een held!`
                : 'Knap gedaan! Ga zo door.'}
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3.5 text-lg font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:-translate-y-0.5 active:translate-y-0"
            >
              {isFinalTask ? 'Naar huis' : 'Verder'}
            </button>

            {!isFinalTask && (
              <p className="mt-3 text-xs font-medium text-slate-500">
                Gaat automatisch verder…
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}