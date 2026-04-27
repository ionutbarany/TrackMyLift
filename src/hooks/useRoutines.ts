import { useCallback, useState } from 'react'
import type { Routine } from '../types'

export interface UseRoutinesResult {
  routines: Routine[]
  addRoutine: (routine: Routine) => void
  updateRoutine: (routine: Routine) => void
  deleteRoutine: (id: string) => void
}

export function useRoutines(): UseRoutinesResult {
  const [routines, setRoutines] = useState<Routine[]>([])

  const addRoutine = useCallback((routine: Routine) => {
    setRoutines((prev) => [...prev, routine])
  }, [])

  const updateRoutine = useCallback((routine: Routine) => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === routine.id ? routine : r)),
    )
  }, [])

  const deleteRoutine = useCallback((id: string) => {
    setRoutines((prev) => prev.filter((r) => r.id !== id))
  }, [])

  return { routines, addRoutine, updateRoutine, deleteRoutine }
}
