import { useCallback, useState } from 'react'
import {
  createSession as createSessionRequest,
  deleteSessionById,
  fetchSessions,
  updateSessionById,
} from '../api/client'
import type { LoadingState, Session } from '../types'

export interface UseSessionLogResult {
  sessions: Session[]
  logSession: (session: Omit<Session, 'id'>) => Promise<void>
  getAllSessions: () => Promise<void>
  updateSession: (id: string, session: Omit<Session, 'id'>) => Promise<void>
  deleteSession: (id: string) => Promise<void>
  state: LoadingState
  errorMessage: string | null
}

export function useSessionLog(): UseSessionLogResult {
  const [sessions, setSessions] = useState<Session[]>([])
  const [state, setState] = useState<LoadingState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const logSession = useCallback(async (session: Omit<Session, 'id'>) => {
    try {
      setState('loading')
      setErrorMessage(null)
      const createdSession = await createSessionRequest(session)
      setSessions((prev) =>
        [createdSession, ...prev].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
      )
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
  }, [])

  const getAllSessions = useCallback(async () => {
    try {
      setState('loading')
      setErrorMessage(null)
      const data = await fetchSessions()
      setSessions(data)
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
  }, [])

  const updateSession = useCallback(
    async (id: string, session: Omit<Session, 'id'>) => {
      try {
        setState('loading')
        setErrorMessage(null)
        const updatedSession = await updateSessionById(id, session)
        setSessions((prev) =>
          prev
            .map((item) => (item.id === id ? updatedSession : item))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
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
    [],
  )

  const deleteSession = useCallback(async (id: string) => {
    try {
      setState('loading')
      setErrorMessage(null)
      await deleteSessionById(id)
      setSessions((prev) => prev.filter((session) => session.id !== id))
      setState('success')
    } catch (error) {
      setState('error')
      setErrorMessage(
        error instanceof Error ? error.message : 'No se pudo eliminar la sesión',
      )
      throw error
    }
  }, [])

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
