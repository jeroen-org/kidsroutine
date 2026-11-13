export interface Task {
  id: string
  title: string
  emoji: string
  /** Timer in minuten. 0 betekent: geen timer. */
  minutes: number
}

export interface Routine {
  id: string
  name: string
  emoji: string
  tasks: Task[]
}

/** Per datum (YYYY-MM-DD) en per routine een lijst met voltooide taak-id's. */
export type CompletionMap = Record<string, Record<string, string[]>>

export interface AppState {
  version: 1
  routines: Routine[]
  activeRoutineId: string
  completions: CompletionMap
}