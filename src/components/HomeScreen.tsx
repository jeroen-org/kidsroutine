import {
  Check,
  CloudOff,
  Lock,
  Settings2,
  Star,
  Timer,
  Trophy,
} from 'lucide-react'
import { paletteFor } from '../data'
import type { AppState, Routine } from '../types'
import { formatLongDate, greeting } from '../utils'

interface HomeScreenProps {
  state: AppState
  routine: Routine
  doneIds: Set<string>
  onSelectRoutine: (id: string) => void
  onOpenTask: (id: string) => void
  onOpenSettings: () => void
  online: boolean
}

export default function HomeScreen({
  state,
  routine,
  doneIds,
  onSelectRoutine,
  onOpenTask,
  onOpenSettings,
  online,
}: HomeScreenProps) {
  const total = routine.tasks.length
  const done = routine.tasks.filter((task) => doneIds.has(task.id)).length
  const remaining = total - done
  const allDone = total > 0 && remaining === 0
  const percentage = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <div className="safe-top relative z-10 mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 sm:px-6">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30">
            <Star className="h-6 w-6" fill="currentColor" strokeWidth={1.5} />
            <span className="absolute -right-1 -top-1 animate-twinkle text-sm" aria-hidden="true">
              ✨
            </span>
          </div>
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-indigo-600">
              Mijn routine
            </p>
            <h1 className="text-xl font-semibold leading-tight text-slate-800">
              Hoi, kleine held!
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="Instellingen openen"
          className="grid h-12 w-12 place-items-center rounded-2xl border border-white bg-white/80 text-slate-500 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:text-indigo-600 hover:shadow-md active:translate-y-0"
        >
          <Settings2 className="h-6 w-6" />
        </button>
      </header>

      {!online && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 animate-rise">
          <CloudOff className="h-4 w-4 shrink-0" />
          Je bent offline. Alles blijft gewoon werken.
        </div>
      )}

      <nav
        aria-label="Kies een routine"
        className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
      >
        {state.routines.map((item) => {
          const isActive = item.id === routine.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectRoutine(item.id)}
              aria-pressed={isActive}
              className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25'
                  : 'border border-white bg-white/70 text-slate-500 hover:bg-white hover:text-slate-800'
              }`}
            >
              <span className="text-lg" aria-hidden="true">
                {item.emoji}
              </span>
              {item.name}
            </button>
          )
        })}
      </nav>

      <section className="mt-4 overflow-hidden rounded-[2rem] border border-white bg-white/85 p-5 shadow-soft backdrop-blur sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-indigo-600">{greeting()}!</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
              {routine.name}
            </h2>
            <p className="mt-0.5 text-sm capitalize text-slate-500">
              {formatLongDate()}
            </p>
          </div>
          <div
            className="grid h-16 w-16 shrink-0 animate-float-soft place-items-center rounded-3xl bg-indigo-50 text-4xl"
            aria-hidden="true"
          >
            {routine.emoji}
          </div>
        </div>

        <div className="mt-5">
          {total === 0 ? (
            <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500">
              Voeg eerst een taak toe via de instellingen.
            </p>
          ) : (
            <>
              <div className="flex items-end justify-between gap-3">
                <p className="text-sm font-medium text-slate-500">
                  <span className="text-xl font-bold text-slate-800">{done}</span> van {total}{' '}
                  taken klaar
                </p>
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600">
                  {percentage}%
                </span>
              </div>

              <div
                className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={done}
                aria-label="Voortgang van deze routine"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 transition-[width] duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {total <= 8 && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5" aria-hidden="true">
                  {routine.tasks.map((task) => {
                    const isDone = doneIds.has(task.id)
                    return (
                      <Star
                        key={task.id}
                        className={`h-5 w-5 transition ${
                          isDone ? 'animate-star-pop text-amber-400' : 'text-slate-200'
                        }`}
                        fill={isDone ? 'currentColor' : 'none'}
                        strokeWidth={isDone ? 1.5 : 2}
                      />
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {allDone && (
          <div className="mt-4 flex animate-pop items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-emerald-700">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-400 text-white">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold leading-tight">Missie voltooid!</p>
              <p className="text-sm text-emerald-600">
                Alle taken zijn klaar. Wat een held!
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-800">Taken</h2>
          <span className="text-sm font-medium text-slate-500">
            {total === 0 ? 'Nog geen taken' : remaining === 0 ? 'Alles klaar' : `${remaining} te gaan`}
          </span>
        </div>

        {total === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-white/60 p-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-3xl">
              🧩
            </div>
            <p className="mt-3 font-semibold text-slate-700">Nog geen taken</p>
            <p className="mt-1 text-sm text-slate-500">
              Voeg taken toe via de instellingen.
            </p>
            <button
              type="button"
              onClick={onOpenSettings}
              className="mt-4 rounded-2xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-600"
            >
              Taken toevoegen
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {routine.tasks.map((task, index) => {
              const palette = paletteFor(index)
              const isDone = doneIds.has(task.id)
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => onOpenTask(task.id)}
                  aria-label={`${task.title}${isDone ? ', klaar. Tik om te wijzigen' : ', start taak'}`}
                  className={`group relative flex w-full animate-rise items-center gap-3.5 rounded-3xl border p-3.5 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 sm:p-4 ${
                    isDone
                      ? 'border-emerald-200 bg-emerald-50/80'
                      : 'border-white bg-white/90 hover:border-indigo-100'
                  }`}
                  style={{ animationDelay: `${Math.min(index, 8) * 55}ms` }}
                >
                  <span
                    className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-3xl sm:h-16 sm:w-16 sm:text-4xl"
                    style={{ backgroundColor: palette.icon }}
                    role="img"
                    aria-hidden="true"
                  >
                    {task.emoji}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate text-lg font-semibold leading-tight ${
                        isDone
                          ? 'text-emerald-700 line-through decoration-emerald-300 decoration-2'
                          : 'text-slate-800'
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      {isDone ? (
                        'Klaar! Tik om te wijzigen'
                      ) : task.minutes > 0 ? (
                        <>
                          <Timer className="h-3.5 w-3.5" />
                          {task.minutes} minuten
                        </>
                      ) : (
                        'Eén taak tegelijk'
                      )}
                    </span>
                  </span>

                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 transition ${
                      isDone
                        ? 'border-emerald-400 bg-emerald-400 text-white'
                        : 'border-slate-200 bg-white text-slate-200 group-hover:border-indigo-300 group-hover:text-indigo-200'
                    }`}
                  >
                    <Check className="h-5 w-5" strokeWidth={3.5} />
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </section>

      <footer className="safe-bottom mt-auto pt-8 text-center">
        <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500">
          <Lock className="h-3.5 w-3.5" />
          Voortgang blijft op dit apparaat
        </p>
        <p className="mt-1 text-[0.65rem] text-slate-500">
          Gemaakt voor kleine helden · v0.1.0
        </p>
      </footer>
    </div>
  )
}