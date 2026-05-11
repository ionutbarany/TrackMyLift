import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchSessions } from '../api/client'
import { useRoutines } from '../hooks/useRoutines'
import type { LoadingState, Session } from '../types'

function getStartOfWeek(referenceDate: Date): Date {
  const result = new Date(referenceDate)
  const day = result.getDay()
  const diff = day === 0 ? -6 : 1 - day
  result.setDate(result.getDate() + diff)
  result.setHours(0, 0, 0, 0)
  return result
}

function getStartOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

function getTrainingStreak(sessions: Session[]): number {
  if (sessions.length === 0) return 0

  const trainingDays = new Set(
    sessions.map((session) => getStartOfDay(new Date(session.date)).getTime()),
  )

  const today = getStartOfDay(new Date())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const hasTodaySession = trainingDays.has(today.getTime())
  const hasYesterdaySession = trainingDays.has(yesterday.getTime())

  if (!hasTodaySession && !hasYesterdaySession) return 0

  const anchorDay = hasTodaySession ? today : yesterday
  let streak = 0
  const cursor = new Date(anchorDay)

  while (trainingDays.has(cursor.getTime())) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

export default function Dashboard() {
  const { routines, loading: routinesLoading } = useRoutines()
  const [sessions, setSessions] = useState<Session[]>([])
  const [state, setState] = useState<LoadingState>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const abortController = new AbortController()

    fetchSessions()
      .then((data) => {
        if (abortController.signal.aborted) return
        setSessions(data)
        setState('success')
      })
      .catch((error: unknown) => {
        if (abortController.signal.aborted) return
        setState('error')
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'No se pudo cargar el resumen de sesiones',
        )
      })

    return () => {
      abortController.abort()
    }
  }, [])

  const weekSessionCount = useMemo(() => {
    const startOfWeek = getStartOfWeek(new Date()).getTime()
    return sessions.filter((session) => new Date(session.date).getTime() >= startOfWeek)
      .length
  }, [sessions])

  const lastSession = useMemo(() => {
    if (sessions.length === 0) return null
    return [...sessions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )[0]
  }, [sessions])

  const trainingStreak = useMemo(() => getTrainingStreak(sessions), [sessions])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-white">Inicio</h1>
      <p className="mt-2 text-gym-muted">
        Resumen rápido de tu semana para retomar el entrenamiento sin perder tiempo.
      </p>

      {state === 'loading' ? (
        <p className="mt-4 rounded-lg border border-gym-border bg-gym-surface p-4 text-sm text-gym-muted">
          Cargando resumen semanal...
        </p>
      ) : null}

      {state === 'error' && errorMessage ? (
        <p className="mt-4 rounded-lg border border-red-500/40 bg-gym-surface p-4 text-sm text-red-400">
          Error: {errorMessage}
        </p>
      ) : null}

      {state === 'success' ? (
        <>
          <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-lg border border-gym-border bg-gym-surface p-4">
              <p className="text-sm text-gym-muted">Sesiones esta semana</p>
              <p className="mt-2 text-3xl font-semibold text-white">{weekSessionCount}</p>
            </article>

            <article className="rounded-lg border border-gym-border bg-gym-surface p-4">
              <p className="text-sm text-gym-muted">Rutinas guardadas</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {routinesLoading ? '…' : routines.length}
              </p>
            </article>

            <article className="rounded-lg border border-gym-border bg-gym-surface p-4">
              <p className="text-sm text-gym-muted">Última sesión</p>
              {lastSession ? (
                <>
                  <p className="mt-2 text-base font-medium text-white">
                    {lastSession.routineName}
                  </p>
                  <p className="text-xs text-gym-muted">
                    {new Date(lastSession.date).toLocaleString()}
                  </p>
                </>
              ) : (
                <p className="mt-2 text-sm text-gym-muted">Sin sesiones registradas</p>
              )}
            </article>

            <article className="rounded-lg border border-gym-border bg-gym-surface p-4">
              <p className="text-sm text-gym-muted">Racha actual</p>
              <p className="mt-2 text-3xl font-semibold text-white">{trainingStreak}</p>
              <p className="text-xs text-gym-muted">
                {trainingStreak === 1 ? 'día consecutivo' : 'días consecutivos'}
              </p>
            </article>
          </section>

          <section className="mt-6 rounded-lg border border-gym-border bg-gym-surface p-4">
            <h2 className="text-lg font-medium text-white">Accesos rápidos</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                to="/session"
                className="rounded-md bg-gym-accent px-4 py-2 text-sm font-medium text-gym-bg"
              >
                Registrar sesión
              </Link>
              <Link
                to="/routines"
                className="rounded-md border border-gym-border px-4 py-2 text-sm text-white"
              >
                Gestionar rutinas
              </Link>
              <Link
                to="/progress"
                className="rounded-md border border-gym-border px-4 py-2 text-sm text-white"
              >
                Ver progreso
              </Link>
            </div>
          </section>
        </>
      ) : null}
    </div>
  )
}
