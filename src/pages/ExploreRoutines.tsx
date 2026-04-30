import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPopularRoutines } from '../api/client'
import { searchExercises, type ExerciseCatalogItem } from '../api/exerciseApi'
import { useRoutines } from '../hooks/useRoutines'
import type { LoadingState, Routine } from '../types'

function buildRoutineCopyId(sourceRoutineId: string, currentCount: number): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${sourceRoutineId}-copy-${currentCount + 1}`
}

function buildExerciseCopyId(
  sourceRoutineId: string,
  sourceExerciseId: string,
  exerciseIndex: number,
): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${sourceRoutineId}-${sourceExerciseId}-copy-${exerciseIndex + 1}`
}

export default function ExploreRoutines() {
  const { routines: myRoutines, addRoutine } = useRoutines()
  const [routines, setRoutines] = useState<Routine[]>([])
  const [state, setState] = useState<LoadingState>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [savedRoutineIds, setSavedRoutineIds] = useState<string[]>([])
  const [exerciseQuery, setExerciseQuery] = useState('')
  const [exerciseResults, setExerciseResults] = useState<ExerciseCatalogItem[]>([])
  const [exerciseState, setExerciseState] = useState<LoadingState>('idle')
  const [exerciseError, setExerciseError] = useState<string | null>(null)

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

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const visibleRoutines = useMemo(() => {
    if (!normalizedQuery) return routines

    return routines.filter((routine) => {
      const routineMatches = routine.name.toLowerCase().includes(normalizedQuery)
      const descriptionMatches = (routine.description ?? '')
        .toLowerCase()
        .includes(normalizedQuery)
      const exerciseMatches = routine.exercises.some((exercise) =>
        exercise.name.toLowerCase().includes(normalizedQuery),
      )

      return routineMatches || descriptionMatches || exerciseMatches
    })
  }, [normalizedQuery, routines])

  function hasRoutineInMyList(routine: Routine): boolean {
    return myRoutines.some((item) => item.name.toLowerCase() === routine.name.toLowerCase())
  }

  function saveRoutineToMyList(routine: Routine): void {
    if (hasRoutineInMyList(routine)) return

    const copiedRoutine: Routine = {
      ...routine,
      id: buildRoutineCopyId(routine.id, myRoutines.length),
      isPublic: false,
      createdAt: new Date().toISOString(),
      exercises: routine.exercises.map((exercise, index) => ({
        ...exercise,
        id: buildExerciseCopyId(routine.id, exercise.id, index),
      })),
    }

    addRoutine(copiedRoutine)
    setSavedRoutineIds((prev) => [...prev, routine.id])
  }

  async function handleExerciseSearch(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()

    try {
      setExerciseState('loading')
      setExerciseError(null)
      const results = await searchExercises(exerciseQuery)
      setExerciseResults(results)
      setExerciseState('success')
    } catch (error) {
      setExerciseState('error')
      setExerciseError(
        error instanceof Error ? error.message : 'No se pudieron cargar ejercicios de ExerciseDB',
      )
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-white">Explorar rutinas</h1>
      <p className="mt-2 text-gym-muted">
        Descubre rutinas populares predefinidas para inspirarte.
      </p>

      <section className="mt-5 rounded-lg border border-gym-border bg-gym-surface p-4">
        <label htmlFor="explore-search" className="mb-2 block text-sm text-gym-muted">
          Buscar por nombre de rutina o ejercicio
        </label>
        <input
          id="explore-search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="w-full rounded-md border border-gym-border bg-gym-bg px-3 py-2 text-white outline-none focus:border-gym-accent"
          placeholder="Ejemplo: push, squat, bench..."
        />
      </section>

      <section className="mt-4 rounded-lg border border-gym-border bg-gym-surface p-4">
        <h2 className="text-lg font-medium text-white">Buscar ejercicios en ExerciseDB</h2>
        <p className="mt-1 text-sm text-gym-muted">
          Consulta en tiempo real ejercicios externos y usa sus nombres en tus rutinas.
        </p>

        <form
          className="mt-3 flex flex-wrap gap-2"
          onSubmit={(event) => {
            void handleExerciseSearch(event)
          }}
        >
          <input
            value={exerciseQuery}
            onChange={(event) => setExerciseQuery(event.target.value)}
            className="min-w-64 flex-1 rounded-md border border-gym-border bg-gym-bg px-3 py-2 text-white outline-none focus:border-gym-accent"
            placeholder="Ejemplo: bench press"
            required
          />
          <button
            type="submit"
            disabled={exerciseState === 'loading'}
            className="rounded-md bg-gym-accent px-4 py-2 text-sm font-medium text-gym-bg disabled:opacity-60"
          >
            {exerciseState === 'loading' ? 'Buscando...' : 'Buscar'}
          </button>
          <Link
            to="/routines"
            className="rounded-md border border-gym-border px-4 py-2 text-sm text-white"
          >
            Crear rutina con resultados
          </Link>
        </form>

        {exerciseState === 'error' && exerciseError ? (
          <p className="mt-2 text-sm text-red-400">Error: {exerciseError}</p>
        ) : null}

        {exerciseState === 'success' ? (
          <ul className="mt-3 space-y-2">
            {exerciseResults.length === 0 ? (
              <li className="text-sm text-gym-muted">
                No se encontraron ejercicios para esa búsqueda.
              </li>
            ) : (
              exerciseResults.map((item) => (
                <li
                  key={item.externalId}
                  className="rounded-md border border-gym-border bg-gym-bg px-3 py-2"
                >
                  <p className="text-sm text-white">{item.name}</p>
                  <p className="text-xs text-gym-muted">
                    {item.bodyPart} · {item.target} · {item.muscleGroup}
                  </p>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </section>

      {state === 'loading' ? (
        <p className="mt-4 text-sm text-gym-muted">Cargando rutinas populares...</p>
      ) : null}
      {state === 'error' ? (
        <p className="mt-4 text-sm text-red-400">Error: {errorMessage}</p>
      ) : null}

      {state === 'success' ? (
        <section className="mt-6 space-y-3">
          {visibleRoutines.length === 0 ? (
            <p className="rounded-lg border border-dashed border-gym-border p-4 text-sm text-gym-muted">
              {normalizedQuery
                ? 'No encontramos rutinas que coincidan con tu búsqueda.'
                : 'No hay rutinas populares disponibles.'}
            </p>
          ) : (
            visibleRoutines.map((routine) => (
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

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={hasRoutineInMyList(routine) || savedRoutineIds.includes(routine.id)}
                    onClick={() => saveRoutineToMyList(routine)}
                    className="rounded-md bg-gym-accent px-3 py-1 text-xs font-medium text-gym-bg disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {hasRoutineInMyList(routine) || savedRoutineIds.includes(routine.id)
                      ? 'Ya guardada'
                      : 'Guardar en mis rutinas'}
                  </button>
                  <Link
                    to="/routines"
                    className="rounded-md border border-gym-border px-3 py-1 text-xs text-white"
                  >
                    Ir a mis rutinas
                  </Link>
                </div>
              </article>
            ))
          )}
        </section>
      ) : null}
    </div>
  )
}
