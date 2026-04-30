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
    const currentRoutines = readStoredRoutines()
    const nextRoutines = [...currentRoutines, routine]
    writeStoredRoutines(nextRoutines)
    setRoutines(nextRoutines)
  }, [])

  const updateRoutine = useCallback((routine: Routine) => {
    const currentRoutines = readStoredRoutines()
    const nextRoutines = currentRoutines.map((r) =>
      r.id === routine.id ? routine : r,
    )
    writeStoredRoutines(nextRoutines)
    setRoutines(nextRoutines)
  }, [])

  const deleteRoutine = useCallback((id: string) => {
    const currentRoutines = readStoredRoutines()
    const nextRoutines = currentRoutines.filter((r) => r.id !== id)
    writeStoredRoutines(nextRoutines)
    setRoutines(nextRoutines)
  }, [])

  return { routines, addRoutine, updateRoutine, deleteRoutine }
}
