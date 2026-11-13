import { useState } from 'react'
import {
  ArrowLeft,
  Check,
  CloudOff,
  Download,
  Pencil,
  Plus,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Timer,
  Trash2,
  Wifi,
} from 'lucide-react'
import { paletteFor } from '../data'
import type { InstallPrompt } from '../hooks'
import type { AppState, Routine, Task } from '../types'
import { uid } from '../utils'
import ConfirmDialog from './ConfirmDialog'
import RoutineForm from './RoutineForm'
import TaskForm from './TaskForm'

interface ConfirmState {
  title: string
  message: string
  confirmLabel: string
  hideCancel?: boolean
  tone?: 'default' | 'danger'
  action: () => void
}

interface SettingsScreenProps {
  state: AppState
  activeRoutine: Routine
  today: string
  onBack: () => void
  onChange: (updater: (state: AppState) => AppState) => void
  onResetToday: () => void
  onRestoreDefaults: () => void
  install: InstallPrompt
  online: boolean
}

const iconButtonClass =
  'grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 active:scale-95 disabled:pointer-events-none disabled:opacity-30'

export default function SettingsScreen({
  state,
  activeRoutine,
  today,
  onBack,
  onChange,
  onResetToday,
  onRestoreDefaults,
  install,
  online,
}: SettingsScreenProps) {
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [confirm, setConfirm] = useState<ConfirmState | null>(null)
  const [installMessage, setInstallMessage] = useState<string | null>(null)

  const doneIds = new Set(state.completions[today]?.[activeRoutine.id] ?? [])
  const doneCount = activeRoutine.tasks.filter((task) => doneIds.has(task.id)).length

  const handleSaveRoutine = (routine: Routine) => {
    const isNew = !routine.id
    const saved: Routine = { ...routine, id: isNew ? uid() : routine.id }

    onChange((current) => {
      if (isNew) {
        return {
          ...current,
          routines: [...current.routines, saved],
          activeRoutineId: saved.id,
        }
      }
      return {
        ...current,
        routines: current.routines.map((item) => (item.id === saved.id ? saved : item)),
      }
    })
    setEditingRoutine(null)
  }

  const requestDeleteRoutine = (routine: Routine) => {
    setEditingRoutine(null)

    if (state.routines.length <= 1) {
      setConfirm({
        title: 'Even niet mogelijk',
        message: 'Je hebt minstens één routine nodig. Maak eerst een nieuwe routine aan.',
        confirmLabel: 'Oké',
        hideCancel: true,
        action: () => setConfirm(null),
      })
      return
    }

    setConfirm({
      title: 'Routine verwijderen?',
      message: `Weet je zeker dat je "${routine.name}" en alle taken wilt verwijderen?`,
      confirmLabel: 'Verwijderen',
      tone: 'danger',
      action: () => {
        onChange((current) => {
          const routines = current.routines.filter((item) => item.id !== routine.id)
          return {
            ...current,
            routines,
            activeRoutineId:
              current.activeRoutineId === routine.id
                ? routines[0].id
                : current.activeRoutineId,
          }
        })
        setConfirm(null)
      },
    })
  }

  const handleSaveTask = (task: Task) => {
    const isNew = !task.id
    const saved: Task = { ...task, id: isNew ? uid() : task.id }

    onChange((current) => ({
      ...current,
      routines: current.routines.map((routine) => {
        if (routine.id !== activeRoutine.id) return routine
        return {
          ...routine,
          tasks: isNew
            ? [...routine.tasks, saved]
            : routine.tasks.map((item) => (item.id === saved.id ? saved : item)),
        }
      }),
    }))
    setEditingTask(null)
  }

  const requestDeleteTask = (task: Task) => {
    setEditingTask(null)
    setConfirm({
      title: 'Taak verwijderen?',
      message: `"${task.title}" verdwijnt uit ${activeRoutine.name}.`,
      confirmLabel: 'Verwijderen',
      tone: 'danger',
      action: () => {
        onChange((current) => ({
          ...current,
          routines: current.routines.map((routine) =>
            routine.id === activeRoutine.id
              ? {
                  ...routine,
                  tasks: routine.tasks.filter((item) => item.id !== task.id),
                }
              : routine,
          ),
        }))
        setConfirm(null)
      },
    })
  }

  const requestResetToday = () => {
    setConfirm({
      title: 'Vandaag opnieuw beginnen?',
      message:
        'Alle vinkjes van vandaag worden gewist. Je routines en taken blijven staan.',
      confirmLabel: 'Opnieuw beginnen',
      tone: 'danger',
      action: () => {
        onResetToday()
        setConfirm(null)
      },
    })
  }

  const requestRestoreDefaults = () => {
    setConfirm({
      title: 'Alles terugzetten?',
      message:
        'Je eigen routines en taken worden vervangen door de standaardroutines. Dit kan niet ongedaan worden gemaakt.',
      confirmLabel: 'Herstellen',
      tone: 'danger',
      action: () => {
        onRestoreDefaults()
        setConfirm(null)
      },
    })
  }

  const handleInstall = async () => {
    const accepted = await install.promptInstall()
    setInstallMessage(accepted ? 'De app is geïnstalleerd!' : 'Installatie geannuleerd.')
  }

  return (
    <div className="safe-top relative z-10 mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 sm:px-6">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Terug naar de routine"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white bg-white/80 text-slate-500 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:text-indigo-600 active:translate-y-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-indigo-600">
            Instellingen
          </p>
          <h1 className="text-xl font-semibold leading-tight text-slate-800">
            Pas je routine aan
          </h1>
        </div>
      </header>

      <main className="flex-1 space-y-5 py-5">
        <section className="rounded-[1.75rem] border border-white bg-white/85 p-4 shadow-soft backdrop-blur sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-800">Routines</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
              {state.routines.length}
            </span>
          </div>

          <div>
            {state.routines.map((routine) => {
              const isActive = routine.id === activeRoutine.id
              return (
                <div
                  key={routine.id}
                  className={`mb-2 flex items-center gap-2 rounded-2xl border p-2.5 last:mb-0 ${
                    isActive
                      ? 'border-indigo-200 bg-indigo-50/70'
                      : 'border-slate-100 bg-white'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      onChange((current) => ({
                        ...current,
                        activeRoutineId: routine.id,
                      }))
                    }
                    aria-pressed={isActive}
                    className="flex min-w-0 flex-1 items-center gap-3 rounded-xl p-1 text-left"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-2xl shadow-sm">
                      {routine.emoji}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-slate-800">
                        {routine.name}
                      </span>
                      <span className="block text-xs text-slate-500">
                        {routine.tasks.length}{' '}
                        {routine.tasks.length === 1 ? 'taak' : 'taken'}
                        {isActive ? ' · actief' : ''}
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingRoutine(routine)}
                    aria-label={`Bewerk ${routine.name}`}
                    className={iconButtonClass}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => requestDeleteRoutine(routine)}
                    aria-label={`Verwijder ${routine.name}`}
                    className={iconButtonClass}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() =>
              setEditingRoutine({ id: '', name: '', emoji: '🌟', tasks: [] })
            }
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/60 px-4 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            <Plus className="h-4 w-4" />
            Nieuwe routine
          </button>
        </section>

        <section className="rounded-[1.75rem] border border-white bg-white/85 p-4 shadow-soft backdrop-blur sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Taken</h2>
              <p className="text-xs text-slate-500">
                {activeRoutine.emoji} {activeRoutine.name}
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
              {activeRoutine.tasks.length}
            </span>
          </div>

          {activeRoutine.tasks.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 px-4 py-5 text-center text-sm text-slate-500">
              Deze routine heeft nog geen taken.
            </p>
          ) : (
            <div>
              {activeRoutine.tasks.map((task, index) => {
                const palette = paletteFor(index)
                return (
                  <div
                    key={task.id}
                    className="mb-2 flex items-center gap-2 rounded-2xl border border-slate-100 bg-white p-2.5 last:mb-0"
                  >
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-2xl"
                      style={{ backgroundColor: palette.icon }}
                      aria-hidden="true"
                    >
                      {task.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-800">{task.title}</p>
                      <p className="flex items-center gap-1 text-xs text-slate-500">
                        {task.minutes > 0 ? (
                          <>
                            <Timer className="h-3 w-3" />
                            {task.minutes} minuten
                          </>
                        ) : (
                          'Geen timer'
                        )}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setEditingTask(task)}
                      aria-label={`Bewerk ${task.title}`}
                      className={iconButtonClass}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => requestDeleteTask(task)}
                      aria-label={`Verwijder ${task.title}`}
                      className={iconButtonClass}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              setEditingTask({ id: '', title: '', emoji: '⭐', minutes: 0 })
            }
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/60 px-4 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            <Plus className="h-4 w-4" />
            Taak toevoegen
          </button>
        </section>

        <section className="rounded-[1.75rem] border border-white bg-white/85 p-4 shadow-soft backdrop-blur sm:p-5">
          <h2 className="text-lg font-bold text-slate-800">Voortgang</h2>
          <div className="mt-3 flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-500">
              <Check className="h-5 w-5" strokeWidth={3} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-800">Vandaag</p>
              <p className="text-xs text-slate-500">
                {doneCount} van {activeRoutine.tasks.length} taken klaar in{' '}
                {activeRoutine.name}
              </p>
            </div>
            <button
              type="button"
              onClick={requestResetToday}
              disabled={doneCount === 0}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Opnieuw
            </button>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-white bg-white/85 p-4 shadow-soft backdrop-blur sm:p-5">
          <h2 className="text-lg font-bold text-slate-800">App & installatie</h2>

          <div className="mt-3 space-y-3">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
              <div
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                  online
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-amber-100 text-amber-600'
                }`}
              >
                {online ? <Wifi className="h-5 w-5" /> : <CloudOff className="h-5 w-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-700">
                  {online ? 'Online' : 'Offline'}
                </p>
                <p className="text-xs text-slate-500">
                  {online
                    ? 'De app werkt ook zonder internet.'
                    : 'Je kunt gewoon verder.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-100 text-indigo-600">
                <Smartphone className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-700">Op je startscherm</p>
                <p className="text-xs text-slate-500">
                  Installeer de app als een echte app.
                </p>

                {install.installed ? (
                  <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <Check className="h-3.5 w-3.5" />
                    Geïnstalleerd
                  </p>
                ) : install.canInstall ? (
                  <button
                    type="button"
                    onClick={handleInstall}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-indigo-500 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition hover:bg-indigo-600"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Installeer app
                  </button>
                ) : (
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                    {install.isIos
                      ? 'iPhone of iPad: tik op het deel-icoon en kies daarna “Zet op beginscherm”.'
                      : 'Open het browsermenu en kies “Installeer app” of “Toevoegen aan startscherm”.'}
                  </p>
                )}

                {installMessage && (
                  <p className="mt-1.5 text-xs font-semibold text-indigo-600">
                    {installMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="rounded-[1.75rem] border border-indigo-100 bg-indigo-50/70 p-4">
          <div className="flex gap-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-indigo-500" />
            <div>
              <p className="text-sm font-bold text-indigo-900">
                Jouw gegevens blijven hier
              </p>
              <p className="mt-1 text-xs leading-relaxed text-indigo-700/80">
                Taken en voortgang worden alleen op dit apparaat opgeslagen. Er is geen
                account en er gaat niets naar een server.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={requestRestoreDefaults}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-100 bg-rose-50/60 px-4 py-3 text-sm font-semibold text-rose-500 transition hover:bg-rose-50"
        >
          <RotateCcw className="h-4 w-4" />
          Standaardwaarden herstellen
        </button>
      </main>

      <footer className="safe-bottom pt-2 text-center text-[0.65rem] text-slate-500">
        Mijn Routine · v0.1.0 · alles lokaal opgeslagen
      </footer>

      {editingRoutine && (
        <RoutineForm
          key={editingRoutine.id || 'new-routine'}
          routine={editingRoutine}
          onSave={handleSaveRoutine}
          onCancel={() => setEditingRoutine(null)}
          onDelete={
            editingRoutine.id
              ? () => requestDeleteRoutine(editingRoutine)
              : undefined
          }
        />
      )}

      {editingTask && (
        <TaskForm
          key={editingTask.id || 'new-task'}
          task={editingTask}
          routineName={`${activeRoutine.emoji} ${activeRoutine.name}`}
          onSave={handleSaveTask}
          onCancel={() => setEditingTask(null)}
          onDelete={
            editingTask.id ? () => requestDeleteTask(editingTask) : undefined
          }
        />
      )}

      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          hideCancel={confirm.hideCancel}
          tone={confirm.tone}
          onConfirm={confirm.action}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}