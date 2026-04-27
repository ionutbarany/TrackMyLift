import { useCallback, useState } from 'react'
import type { LoadingState, Session } from '../types'

export interface UseSessionLogResult {
  sessions: Session[]
  logSession: (session: Omit<Session, 'id'>) => Promise<void>
  deleteSession: (id: string) => Promise<void>
  state: LoadingState
}

export function useSessionLog(): UseSessionLogResult {
  const [sessions] = useState<Session[]>([])
  const [state] = useState<LoadingState>('idle')

  const logSession = useCallback(async (session: Omit<Session, 'id'>) => {
    void session
    // Implementación con fetch en src/api/ en un bloque posterior.
  }, [])

  const deleteSession = useCallback(async (id: string) => {
    void id
    // Implementación con fetch en src/api/ en un bloque posterior.
  }, [])

  return { sessions, logSession, deleteSession, state }
}
