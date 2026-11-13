import type { Routine } from './types'

export interface TaskPalette {
  name: string
  soft: string
  icon: string
  ink: string
  from: string
  to: string
}

/** Vrolijke kleuren die per taak afwisselen. */
export const TASK_PALETTE: readonly TaskPalette[] = [
  {
    name: 'violet',
    soft: '#EEF2FF',
    icon: '#E0E7FF',
    ink: '#4F46E5',
    from: '#6366F1',
    to: '#8B5CF6',
  },
  {
    name: 'coral',
    soft: '#FFF1F2',
    icon: '#FFE4E6',
    ink: '#E11D48',
    from: '#E11D48',
    to: '#F97316',
  },
  {
    name: 'mint',
    soft: '#ECFDF5',
    icon: '#D1FAE5',
    ink: '#059669',
    from: '#059669',
    to: '#0D9488',
  },
  {
    name: 'sky',
    soft: '#F0F9FF',
    icon: '#E0F2FE',
    ink: '#0284C7',
    from: '#0284C7',
    to: '#4F46E5',
  },
  {
    name: 'amber',
    soft: '#FFFBEB',
    icon: '#FEF3C7',
    ink: '#D97706',
    from: '#D97706',
    to: '#EA580C',
  },
  {
    name: 'pink',
    soft: '#FDF2F8',
    icon: '#FCE7F3',
    ink: '#DB2777',
    from: '#DB2777',
    to: '#7C3AED',
  },
] as const

export function paletteFor(index: number): TaskPalette {
  return TASK_PALETTE[((index % TASK_PALETTE.length) + TASK_PALETTE.length) % TASK_PALETTE.length]
}

export const EMOJI_CHOICES: readonly string[] = [
  '⭐',
  '🌟',
  '✨',
  '☀️',
  '🌙',
  '🌈',
  '🦸',
  '🏆',
  '🎈',
  '🎉',
  '👕',
  '👖',
  '🩳',
  '🧦',
  '👟',
  '🧥',
  '🎒',
  '🪥',
  '🦷',
  '🧼',
  '🚿',
  '🛁',
  '🧴',
  '💇',
  '🥣',
  '🍎',
  '🥛',
  '🍞',
  '🧃',
  '🍽️',
  '🧸',
  '🧩',
  '📚',
  '📖',
  '✏️',
  '🖍️',
  '🎨',
  '🧹',
  '🧺',
  '🛏️',
  '🐶',
  '🐱',
  '🐟',
  '🚀',
  '⚽',
  '🎹',
  '🎸',
  '🧘',
  '🌿',
]

export const TIMER_OPTIONS: readonly number[] = [0, 1, 2, 3, 5, 10, 15]

export const PRAISE: readonly string[] = [
  'Super!',
  'Knap gedaan!',
  'Wat een ster!',
  'Hoera!',
  'Goed bezig!',
  'Jij kunt dit!',
]

export function createDefaultRoutines(): Routine[] {
  return [
    {
      id: 'morning',
      name: 'Ochtend',
      emoji: '☀️',
      tasks: [
        { id: 'morning-dress', title: 'Aankleden', emoji: '👕', minutes: 5 },
        { id: 'morning-teeth', title: 'Tanden poetsen', emoji: '🦷', minutes: 2 },
        { id: 'morning-breakfast', title: 'Ontbijten', emoji: '🥣', minutes: 10 },
        { id: 'morning-bag', title: 'Schoolspullen pakken', emoji: '🎒', minutes: 2 },
        { id: 'morning-hair', title: 'Haar kammen', emoji: '💇', minutes: 1 },
      ],
    },
    {
      id: 'evening',
      name: 'Avond',
      emoji: '🌙',
      tasks: [
        { id: 'evening-pyjama', title: 'Pyjama aan', emoji: '🩳', minutes: 3 },
        { id: 'evening-teeth', title: 'Tanden poetsen', emoji: '🦷', minutes: 2 },
        { id: 'evening-toys', title: 'Speelgoed opruimen', emoji: '🧸', minutes: 5 },
        { id: 'evening-book', title: 'Verhaaltje lezen', emoji: '📖', minutes: 10 },
        { id: 'evening-bed', title: 'Klaar voor bed', emoji: '🛏️', minutes: 0 },
      ],
    },
  ]
}