import { useCallback, useEffect, useState } from 'react'
import FocusScreen from './components/FocusScreen'
import HomeScreen from './components/HomeScreen'
import SettingsScreen from './components/SettingsScreen'
import {
  useInstallPrompt,
  useOnlineStatus,
  useTodayKey,
} from './hooks'
import { createDefaultState, loadState, saveState } from './storage'
import type { AppState } from './types'

type Screen =
  | { name: 'home' }
  | { name: 'focus'; taskId: string }
  | { name: 'settings' }

export default function App() {
  const [state, setState] = useState<AppState>(loadState)
  const [screen, setScreen] = useState<Screen>({ name: 'home' })
  const today = useTodayKey()
  const online = useOnlineStatus()
  const install = useInstallPrompt()

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    window.history.replaceState({ appScreen: 'home' }, '')

    const handlePopState = (event: PopStateEvent) => {
      const historyState = event.state as
        | { appScreen?: string; taskId?: string }
        | null

      if (historyState?.appScreen === 'settings') {
        setScreen({ name: 'settings' })
      } else if (
        historyState?.appScreen === 'focus' &&
        typeof historyState.taskId === 'string'
      ) {
        setScreen({ name: 'focus', taskId: historyState.taskId })
      } else {
        setScreen({ name: 'home' })
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const activeRoutine =
    state.routines.find((routine) => routine.id === state.activeRoutineId) ??
    state.routines[0]

  const doneIds = new Set(state.completions[today]?.[activeRoutine.id] ?? [])
  const doneCount = activeRoutine.tasks.filter((task) => doneIds.has(task.id)).length

  const updateState = useCallback(
    (updater: (current: AppState) => AppState) => {
      setState((current) => updater(current))
    },
    [],
  )

  const setTaskDone = useCallback(
    (taskId: string, done: boolean) => {
      updateState((current) => {
        const routine =
          current.routines.find((item) => item.id === current.activeRoutineId) ??
          current.routines[0]
        const forDate = current.completions[today] ?? {}
        const list = forDate[routine.id] ?? []
        const nextList = done
          ? Array.from(new Set([...list, taskId]))
          : list.filter((id) => id !== taskId)

        const nextForDate = { ...forDate }
        if (nextList.length > 0) {
          nextForDate[routine.id] = nextList
        } else {
          delete nextForDate[routine.id]
        }

        const completions = { ...current.completions }
        if (Object.keys(nextForDate).length > 0) {
          completions[today] = nextForDate
        } else {
          delete completions[today]
        }

        return { ...current, completions }
      })
    },
    [today, updateState],
  )

  const selectRoutine = useCallback(
    (id: string) => {
      updateState((current) =>
        current.routines.some((routine) => routine.id === id)
          ? { ...current, activeRoutineId: id }
          : current,
      )
    },
    [updateState],
  )

  const openTask = useCallback((taskId: string) => {
    window.history.pushState({ appScreen: 'focus', taskId }, '')
    setScreen({ name: 'focus', taskId })
  }, [])

  const closeFocus = useCallback(() => {
    const current = window.history.state as { appScreen?: string } | null
    if (current?.appScreen === 'focus') {
      window.history.back()
    } else {
      setScreen({ name: 'home' })
    }
  }, [])

  const openSettings = useCallback(() => {
    window.history.pushState({ appScreen: 'settings' }, '')
    setScreen({ name: 'settings' })
  }, [])

  const closeSettings = useCallback(() => {
    const current = window.history.state as { appScreen?: string } | null
    if (current?.appScreen === 'settings') {
      window.history.back()
    } else {
      setScreen({ name: 'home' })
    }
  }, [])

  const resetToday = useCallback(() => {
    updateState((current) => {
      const completions = { ...current.completions }
      delete completions[today]
      return { ...current, completions }
    })
  }, [today, updateState])

  const restoreDefaults = useCallback(() => {
    setState(createDefaultState())
    const current = window.history.state as { appScreen?: string } | null
    if (current?.appScreen === 'settings') {
      window.history.back()
    } else {
      setScreen({ name: 'home' })
    }
  }, [])

  const completeTask = useCallback(
    (taskId: string) => {
      setTaskDone(taskId, true)
    },
    [setTaskDone],
  )

  const undoTask = useCallback(
    (taskId: string) => {
      setTaskDone(taskId, false)
      closeFocus()
    },
    [closeFocus, setTaskDone],
  )

  const focusTask =
    screen.name === 'focus'
      ? activeRoutine.tasks.find((task) => task.id === screen.taskId)
      : undefined

  return (
    <>
      <div className="app-backdrop" aria-hidden="true" />

      {screen.name === 'settings' ? (
        <SettingsScreen
          state={state}
          activeRoutine={activeRoutine}
          today={today}
          onBack={closeSettings}
          onChange={updateState}
          onResetToday={resetToday}
          onRestoreDefaults={restoreDefaults}
          install={install}
          online={online}
        />
      ) : screen.name === 'focus' && focusTask ? (
        <FocusScreen
          key={focusTask.id}
          routine={activeRoutine}
          task={focusTask}
          taskIndex={activeRoutine.tasks.findIndex((task) => task.id === focusTask.id)}
          taskCount={activeRoutine.tasks.length}
          done={doneIds.has(focusTask.id)}
          doneCount={doneCount}
          onClose={closeFocus}
          onComplete={() => completeTask(focusTask.id)}
          onUndo={() => undoTask(focusTask.id)}
        />
      ) : (
        <HomeScreen
          state={state}
          routine={activeRoutine}
          doneIds={doneIds}
          onSelectRoutine={selectRoutine}
          onOpenTask={openTask}
          onOpenSettings={openSettings}
          online={online}
        />
      )}
    </>
  )
}