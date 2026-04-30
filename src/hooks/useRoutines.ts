import { useCallback, useState } from 'react'
import type { Routine } from '../types'

const ROUTINES_STORAGE_KEY = 'fittrack:routines'

export interface UseRoutinesResult {
  routines: Routine[]
  addRoutine: (routine: Routine) => void
  updateRoutine: (routine: Routine) => void
  deleteRoutine: (id: string) => void
}

function readStoredRoutines(): Routine[] {
  try {
    const rawValue = localStorage.getItem(ROUTINES_STORAGE_KEY)
    if (!rawValue) return []

    const parsedValue = JSON.parse(rawValue) as unknown
    if (!Array.isArray(parsedValue)) return []

    return parsedValue as Routine[]
  } catch {
    return []
  }
}

function writeStoredRoutines(routines: Routine[]): void {
  localStorage.setItem(ROUTINES_STORAGE_KEY, JSON.stringify(routines))
}

export function useRoutines(): UseRoutinesResult {
  const [routines, setRoutines] = useState<Routine[]>(() => readStoredRoutines())

  const addRoutine = useCallback((routine: Routine) => {
    setRoutines((prev) => {
      const nextRoutines = [...prev, routine]
      writeStoredRoutines(nextRoutines)
      return nextRoutines
    })
  }, [])

  const updateRoutine = useCallback((routine: Routine) => {
    setRoutines((prev) => {
      const nextRoutines = prev.map((r) => (r.id === routine.id ? routine : r))
      writeStoredRoutines(nextRoutines)
      return nextRoutines
    })
  }, [])

  const deleteRoutine = useCallback((id: string) => {
    setRoutines((prev) => {
      const nextRoutines = prev.filter((r) => r.id !== id)
      writeStoredRoutines(nextRoutines)
      return nextRoutines
    })
  }, [])

  return { routines, addRoutine, updateRoutine, deleteRoutine }
}
