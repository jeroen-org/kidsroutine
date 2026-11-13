import { useState } from 'react'
import type { Routine } from '../types'
import EmojiPicker from './EmojiPicker'
import Modal from './Modal'

interface RoutineFormProps {
  routine: Routine
  onSave: (routine: Routine) => void
  onCancel: () => void
  onDelete?: () => void
}

export default function RoutineForm({
  routine,
  onSave,
  onCancel,
  onDelete,
}: RoutineFormProps) {
  const [draft, setDraft] = useState<Routine>(routine)
  const isNew = !routine.id
  const canSave = draft.name.trim().length > 0

  return (
    <Modal
      title={isNew ? 'Nieuwe routine' : 'Routine bewerken'}
      subtitle={isNew ? 'Geef je routine een naam en icoon.' : undefined}
      onClose={onCancel}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (canSave) onSave({ ...draft, name: draft.name.trim() })
        }}
      >
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Naam
          </span>
          <input
            autoFocus
            value={draft.name}
            onChange={(event) => setDraft({ ...draft, name: event.target.value })}
            maxLength={40}
            placeholder="Bijv. Ochtend"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg font-medium text-slate-800 outline-none transition focus:border-indigo-300 focus:bg-white"
          />
        </label>

        <div className="mt-4">
          <EmojiPicker
            value={draft.emoji}
            onChange={(emoji) => setDraft({ ...draft, emoji })}
          />
        </div>

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
            {isNew ? 'Aanmaken' : 'Opslaan'}
          </button>
        </div>
      </form>
    </Modal>
  )
}