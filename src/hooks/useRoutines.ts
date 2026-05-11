import { useCallback, useEffect, useState } from 'react'
import { routineRowToRoutine, routineToInsertRow, type RoutineRow } from '../lib/routinesDb'
import { getSupabaseClient } from '../lib/supabaseClient'
import type { Routine } from '../types'
import { useAuth } from './useAuth'

const ROUTINES_STORAGE_KEY = 'fittrack:routines'

export interface UseRoutinesResult {
  routines: Routine[]
  loading: boolean
  errorMessage: string | null
  addRoutine: (routine: Routine) => Promise<void>
  updateRoutine: (routine: Routine) => Promise<void>
  deleteRoutine: (id: string) => Promise<void>
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
  const { user, loading: authLoading } = useAuth()
  const [routines, setRoutines] = useState<Routine[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) {
      return
    }

    const supabase = getSupabaseClient()
    const useRemote = Boolean(user && supabase)

    if (!useRemote) {
      let cancelledLocal = false
      queueMicrotask(() => {
        if (cancelledLocal) return
        setRoutines(readStoredRoutines())
        setErrorMessage(null)
        setLoading(false)
      })
      return () => {
        cancelledLocal = true
      }
    }

    let cancelled = false

    const run = async () => {
      const client = getSupabaseClient()
      if (!client || !user) {
        return
      }

      try {
        const { data, error } = await client
          .from('routines')
          .select('*')
          .order('created_at', { ascending: true })

        if (cancelled) return

        if (error) {
          setRoutines([])
          setErrorMessage(error.message)
          return
        }

        const rows = (data ?? []) as RoutineRow[]
        let mapped = rows.map(routineRowToRoutine)

        if (mapped.length === 0) {
          const local = readStoredRoutines()
          if (local.length > 0) {
            const inserts = local.map((r) => routineToInsertRow(r, user.id))
            const { error: insertError } = await client.from('routines').insert(inserts)
            if (cancelled) return
            if (insertError) {
              setErrorMessage(insertError.message)
            } else {
              try {
                localStorage.removeItem(ROUTINES_STORAGE_KEY)
              } catch {
                /* ignore */
              }
              const res = await client
                .from('routines')
                .select('*')
                .order('created_at', { ascending: true })
              if (!cancelled && !res.error && res.data) {
                mapped = (res.data as RoutineRow[]).map(routineRowToRoutine)
              }
            }
          }
        }

        if (!cancelled) {
          setRoutines(mapped)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    queueMicrotask(() => {
      if (cancelled) return
      setLoading(true)
      setErrorMessage(null)
      void run()
    })

    return () => {
      cancelled = true
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- user?.id is the stable session key
  }, [authLoading, user?.id])

  const addRoutine = useCallback(
    async (routine: Routine) => {
      setErrorMessage(null)
      const supabase = getSupabaseClient()
      if (!user || !supabase) {
        const currentRoutines = readStoredRoutines()
        const nextRoutines = [...currentRoutines, routine]
        writeStoredRoutines(nextRoutines)
        setRoutines(nextRoutines)
        return
      }

      const { error } = await supabase
        .from('routines')
        .insert(routineToInsertRow(routine, user.id))

      if (error) {
        throw new Error(error.message)
      }

      setRoutines((prev) =>
        [...prev, routine].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ),
      )
    },
    [user],
  )

  const updateRoutine = useCallback(
    async (routine: Routine) => {
      setErrorMessage(null)
      const supabase = getSupabaseClient()
      if (!user || !supabase) {
        const currentRoutines = readStoredRoutines()
        const nextRoutines = currentRoutines.map((r) =>
          r.id === routine.id ? routine : r,
        )
        writeStoredRoutines(nextRoutines)
        setRoutines(nextRoutines)
        return
      }

      const { error } = await supabase
        .from('routines')
        .update({
          name: routine.name,
          description: routine.description ?? null,
          exercises: routine.exercises,
          is_public: routine.isPublic,
          created_at: routine.createdAt,
        })
        .eq('id', routine.id)

      if (error) {
        throw new Error(error.message)
      }

      setRoutines((prev) => prev.map((r) => (r.id === routine.id ? routine : r)))
    },
    [user],
  )

  const deleteRoutine = useCallback(
    async (id: string) => {
      setErrorMessage(null)
      const supabase = getSupabaseClient()
      if (!user || !supabase) {
        const currentRoutines = readStoredRoutines()
        const nextRoutines = currentRoutines.filter((r) => r.id !== id)
        writeStoredRoutines(nextRoutines)
        setRoutines(nextRoutines)
        return
      }

      const { error } = await supabase.from('routines').delete().eq('id', id)

      if (error) {
        throw new Error(error.message)
      }

      setRoutines((prev) => prev.filter((r) => r.id !== id))
    },
    [user],
  )

  return { routines, loading, errorMessage, addRoutine, updateRoutine, deleteRoutine }
}
