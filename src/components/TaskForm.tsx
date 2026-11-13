import { useState } from 'react'
import { TIMER_OPTIONS } from '../data'
import type { Task } from '../types'
import { clamp } from '../utils'
import EmojiPicker from './EmojiPicker'
import Modal from './Modal'

interface TaskFormProps {
  task: Task
  routineName: string
  onSave: (task: Task) => void
  onCancel: () => void
  onDelete?: () => void
}

export default function TaskForm({
  task,
  routineName,
  onSave,
  onCancel,
  onDelete,
}: TaskFormProps) {
  const [draft, setDraft] = useState<Task>(task)
  const isNew = !task.id
  const canSave = draft.title.trim().length > 0

  return (
    <Modal
      title={isNew ? 'Nieuwe taak' : 'Taak bewerken'}
      subtitle={routineName}
      onClose={onCancel}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (canSave) onSave({ ...draft, title: draft.title.trim() })
        }}
      >
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Wat moet er gebeuren?
          </span>
          <input
            autoFocus
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            maxLength={60}
            placeholder="Bijv. Tanden poetsen"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg font-medium text-slate-800 outline-none transition focus:border-indigo-300 focus:bg-white"
          />
        </label>

        <div className="mt-4">
          <EmojiPicker
            value={draft.emoji}
            onChange={(emoji) => setDraft({ ...draft, emoji })}
          />
        </div>

        <fieldset className="mt-5">
          <legend className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Timer
          </legend>
          <div className="flex flex-wrap gap-2">
            {TIMER_OPTIONS.map((minutes) => {
              const selected = draft.minutes === minutes
              return (
                <button
                  key={minutes}
                  type="button"
                  onClick={() => setDraft({ ...draft, minutes })}
                  aria-pressed={selected}
                  className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
                    selected
                      ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/25'
                      : 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {minutes === 0 ? 'Geen' : `${minutes} min`}
                </button>
              )
            })}
          </div>
        </fieldset>

        <label className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5">
          <span className="text-sm font-semibold text-slate-500">Eigen minuten</span>
          <input
            type="number"
            min={0}
            max={180}
            value={draft.minutes}
            onChange={(event) => {
              const value = Number(event.target.value)
              setDraft({
                ...draft,
                minutes: Number.isFinite(value) ? Math.round(clamp(value, 0, 180)) : 0,
              })
            }}
            className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-center font-semibold text-slate-700"
          />
        </label>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-2xl px-4 py-3 text-sm font-semibold text-rose-500 transition hover:bg-rose-50 sm:mr-auto"
            >
              Verwijderen
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Annuleren
          </button>
          <button
            type="submit"
            disabled={!canSave}
            className="rounded-2xl bg-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isNew ? 'Toevoegen' : 'Opslaan'}
          </button>
        </div>
      </form>
    </Modal>
  )
}