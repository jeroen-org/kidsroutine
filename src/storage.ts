import { createDefaultRoutines } from './data'
import type { AppState, CompletionMap, Routine, Task } from './types'
import { clamp, todayKey, truncateEmoji, uid } from './utils'

export const STORAGE_KEY = 'mijn-routine:v1'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function defaultActiveRoutine(): string {
  const hour = new Date().getHours()
  return hour >= 17 ? 'evening' : 'morning'
}

export function createDefaultState(): AppState {
  return {
    version: 1,
    routines: createDefaultRoutines(),
    activeRoutineId: defaultActiveRoutine(),
    completions: {},
  }
}

function sanitizeEmoji(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback
  const emoji = truncateEmoji(value)
  return emoji || fallback
}

function sanitizeTask(raw: unknown): Task | null {
  if (!isRecord(raw)) return null
  const title = typeof raw.title === 'string' ? raw.title.trim().slice(0, 60) : ''
  if (!title) return null

  const minutesValue = typeof raw.minutes === 'number' ? raw.minutes : Number(raw.minutes)
  const minutes = Number.isFinite(minutesValue) ? Math.round(clamp(minutesValue, 0, 180)) : 0

  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : uid(),
    title,
    emoji: sanitizeEmoji(raw.emoji, '⭐'),
    minutes,
  }
}

function sanitizeRoutine(raw: unknown): Routine | null {
  if (!isRecord(raw)) return null
  const name = typeof raw.name === 'string' ? raw.name.trim().slice(0, 40) : ''
  if (!name) return null

  const tasks: Task[] = []
  const seen = new Set<string>()
  if (Array.isArray(raw.tasks)) {
    for (const item of raw.tasks) {
      const task = sanitizeTask(item)
      if (task && !seen.has(task.id)) {
        seen.add(task.id)
        tasks.push(task)
      }
    }
  }

  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : uid(),
    name,
    emoji: sanitizeEmoji(raw.emoji, '🌟'),
    tasks,
  }
}

function sanitizeCompletions(raw: unknown): CompletionMap {
  const result: CompletionMap = {}
  if (!isRecord(raw)) return result

  for (const [date, value] of Object.entries(raw)) {
    if (!isRecord(value)) continue
    const perRoutine: Record<string, string[]> = {}
    for (const [routineId, list] of Object.entries(value)) {
      if (!Array.isArray(list)) continue
      const ids = list.filter((id): id is string => typeof id === 'string' && id.length > 0)
      if (ids.length > 0) perRoutine[routineId] = ids
    }
    if (Object.keys(perRoutine).length > 0) result[date] = perRoutine
  }

  return result
}

function pruneOldCompletions(completions: CompletionMap): CompletionMap {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 60)
  const cutoffKey = todayKey(cutoff)

  const result: CompletionMap = {}
  for (const [date, value] of Object.entries(completions)) {
    if (date >= cutoffKey) result[date] = value
  }
  return result
}

function sanitizeState(raw: unknown): AppState {
  if (!isRecord(raw)) return createDefaultState()

  const routines: Routine[] = []
  const seen = new Set<string>()

  if (Array.isArray(raw.routines)) {
    for (const item of raw.routines) {
      const routine = sanitizeRoutine(item)
      if (routine && !seen.has(routine.id)) {
        seen.add(routine.id)
        routines.push(routine)
      }
    }
  }

  if (routines.length === 0) return createDefaultState()

  const activeRoutineId =
    typeof raw.activeRoutineId === 'string' && seen.has(raw.activeRoutineId)
      ? raw.activeRoutineId
      : routines[0].id

  return {
    version: 1,
    routines,
    activeRoutineId,
    completions: pruneOldCompletions(sanitizeCompletions(raw.completions)),
  }
}

export function loadState(): AppState {
  if (typeof window === 'undefined') return createDefaultState()

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefaultState()
    return sanitizeState(JSON.parse(raw))
  } catch {
    return createDefaultState()
  }
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Opslag kan geblokkeerd zijn (bijv. privémodus). De app blijft dan gewoon werken.
  }
}