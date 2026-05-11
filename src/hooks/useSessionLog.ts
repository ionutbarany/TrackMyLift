import { useCallback, useState } from 'react'
import {
  createSession as createSessionRequest,
  deleteSessionById,
  fetchSessions,
  updateSessionById,
} from '../api/client'
import {
  newSessionId,
  sessionInputToInsertRow,
  sessionInputToUpdateRow,
  sessionRowToSession,
  type SessionRow,
} from '../lib/sessionsDb'
import { getSupabaseClient } from '../lib/supabaseClient'
import type { LoadingState, Session } from '../types'
import { useAuth } from './useAuth'

export interface UseSessionLogResult {
  sessions: Session[]
  logSession: (session: Omit<Session, 'id'>) => Promise<void>
  getAllSessions: () => Promise<void>
  updateSession: (id: string, session: Omit<Session, 'id'>) => Promise<void>
  deleteSession: (id: string) => Promise<void>
  state: LoadingState
  errorMessage: string | null
}

function sortSessionsDesc(list: Session[]): Session[] {
  return [...list].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

export function useSessionLog(): UseSessionLogResult {
  const { user, loading: authLoading } = useAuth()
  const [sessions, setSessions] = useState<Session[]>([])
  const [state, setState] = useState<LoadingState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const useRemote = !authLoading && Boolean(user && getSupabaseClient())
  const userId = user?.id ?? null

  const getAllSessions = useCallback(async () => {
    if (authLoading) {
      return
    }
    try {
      setState('loading')
      setErrorMessage(null)
      if (!useRemote) {
        const data = await fetchSessions()
        setSessions(sortSessionsDesc(data))
        setState('success')
        return
      }
      const supabase = getSupabaseClient()
      if (!supabase) {
        throw new Error('Cliente Supabase no disponible')
      }
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('workout_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }
      setSessions((data ?? []).map((row) => sessionRowToSession(row as SessionRow)))
      setState('success')
    } catch (error) {
      setState('error')
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar las sesiones',
      )
      throw error
    }
  }, [authLoading, useRemote])

  const logSession = useCallback(
    async (session: Omit<Session, 'id'>) => {
      try {
        setState('loading')
        setErrorMessage(null)
        if (!useRemote) {
          const createdSession = await createSessionRequest(session)
          setSessions((prev) => sortSessionsDesc([createdSession, ...prev]))
          setState('success')
          return
        }
        const supabase = getSupabaseClient()
        if (!supabase || !userId) {
          throw new Error('Sesión no disponible')
        }
        const id = newSessionId()
        const { data, error } = await supabase
          .from('sessions')
          .insert(sessionInputToInsertRow(id, userId, session))
          .select('*')
          .single()

        if (error) {
          throw new Error(error.message)
        }
        const created = sessionRowToSession(data as SessionRow)
        setSessions((prev) => sortSessionsDesc([created, ...prev]))
        setState('success')
      } catch (error) {
        setState('error')
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'No se pudo registrar la sesión',
        )
        throw error
      }
    },
    [useRemote, userId],
  )

  const updateSession = useCallback(
    async (id: string, session: Omit<Session, 'id'>) => {
      try {
        setState('loading')
        setErrorMessage(null)
        if (!useRemote) {
          const updatedSession = await updateSessionById(id, session)
          setSessions((prev) =>
            sortSessionsDesc(
              prev.map((item) => (item.id === id ? updatedSession : item)),
            ),
          )
          setState('success')
          return
        }
        const supabase = getSupabaseClient()
        if (!supabase) {
          throw new Error('Cliente Supabase no disponible')
        }
        const { data, error } = await supabase
          .from('sessions')
          .update(sessionInputToUpdateRow(session))
          .eq('id', id)
          .select('*')
          .single()

        if (error) {
          throw new Error(error.message)
        }
        const updated = sessionRowToSession(data as SessionRow)
        setSessions((prev) =>
          sortSessionsDesc(prev.map((item) => (item.id === id ? updated : item))),
        )
        setState('success')
      } catch (error) {
        setState('error')
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'No se pudo actualizar la sesión',
        )
        throw error
      }
    },
    [useRemote],
  )

  const deleteSession = useCallback(
    async (id: string) => {
      try {
        setState('loading')
        setErrorMessage(null)
        if (!useRemote) {
          await deleteSessionById(id)
          setSessions((prev) => prev.filter((session) => session.id !== id))
          setState('success')
          return
        }
        const supabase = getSupabaseClient()
        if (!supabase) {
          throw new Error('Cliente Supabase no disponible')
        }
        const { error } = await supabase.from('sessions').delete().eq('id', id)

        if (error) {
          throw new Error(error.message)
        }
        setSessions((prev) => prev.filter((session) => session.id !== id))
        setState('success')
      } catch (error) {
        setState('error')
        setErrorMessage(
          error instanceof Error ? error.message : 'No se pudo eliminar la sesión',
        )
        throw error
      }
    },
    [useRemote],
  )

  return {
    sessions,
    logSession,
    getAllSessions,
    updateSession,
    deleteSession,
    state,
    errorMessage,
  }
}
