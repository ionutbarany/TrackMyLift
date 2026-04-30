import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { searchExercises, type ExerciseCatalogItem } from '../api/exerciseApi'
import { useRoutines } from '../hooks/useRoutines'
import type { Exercise, MuscleGroup, Routine } from '../types'

interface ExerciseFormState {
  name: string
  muscleGroup: MuscleGroup
  sets: string
  reps: string
  weight: string
  notes: string
}

const initialExerciseForm: ExerciseFormState = {
  name: '',
  muscleGroup: 'chest',
  sets: '3',
  reps: '10',
  weight: '0',
  notes: '',
}

const muscleGroups: MuscleGroup[] = [
  'chest',
  'back',
  'legs',
  'shoulders',
  'arms',
  'core',
  'glutes',
  'cardio',
]

function buildExerciseId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `exercise_${Date.now()}_${Math.floor(Math.random() * 10000)}`
}

function upsertRoutineExercise(
  routine: Routine,
  exercise: Exercise,
  editingExerciseId: string | null,
): Routine {
  const exercises = editingExerciseId
    ? routine.exercises.map((item) => (item.id === editingExerciseId ? exercise : item))
    : [...routine.exercises, exercise]

  return { ...routine, exercises }
}

export default function RoutineDetail() {
  const { id } = useParams()
  const { routines, updateRoutine } = useRoutines()
  const [form, setForm] = useState<ExerciseFormState>(initialExerciseForm)
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null)
  const [catalogQuery, setCatalogQuery] = useState('')
  const [catalogResults, setCatalogResults] = useState<ExerciseCatalogItem[]>([])
  const [isRoutineCollapsed, setIsRoutineCollapsed] = useState(false)
  const [catalogState, setCatalogState] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle',
  )
  const [catalogError, setCatalogError] = useState<string | null>(null)

  const routine = useMemo(
    () => routines.find((routineItem) => routineItem.id === id) ?? null,
    [id, routines],
  )

  const nameError = useMemo(() => {
    if (form.name.trim().length === 0) return 'El nombre del ejercicio es obligatorio'
    if (form.name.trim().length < 2) return 'Mínimo 2 caracteres'
    return ''
  }, [form.name])

  const parsedSets = Number(form.sets)
  const parsedReps = Number(form.reps)
  const parsedWeight = Number(form.weight)
  const setsError =
    Number.isNaN(parsedSets) || parsedSets < 1 ? 'Series debe ser mayor o igual a 1' : ''
  const repsError =
    Number.isNaN(parsedReps) || parsedReps < 1 ? 'Repeticiones debe ser mayor o igual a 1' : ''
  const weightError =
    Number.isNaN(parsedWeight) || parsedWeight < 0 ? 'Peso debe ser mayor o igual a 0' : ''

  const isFormValid =
    !nameError.length && !setsError.length && !repsError.length && !weightError.length

  function resetForm(): void {
    setForm(initialExerciseForm)
    setEditingExerciseId(null)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    if (!routine || !isFormValid) return

    const nextExercise: Exercise = {
      id: editingExerciseId ?? buildExerciseId(),
      name: form.name.trim(),
      muscleGroup: form.muscleGroup,
      sets: parsedSets,
      reps: parsedReps,
      weight: parsedWeight,
      notes: form.notes.trim() || undefined,
    }

    updateRoutine(upsertRoutineExercise(routine, nextExercise, editingExerciseId))
    resetForm()
  }

  function handleDeleteExercise(exerciseId: string): void {
    if (!routine) return

    const nextRoutine: Routine = {
      ...routine,
      exercises: routine.exercises.filter((exercise) => exercise.id !== exerciseId),
    }
    updateRoutine(nextRoutine)

    if (editingExerciseId === exerciseId) {
      resetForm()
    }
  }

  function handleEditExercise(exercise: Exercise): void {
    setEditingExerciseId(exercise.id)
    setForm({
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      sets: String(exercise.sets),
      reps: String(exercise.reps),
      weight: String(exercise.weight),
      notes: exercise.notes ?? '',
    })
  }

  async function handleCatalogSearch(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()

    try {
      setCatalogState('loading')
      setCatalogError(null)
      const results = await searchExercises(catalogQuery)
      setCatalogResults(results)
      setCatalogState('success')
    } catch (error) {
      setCatalogState('error')
      setCatalogError(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar ejercicios de ExerciseDB',
      )
    }
  }

  function applyCatalogExercise(item: ExerciseCatalogItem): void {
    setForm((prev) => ({
      ...prev,
      name: item.name,
      muscleGroup: item.muscleGroup,
    }))
  }

  if (!routine) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-semibold text-white">Rutina no encontrada</h1>
        <p className="mt-2 text-gym-muted">
          La rutina no existe o fue eliminada. Vuelve a la lista para seleccionarla otra vez.
        </p>
        <Link
          to="/routines"
          className="mt-4 inline-block rounded-md bg-gym-accent px-4 py-2 text-sm font-medium text-gym-bg"
        >
          Volver a mis rutinas
        </Link>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-white">{routine.name}</h1>
      <p className="mt-2 text-gym-muted">
        Gestiona ejercicios de la rutina ({routine.exercises.length}).
      </p>

      <section className="mt-6 rounded-lg border border-gym-border bg-gym-surface p-4">
        <h2 className="text-lg font-medium text-white">Buscar en ExerciseDB</h2>
        <p className="mt-1 text-sm text-gym-muted">
          Busca por nombre y autocompleta el formulario con el ejercicio seleccionado.
        </p>

        <form
          className="mt-3 flex gap-2"
          onSubmit={(event) => {
            void handleCatalogSearch(event)
          }}
        >
          <input
            value={catalogQuery}
            onChange={(event) => setCatalogQuery(event.target.value)}
            className="w-full rounded-md border border-gym-border bg-gym-bg px-3 py-2 text-white outline-none focus:border-gym-accent"
            placeholder="Ejemplo: bench press"
            required
          />
          <button
            type="submit"
            disabled={catalogState === 'loading'}
            className="rounded-md bg-gym-accent px-4 py-2 text-sm font-medium text-gym-bg disabled:opacity-60"
          >
            {catalogState === 'loading' ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        {catalogState === 'error' && catalogError ? (
          <p className="mt-2 text-sm text-red-400">Error: {catalogError}</p>
        ) : null}

        {catalogState === 'success' ? (
          <ul className="mt-3 space-y-2">
            {catalogResults.length === 0 ? (
              <li className="text-sm text-gym-muted">No se encontraron ejercicios.</li>
            ) : (
              catalogResults.map((item) => (
                <li
                  key={item.externalId}
                  className="flex items-center justify-between rounded-md border border-gym-border bg-gym-bg px-3 py-2"
                >
                  <div>
                    <p className="text-sm text-white">{item.name}</p>
                    <p className="text-xs text-gym-muted">
                      {item.bodyPart} · {item.target}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => applyCatalogExercise(item)}
                    className="rounded-md border border-gym-border px-3 py-1 text-xs text-white"
                  >
                    Usar
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </section>

      <form
        className="mt-6 space-y-4 rounded-lg border border-gym-border bg-gym-surface p-4"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="mb-1 block text-sm text-gym-muted" htmlFor="exercise-name">
            Nombre del ejercicio
          </label>
          <input
            id="exercise-name"
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, name: event.target.value }))
            }
            className="w-full rounded-md border border-gym-border bg-gym-bg px-3 py-2 text-white outline-none focus:border-gym-accent"
            placeholder="Bench Press"
          />
          {nameError ? <p className="mt-1 text-xs text-red-400">{nameError}</p> : null}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm text-gym-muted" htmlFor="muscle-group">
              Grupo muscular
            </label>
            <select
              id="muscle-group"
              value={form.muscleGroup}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  muscleGroup: event.target.value as MuscleGroup,
                }))
              }
              className="w-full rounded-md border border-gym-border bg-gym-bg px-3 py-2 text-white outline-none focus:border-gym-accent"
            >
              {muscleGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-gym-muted" htmlFor="weight">
              Peso (kg)
            </label>
            <input
              id="weight"
              type="number"
              min={0}
              step="0.5"
              value={form.weight}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, weight: event.target.value }))
              }
              className="w-full rounded-md border border-gym-border bg-gym-bg px-3 py-2 text-white outline-none focus:border-gym-accent"
            />
            {weightError ? <p className="mt-1 text-xs text-red-400">{weightError}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm text-gym-muted" htmlFor="sets">
              Series
            </label>
            <input
              id="sets"
              type="number"
              min={1}
              value={form.sets}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, sets: event.target.value }))
              }
              className="w-full rounded-md border border-gym-border bg-gym-bg px-3 py-2 text-white outline-none focus:border-gym-accent"
            />
            {setsError ? <p className="mt-1 text-xs text-red-400">{setsError}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm text-gym-muted" htmlFor="reps">
              Repeticiones
            </label>
            <input
              id="reps"
              type="number"
              min={1}
              value={form.reps}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, reps: event.target.value }))
              }
              className="w-full rounded-md border border-gym-border bg-gym-bg px-3 py-2 text-white outline-none focus:border-gym-accent"
            />
            {repsError ? <p className="mt-1 text-xs text-red-400">{repsError}</p> : null}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-gym-muted" htmlFor="notes">
            Notas (opcional)
          </label>
          <textarea
            id="notes"
            value={form.notes}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, notes: event.target.value }))
            }
            className="min-h-20 w-full rounded-md border border-gym-border bg-gym-bg px-3 py-2 text-white outline-none focus:border-gym-accent"
            placeholder="RIR 2 en la última serie"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!isFormValid}
            className="rounded-md bg-gym-accent px-4 py-2 text-sm font-medium text-gym-bg disabled:opacity-50"
          >
            {editingExerciseId ? 'Guardar ejercicio' : 'Añadir ejercicio'}
          </button>
          {editingExerciseId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border border-gym-border px-4 py-2 text-sm font-medium text-white"
            >
              Cancelar edición
            </button>
          ) : null}
        </div>
      </form>

      <section className="mt-6 rounded-lg border border-gym-border bg-gym-surface p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-medium text-white">Ejercicios de la rutina</h2>
          <button
            type="button"
            onClick={() => setIsRoutineCollapsed((prev) => !prev)}
            className="rounded-md border border-gym-border px-3 py-1 text-xs text-white"
          >
            {isRoutineCollapsed ? 'Desplegar rutina' : 'Plegar rutina'}
          </button>
        </div>

        {routine.exercises.length === 0 ? (
          <p className="mt-3 rounded-lg border border-dashed border-gym-border p-4 text-sm text-gym-muted">
            Esta rutina aún no tiene ejercicios.
          </p>
        ) : isRoutineCollapsed ? (
          <p className="mt-3 text-sm text-gym-muted">
            Rutina plegada ({routine.exercises.length} ejercicios).
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {routine.exercises.map((exercise) => (
              <article
                key={exercise.id}
                className="rounded-lg border border-gym-border bg-gym-bg p-4"
              >
                <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-medium text-white">{exercise.name}</h2>
                  <p className="text-sm text-gym-muted">
                    {exercise.muscleGroup} · {exercise.sets} series · {exercise.reps} reps ·{' '}
                    {exercise.weight} kg
                  </p>
                  {exercise.notes ? (
                    <p className="mt-1 text-sm text-gym-muted">{exercise.notes}</p>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditExercise(exercise)}
                    className="rounded-md border border-gym-border px-3 py-1 text-xs text-white"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteExercise(exercise.id)}
                    className="rounded-md border border-red-500 px-3 py-1 text-xs text-red-400"
                  >
                    Eliminar
                  </button>
                </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
