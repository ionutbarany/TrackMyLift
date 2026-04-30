import { useCallback, useState } from 'react'
import {
  createProgressEntry as createProgressRequest,
  deleteProgressEntryById as deleteProgressRequest,
  fetchAllProgressEntries,
  fetchProgressByExercise,
  updateProgressEntryById as updateProgressRequest,
} from '../api/client'
import type { LoadingState, ProgressEntry } from '../types'

export interface UseProgressResult {
  entries: ProgressEntry[]
  addEntry: (entry: Omit<ProgressEntry, 'id'>) => Promise<void>
  getAllEntries: () => Promise<void>
  getByExercise: (exerciseName: string) => Promise<void>
  updateEntry: (id: string, entry: Omit<ProgressEntry, 'id'>) => Promise<void>
  deleteEntry: (id: string) => Promise<void>
  state: LoadingState
  errorMessage: string | null
}

export function useProgress(): UseProgressResult {
  const [entries, setEntries] = useState<ProgressEntry[]>([])
  const [state, setState] = useState<LoadingState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const addEntry = useCallback(async (entry: Omit<ProgressEntry, 'id'>) => {
    try {
      setState('loading')
      setErrorMessage(null)
      const createdEntry = await createProgressRequest(entry)
      setEntries((prev) =>
        [...prev, createdEntry].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        ),
      )
      setState('success')
    } catch (error) {
      setState('error')
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo registrar el progreso',
      )
      throw error
    }
  }, [])

  const getAllEntries = useCallback(async () => {
    try {
      setState('loading')
      setErrorMessage(null)
      const data = await fetchAllProgressEntries()
      setEntries(data)
      setState('success')
    } catch (error) {
      setState('error')
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo cargar el historial de progreso',
      )
      throw error
    }
  }, [])

  const getByExercise = useCallback(async (exerciseName: string) => {
    try {
      setState('loading')
      setErrorMessage(null)
      const data = await fetchProgressByExercise(exerciseName)
      setEntries(data)
      setState('success')
    } catch (error) {
      setState('error')
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo cargar el historial de progreso',
      )
      throw error
    }
  }, [])

  const updateEntry = useCallback(
    async (id: string, entry: Omit<ProgressEntry, 'id'>) => {
      try {
        setState('loading')
        setErrorMessage(null)
        const updatedEntry = await updateProgressRequest(id, entry)
        setEntries((prev) =>
          prev.map((item) => (item.id === id ? updatedEntry : item)),
        )
        setState('success')
      } catch (error) {
        setState('error')
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'No se pudo actualizar el progreso',
        )
        throw error
      }
    },
    [],
  )

  const deleteEntry = useCallback(async (id: string) => {
    try {
      setState('loading')
      setErrorMessage(null)
      await deleteProgressRequest(id)
      setEntries((prev) => prev.filter((item) => item.id !== id))
      setState('success')
    } catch (error) {
      setState('error')
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo eliminar el registro de progreso',
      )
      throw error
    }
  }, [])

  return {
    entries,
    addEntry,
    getAllEntries,
    getByExercise,
    updateEntry,
    deleteEntry,
    state,
    errorMessage,
  }
}
