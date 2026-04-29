import { useEffect, useState } from 'react'
import { fetchPopularRoutines } from '../api/client'
import type { LoadingState, Routine } from '../types'

export default function ExploreRoutines() {
  const [routines, setRoutines] = useState<Routine[]>([])
  const [state, setState] = useState<LoadingState>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const abortController = new AbortController()

    fetchPopularRoutines()
      .then((data) => {
        if (abortController.signal.aborted) return
        setRoutines(data)
        setState('success')
      })
      .catch((error: unknown) => {
        if (abortController.signal.aborted) return
        setState('error')
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'No se pudieron cargar las rutinas populares',
        )
      })

    return () => {
      abortController.abort()
    }
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-white">Explorar rutinas</h1>
      <p className="mt-2 text-gym-muted">
        Descubre rutinas populares predefinidas para inspirarte.
      </p>

      {state === 'loading' ? (
        <p className="mt-4 text-sm text-gym-muted">Cargando rutinas populares...</p>
      ) : null}
      {state === 'error' ? (
        <p className="mt-4 text-sm text-red-400">Error: {errorMessage}</p>
      ) : null}

      {state === 'success' ? (
        <section className="mt-6 space-y-3">
          {routines.length === 0 ? (
            <p className="rounded-lg border border-dashed border-gym-border p-4 text-sm text-gym-muted">
              No hay rutinas populares disponibles.
            </p>
          ) : (
            routines.map((routine) => (
              <article
                key={routine.id}
                className="rounded-lg border border-gym-border bg-gym-surface p-4"
              >
                <h2 className="text-lg font-medium text-white">{routine.name}</h2>
                {routine.description ? (
                  <p className="mt-1 text-sm text-gym-muted">{routine.description}</p>
                ) : null}
                <p className="mt-2 text-xs text-gym-muted">
                  {routine.exercises.length} ejercicios · rutina pública
                </p>

                <ul className="mt-3 space-y-1">
                  {routine.exercises.slice(0, 4).map((exercise) => (
                    <li key={exercise.id} className="text-sm text-gym-muted">
                      - {exercise.name} ({exercise.sets}x{exercise.reps})
                    </li>
                  ))}
                </ul>
              </article>
            ))
          )}
        </section>
      ) : null}
    </div>
  )
}
