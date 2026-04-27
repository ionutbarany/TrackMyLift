import { useCallback, useState } from 'react'
import type { LoadingState, ProgressEntry } from '../types'

export interface UseProgressResult {
  entries: ProgressEntry[]
  addEntry: (entry: Omit<ProgressEntry, 'id'>) => Promise<void>
  getByExercise: (exerciseName: string) => ProgressEntry[]
  state: LoadingState
}

export function useProgress(): UseProgressResult {
  const [entries] = useState<ProgressEntry[]>([])
  const [state] = useState<LoadingState>('idle')

  const addEntry = useCallback(async (entry: Omit<ProgressEntry, 'id'>) => {
    void entry
    // Implementación con fetch en src/api/ en un bloque posterior.
  }, [])

  const getByExercise = useCallback((exerciseName: string) => {
    void exerciseName
    return [] as ProgressEntry[]
  }, [])

  return { entries, addEntry, getByExercise, state }
}
