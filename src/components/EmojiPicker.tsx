import { EMOJI_CHOICES } from '../data'
import { truncateEmoji } from '../utils'

interface EmojiPickerProps {
  value: string
  onChange: (value: string) => void
}

export default function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        Kies een icoon
      </p>

      <div
        role="listbox"
        aria-label="Kies een icoon"
        className="grid grid-cols-8 gap-1.5 sm:grid-cols-10"
      >
        {EMOJI_CHOICES.map((emoji) => {
          const selected = value === emoji
          return (
            <button
              key={emoji}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => onChange(emoji)}
              className={`grid h-9 place-items-center rounded-xl text-xl transition sm:h-10 sm:text-2xl ${
                selected
                  ? 'bg-indigo-100 ring-2 ring-indigo-400'
                  : 'hover:bg-slate-100'
              }`}
            >
              {emoji}
            </button>
          )
        })}
      </div>

      <label className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
        <span className="text-xs font-semibold text-slate-500">Eigen icoon</span>
        <input
          value={value}
          onChange={(event) => onChange(truncateEmoji(event.target.value))}
          maxLength={8}
          aria-label="Eigen icoon"
          className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1 text-center text-xl"
        />
      </label>
    </div>
  )
}