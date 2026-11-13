import { useCallback, useEffect, useState } from 'react'
import { todayKey } from './utils'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean }
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    navigatorWithStandalone.standalone === true
  )
}

export function isIosDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const isIos = /iPad|iPhone|iPod/.test(ua)
  const isIpadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
  return isIos || isIpadOS
}

export interface InstallPrompt {
  canInstall: boolean
  installed: boolean
  isIos: boolean
  promptInstall: () => Promise<boolean>
}

export function useInstallPrompt(): InstallPrompt {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState<boolean>(() => isStandalone())

  useEffect(() => {
    const handleBeforeInstall = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
    }
    const handleInstalled = () => {
      setInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false
    try {
      await deferredPrompt.prompt()
      const choice = await deferredPrompt.userChoice
      setDeferredPrompt(null)
      return choice.outcome === 'accepted'
    } catch {
      setDeferredPrompt(null)
      return false
    }
  }, [deferredPrompt])

  return {
    canInstall: deferredPrompt !== null,
    installed,
    isIos: isIosDevice(),
    promptInstall,
  }
}

export function useOnlineStatus(): boolean {
  const [online, setOnline] = useState<boolean>(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine,
  )

  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return online
}

/** Houdt de huidige dag bij, zodat de voortgang om middernacht automatisch reset. */
export function useTodayKey(): string {
  const [key, setKey] = useState<string>(() => todayKey())

  useEffect(() => {
    const interval = window.setInterval(() => {
      setKey((current) => {
        const next = todayKey()
        return next === current ? current : next
      })
    }, 60_000)
    return () => window.clearInterval(interval)
  }, [])

  return key
}

/** Voorkomt dat de achtergrond meescrollt achter een volledig scherm of modal. */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [locked])
}