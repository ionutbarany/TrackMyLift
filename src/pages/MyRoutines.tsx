import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRoutines } from '../hooks/useRoutines'
import type { Routine } from '../types'

interface RoutineFormState {
  name: string
  description: string
  isPublic: boolean
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
  const { routines, addRoutine, updateRoutine, deleteRoutine } = useRoutines()
  const [form, setForm] = useState<RoutineFormState>(initialFormState)
  const [editingRoutineId, setEditingRoutineId] = useState<string | null>(null)

  const nameError = useMemo(() => {
    if (form.name.trim().length === 0) return 'El nombre es obligatorio'
    if (form.name.trim().length < 3) return 'Mínimo 3 caracteres'
    return ''
  }, [form.name])

  const isFormValid = nameError.length === 0

  function resetForm(): void {
    setForm(initialFormState)
    setEditingRoutineId(null)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    if (!isFormValid) return

    const commonData = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      isPublic: form.isPublic,
      exercises: [],
    }

    if (editingRoutineId) {
      const existingRoutine = routines.find((routine) => routine.id === editingRoutineId)
      if (!existingRoutine) return

      updateRoutine({
        ...existingRoutine,
        ...commonData,
      })
      resetForm()
      return
    }

    const newRoutine: Routine = {
      id: buildRoutineId(),
      createdAt: new Date().toISOString(),
      ...commonData,
    }
    addRoutine(newRoutine)
    resetForm()
  }

  function handleEdit(routine: Routine): void {
    setEditingRoutineId(routine.id)
    setForm({
      name: routine.name,
      description: routine.description ?? '',
      isPublic: routine.isPublic,
    })
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-white">Mis rutinas</h1>
      <p className="mt-2 text-gym-muted">Crea, edita y elimina tus rutinas personales.</p>

      <form
        className="mt-6 space-y-4 rounded-lg border border-gym-border bg-gym-surface p-4"
        onSubmit={handleSubmit}
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
                  <Link
                    to={`/routines/${routine.id}`}
                    className="rounded-md border border-gym-border px-3 py-1 text-xs text-white"
                  >
                    Ver detalle
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleEdit(routine)}
                    className="rounded-md border border-gym-border px-3 py-1 text-xs text-white"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteRoutine(routine.id)}
                    className="rounded-md border border-red-500 px-3 py-1 text-xs text-red-400"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  )
}
