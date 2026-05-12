import { useCallback, useState } from 'react'
import {
  createProgressEntry as createProgressRequest,
  deleteProgressEntryById as deleteProgressRequest,
  fetchAllProgressEntries,
  fetchProgressByExercise,
  updateProgressEntryById as updateProgressRequest,
} from '../api/client'
import {
  newProgressEntryId,
  progressInputToInsertRow,
  progressInputToUpdateRow,
  progressRowToEntry,
  type ProgressRow,
} from '../lib/progressDb'
import { getSupabaseClient } from '../lib/supabaseClient'
import type { LoadingState, ProgressEntry } from '../types'
import { useAuth } from './useAuth'

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

function sortEntriesAsc(list: ProgressEntry[]): ProgressEntry[] {
  return [...list].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )
}

function sortEntriesDesc(list: ProgressEntry[]): ProgressEntry[] {
  return [...list].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

export function useProgress(): UseProgressResult {
  const { user, loading: authLoading } = useAuth()
  const [entries, setEntries] = useState<ProgressEntry[]>([])
  const [state, setState] = useState<LoadingState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const useRemote = !authLoading && Boolean(user && getSupabaseClient())
  const userId = user?.id ?? null

  const getAllEntries = useCallback(async () => {
    if (authLoading) {
      return
    }
    try {
      setState('loading')
      setErrorMessage(null)
      if (!useRemote) {
        const data = await fetchAllProgressEntries()
        setEntries(sortEntriesDesc(data))
        setState('success')
        return
      }
      const supabase = getSupabaseClient()
      if (!supabase) {
        throw new Error('Cliente Supabase no disponible')
      }
      const { data, error } = await supabase
        .from('progress_entries')
        .select('*')
        .order('entry_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }
      setEntries((data ?? []).map((row) => progressRowToEntry(row as ProgressRow)))
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
  }, [authLoading, useRemote])

  const getByExercise = useCallback(
    async (exerciseName: string) => {
      if (authLoading) {
        return
      }
      const trimmed = exerciseName.trim()
      try {
        setState('loading')
        setErrorMessage(null)
        if (!useRemote) {
          const data = await fetchProgressByExercise(trimmed)
          setEntries(sortEntriesAsc(data))
          setState('success')
          return
        }
        const supabase = getSupabaseClient()
        if (!supabase) {
          throw new Error('Cliente Supabase no disponible')
        }
        const { data, error } = await supabase
          .from('progress_entries')
          .select('*')
          .order('entry_at', { ascending: true })

        if (error) {
          throw new Error(error.message)
        }
        const normalized = trimmed.toLowerCase()
        setEntries(
          (data ?? [])
            .map((row) => progressRowToEntry(row as ProgressRow))
            .filter((item) => item.exerciseName.toLowerCase() === normalized),
        )
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
    },
    [authLoading, useRemote],
  )

  const addEntry = useCallback(
    async (entry: Omit<ProgressEntry, 'id'>) => {
      try {
        setState('loading')
        setErrorMessage(null)
        if (!useRemote) {
          const createdEntry = await createProgressRequest(entry)
          setEntries((prev) =>
            sortEntriesAsc([...prev, createdEntry]),
          )
          setState('success')
          return
        }
        const supabase = getSupabaseClient()
        if (!supabase || !userId) {
          throw new Error('Sesión no disponible')
        }
        const id = newProgressEntryId()
        const { data, error } = await supabase
          .from('progress_entries')
          .insert(progressInputToInsertRow(id, userId, entry))
          .select('*')
          .single()

        if (error) {
          throw new Error(error.message)
        }
        const created = progressRowToEntry(data as ProgressRow)
        setEntries((prev) => sortEntriesDesc([created, ...prev]))
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
    },
    [useRemote, userId],
  )

  const updateEntry = useCallback(
    async (id: string, entry: Omit<ProgressEntry, 'id'>) => {
      try {
        setState('loading')
        setErrorMessage(null)
        if (!useRemote) {
          const updatedEntry = await updateProgressRequest(id, entry)
          setEntries((prev) =>
            prev.map((item) => (item.id === id ? updatedEntry : item)),
          )
          setState('success')
          return
        }
        const supabase = getSupabaseClient()
        if (!supabase) {
          throw new Error('Cliente Supabase no disponible')
        }
        const { data, error } = await supabase
          .from('progress_entries')
          .update(progressInputToUpdateRow(entry))
          .eq('id', id)
          .select('*')
          .single()

        if (error) {
          throw new Error(error.message)
        }
        const updated = progressRowToEntry(data as ProgressRow)
        setEntries((prev) => prev.map((item) => (item.id === id ? updated : item)))
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
    [useRemote],
  )

  const deleteEntry = useCallback(
    async (id: string) => {
      try {
        setState('loading')
        setErrorMessage(null)
        if (!useRemote) {
          await deleteProgressRequest(id)
          setEntries((prev) => prev.filter((item) => item.id !== id))
          setState('success')
          return
        }
        const supabase = getSupabaseClient()
        if (!supabase) {
          throw new Error('Cliente Supabase no disponible')
        }
        const { error } = await supabase.from('progress_entries').delete().eq('id', id)

        if (error) {
          throw new Error(error.message)
        }
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
    },
    [useRemote],
  )

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
