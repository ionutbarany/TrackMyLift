import { useMemo, useState, type FormEvent } from 'react'
import { useRoutines } from '../hooks/useRoutines'
import type { Routine } from '../types'

interface RoutineFormState {
  name: string
  description: string
  isPublic: boolean
}

interface ExerciseEditState {
  id: string
  name: string
  sets: string
  reps: string
}

const initialFormState: RoutineFormState = {
  name: '',
  description: '',
  isPublic: false,
}

function buildRoutineId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `routine_${Date.now()}_${Math.floor(Math.random() * 10000)}`
}

export default function MyRoutines() {
  const { routines, loading, errorMessage, addRoutine, updateRoutine, deleteRoutine } =
    useRoutines()
  const [form, setForm] = useState<RoutineFormState>(initialFormState)
  const [actionError, setActionError] = useState<string | null>(null)
  const [editingRoutineId, setEditingRoutineId] = useState<string | null>(null)
  const [expandedRoutineIds, setExpandedRoutineIds] = useState<string[]>([])
  const [exerciseEdits, setExerciseEdits] = useState<ExerciseEditState[]>([])

  const nameError = useMemo(() => {
    if (form.name.trim().length === 0) return 'El nombre es obligatorio'
    if (form.name.trim().length < 3) return 'Mínimo 3 caracteres'
    return ''
  }, [form.name])

  const isFormValid = nameError.length === 0

  function resetForm(): void {
    setForm(initialFormState)
    setEditingRoutineId(null)
    setExerciseEdits([])
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setActionError(null)
    if (!isFormValid) return

    const commonData = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      isPublic: form.isPublic,
    }

    try {
      if (editingRoutineId) {
        const existingRoutine = routines.find((routine) => routine.id === editingRoutineId)
        if (!existingRoutine) return

        const editsById = new Map(exerciseEdits.map((item) => [item.id, item]))
        const nextExercises = existingRoutine.exercises.map((exercise) => {
          const edit = editsById.get(exercise.id)
          if (!edit) return exercise

          const parsedSets = Number(edit.sets)
          const parsedReps = Number(edit.reps)

          return {
            ...exercise,
            sets: Number.isNaN(parsedSets) || parsedSets < 1 ? exercise.sets : parsedSets,
            reps: Number.isNaN(parsedReps) || parsedReps < 1 ? exercise.reps : parsedReps,
          }
        })

        await updateRoutine({
          ...existingRoutine,
          ...commonData,
          exercises: nextExercises,
        })
        resetForm()
        return
      }

      const newRoutine: Routine = {
        id: buildRoutineId(),
        createdAt: new Date().toISOString(),
        ...commonData,
        exercises: [],
      }
      await addRoutine(newRoutine)
      resetForm()
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'No se pudo guardar la rutina',
      )
    }
  }

  function toggleRoutineExpansion(routineId: string): void {
    setExpandedRoutineIds((prev) =>
      prev.includes(routineId)
        ? prev.filter((id) => id !== routineId)
        : [...prev, routineId],
    )
  }

  function handleEdit(routine: Routine): void {
    setEditingRoutineId(routine.id)
    setForm({
      name: routine.name,
      description: routine.description ?? '',
      isPublic: routine.isPublic,
    })
    setExerciseEdits(
      routine.exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        sets: String(exercise.sets),
        reps: String(exercise.reps),
      })),
    )
  }

  async function handleDelete(routineId: string): Promise<void> {
    setActionError(null)
    try {
      await deleteRoutine(routineId)
      setExpandedRoutineIds((prev) => prev.filter((id) => id !== routineId))
      if (editingRoutineId === routineId) {
        resetForm()
      }
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'No se pudo eliminar la rutina',
      )
    }
  }

  function handleExerciseFieldChange(
    exerciseId: string,
    field: 'sets' | 'reps',
    value: string,
  ): void {
    setExerciseEdits((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, [field]: value } : exercise,
      ),
    )
  }

  async function handleRemoveExercise(exerciseId: string): Promise<void> {
    if (!editingRoutineId) return
    const routine = routines.find((item) => item.id === editingRoutineId)
    if (!routine) return

    setActionError(null)
    try {
      await updateRoutine({
        ...routine,
        exercises: routine.exercises.filter((exercise) => exercise.id !== exerciseId),
      })
      setExerciseEdits((prev) => prev.filter((exercise) => exercise.id !== exerciseId))
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'No se pudo actualizar la rutina',
      )
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-white">Mis rutinas</h1>
      <p className="mt-2 text-gym-muted">Crea, edita y elimina tus rutinas personales.</p>

      {loading ? (
        <p className="mt-4 text-sm text-gym-muted">Cargando rutinas…</p>
      ) : null}
      {errorMessage ? (
        <p className="mt-2 text-sm text-red-400">No se pudieron cargar las rutinas: {errorMessage}</p>
      ) : null}
      {actionError ? (
        <p className="mt-2 text-sm text-red-400">{actionError}</p>
      ) : null}

      <form
        className="mt-6 space-y-4 rounded-lg border border-gym-border bg-gym-surface p-4"
        onSubmit={(event) => void handleSubmit(event)}
      >
        <div>
          <label className="mb-1 block text-sm text-gym-muted" htmlFor="routine-name">
            Nombre de rutina
          </label>
          <input
            id="routine-name"
            className="w-full rounded-md border border-gym-border bg-gym-bg px-3 py-2 text-white outline-none focus:border-gym-accent"
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, name: event.target.value }))
            }
            placeholder="Push Day"
          />
          {nameError ? <p className="mt-1 text-xs text-red-400">{nameError}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-sm text-gym-muted" htmlFor="routine-description">
            Descripción (opcional)
          </label>
          <textarea
            id="routine-description"
            className="min-h-20 w-full rounded-md border border-gym-border bg-gym-bg px-3 py-2 text-white outline-none focus:border-gym-accent"
            value={form.description}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, description: event.target.value }))
            }
            placeholder="Entrenamiento de empuje"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gym-muted">
          <input
            type="checkbox"
            checked={form.isPublic}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, isPublic: event.target.checked }))
            }
          />
          Hacer rutina pública
        </label>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!isFormValid}
            className="rounded-md bg-gym-accent px-4 py-2 text-sm font-medium text-gym-bg disabled:opacity-50"
          >
            {editingRoutineId ? 'Guardar cambios' : 'Crear rutina'}
          </button>
          {editingRoutineId ? (
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

      {editingRoutineId ? (
        <section className="mt-4 rounded-lg border border-gym-border bg-gym-surface p-4">
          <h2 className="text-lg font-medium text-white">Editar ejercicios de la rutina</h2>
          {exerciseEdits.length === 0 ? (
            <p className="mt-2 text-sm text-gym-muted">Esta rutina no tiene ejercicios.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {exerciseEdits.map((exercise) => (
                <li
                  key={exercise.id}
                  className="rounded-md border border-gym-border bg-gym-bg p-3"
                >
                  <p className="text-sm font-medium text-white">{exercise.name}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min={1}
                      value={exercise.sets}
                      onChange={(event) =>
                        handleExerciseFieldChange(exercise.id, 'sets', event.target.value)
                      }
                      className="rounded-md border border-gym-border bg-gym-surface px-3 py-2 text-white outline-none focus:border-gym-accent"
                      placeholder="Series"
                    />
                    <input
                      type="number"
                      min={1}
                      value={exercise.reps}
                      onChange={(event) =>
                        handleExerciseFieldChange(exercise.id, 'reps', event.target.value)
                      }
                      className="rounded-md border border-gym-border bg-gym-surface px-3 py-2 text-white outline-none focus:border-gym-accent"
                      placeholder="Reps"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleRemoveExercise(exercise.id)}
                    className="mt-2 rounded-md border border-red-500 px-3 py-1 text-xs text-red-400"
                  >
                    Eliminar ejercicio
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      <section className="mt-6 space-y-3">
        {routines.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gym-border p-4 text-sm text-gym-muted">
            Aún no tienes rutinas. Crea la primera usando el formulario.
          </p>
        ) : (
          routines.map((routine) => (
            <article
              key={routine.id}
              className="rounded-lg border border-gym-border bg-gym-surface p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-medium text-white">{routine.name}</h2>
                  {routine.description ? (
                    <p className="mt-1 text-sm text-gym-muted">{routine.description}</p>
                  ) : null}
                  <p className="mt-2 text-xs text-gym-muted">
                    {routine.isPublic ? 'Pública' : 'Privada'} · Creada{' '}
                    {new Date(routine.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleRoutineExpansion(routine.id)}
                    className="rounded-md border border-gym-border px-3 py-1 text-xs text-white"
                  >
                    {expandedRoutineIds.includes(routine.id)
                      ? 'Plegar rutina'
                      : 'Desplegar rutina'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEdit(routine)}
                    className="rounded-md border border-gym-border px-3 py-1 text-xs text-white"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(routine.id)}
                    className="rounded-md border border-red-500 px-3 py-1 text-xs text-red-400"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {expandedRoutineIds.includes(routine.id) ? (
                <div className="mt-4 rounded-md border border-gym-border bg-gym-bg p-3">
                  {routine.exercises.length === 0 ? (
                    <p className="text-sm text-gym-muted">
                      Esta rutina no tiene ejercicios todavía.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {routine.exercises.map((exercise) => (
                        <li
                          key={exercise.id}
                          className="rounded-md border border-gym-border bg-gym-surface px-3 py-2"
                        >
                          <p className="text-sm font-medium text-white">{exercise.name}</p>
                          <p className="text-xs text-gym-muted">
                            {exercise.muscleGroup} · {exercise.sets} series · {exercise.reps}{' '}
                            reps · {exercise.weight} kg
                          </p>
                          {exercise.notes ? (
                            <p className="text-xs text-gym-muted">{exercise.notes}</p>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : null}
            </article>
          ))
        )}
      </section>
    </div>
  )
}
