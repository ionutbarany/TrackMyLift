import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useProgress } from '../hooks/useProgress'
import type { ProgressEntry } from '../types'

export default function Progress() {
  const { loading: authLoading } = useAuth()
  const {
    entries,
    addEntry,
    getAllEntries,
    getByExercise,
    updateEntry,
    deleteEntry,
    state,
    errorMessage,
  } = useProgress()
  const [searchExercise, setSearchExercise] = useState('')
  const [exerciseName, setExerciseName] = useState('')
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [date, setDate] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null)
  const [editingExerciseName, setEditingExerciseName] = useState('')
  const [editingWeight, setEditingWeight] = useState('')
  const [editingReps, setEditingReps] = useState('')
  const [editingDate, setEditingDate] = useState('')

  useEffect(() => {
    if (authLoading) {
      return
    }
    void getAllEntries()
  }, [authLoading, getAllEntries])

  const emptyStateMessage = useMemo(() => {
    if (state === 'loading') return 'Cargando historial...'
    if (entries.length > 0) return ''
    return 'No hay registros para mostrar todavia.'
  }, [entries.length, state])

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSuccessMessage('')
    await getByExercise(searchExercise.trim())
  }

  async function handleAddEntry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSuccessMessage('')

    await addEntry({
      exerciseName: exerciseName.trim(),
      weight: Number(weight),
      reps: Number(reps),
      date: new Date(date).toISOString(),
    })

    setSuccessMessage('Progreso guardado correctamente')
    setExerciseName('')
    setWeight('')
    setReps('')
    setDate('')
    await getAllEntries()
  }

  function toDatetimeLocalValue(isoString: string): string {
    const dateValue = new Date(isoString)
    const timezoneOffset = dateValue.getTimezoneOffset() * 60000
    return new Date(dateValue.getTime() - timezoneOffset).toISOString().slice(0, 16)
  }

  function startEditing(entry: ProgressEntry): void {
    setEditingEntryId(entry.id)
    setEditingExerciseName(entry.exerciseName)
    setEditingWeight(String(entry.weight))
    setEditingReps(String(entry.reps))
    setEditingDate(toDatetimeLocalValue(entry.date))
    setSuccessMessage('')
  }

  function cancelEditing(): void {
    setEditingEntryId(null)
    setEditingExerciseName('')
    setEditingWeight('')
    setEditingReps('')
    setEditingDate('')
  }

  async function handleSaveEdit(entryId: string): Promise<void> {
    await updateEntry(entryId, {
      exerciseName: editingExerciseName.trim(),
      weight: Number(editingWeight),
      reps: Number(editingReps),
      date: new Date(editingDate).toISOString(),
    })
    setSuccessMessage('Registro actualizado correctamente')
    cancelEditing()
  }

  async function handleDeleteEntry(entryId: string): Promise<void> {
    await deleteEntry(entryId)
    setSuccessMessage('Registro eliminado correctamente')
    if (editingEntryId === entryId) {
      cancelEditing()
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-white">Progreso</h1>
      <p className="mt-2 text-gym-muted">
        Consulta y registra la evolucion de pesos por ejercicio.
      </p>

      <form
        className="mt-6 flex gap-2 rounded-lg border border-gym-border bg-gym-surface p-4"
        onSubmit={(event) => {
          void handleSearch(event)
        }}
      >
        <input
          value={searchExercise}
          onChange={(event) => setSearchExercise(event.target.value)}
          className="w-full rounded-md border border-gym-border bg-gym-bg px-3 py-2 text-white outline-none focus:border-gym-accent"
          placeholder="Buscar ejercicio (ej. Bench Press)"
          required
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="rounded-md bg-gym-accent px-4 py-2 font-medium text-gym-bg disabled:opacity-60"
        >
          Buscar
        </button>
      </form>

      <form
        className="mt-4 space-y-3 rounded-lg border border-gym-border bg-gym-surface p-4"
        onSubmit={(event) => {
          void handleAddEntry(event)
        }}
      >
        <h2 className="text-lg font-medium text-white">Nuevo registro</h2>
        <input
          value={exerciseName}
          onChange={(event) => setExerciseName(event.target.value)}
          className="w-full rounded-md border border-gym-border bg-gym-bg px-3 py-2 text-white outline-none focus:border-gym-accent"
          placeholder="Exercise name"
          required
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={0}
            step="0.5"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            className="rounded-md border border-gym-border bg-gym-bg px-3 py-2 text-white outline-none focus:border-gym-accent"
            placeholder="Weight (kg)"
            required
          />
          <input
            type="number"
            min={1}
            value={reps}
            onChange={(event) => setReps(event.target.value)}
            className="rounded-md border border-gym-border bg-gym-bg px-3 py-2 text-white outline-none focus:border-gym-accent"
            placeholder="Reps"
            required
          />
        </div>
        <input
          type="datetime-local"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="w-full rounded-md border border-gym-border bg-gym-bg px-3 py-2 text-white outline-none focus:border-gym-accent"
          required
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="rounded-md bg-gym-accent px-4 py-2 font-medium text-gym-bg disabled:opacity-60"
        >
          {state === 'loading' ? 'Guardando...' : 'Guardar registro'}
        </button>
      </form>

      {errorMessage ? <p className="mt-4 text-sm text-red-400">{errorMessage}</p> : null}
      {successMessage && state === 'success' ? (
        <p className="mt-2 text-sm text-emerald-400">{successMessage}</p>
      ) : null}

      <section className="mt-6 rounded-lg border border-gym-border bg-gym-surface p-4">
        <h2 className="text-lg font-medium text-white">Historial</h2>
        {emptyStateMessage ? (
          <p className="mt-2 text-sm text-gym-muted">{emptyStateMessage}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="rounded-md border border-gym-border bg-gym-bg px-3 py-2 text-sm"
              >
                {editingEntryId === entry.id ? (
                  <div className="space-y-2">
                    <input
                      value={editingExerciseName}
                      onChange={(event) => setEditingExerciseName(event.target.value)}
                      className="w-full rounded-md border border-gym-border bg-gym-surface px-3 py-2 text-white outline-none focus:border-gym-accent"
                      placeholder="Exercise name"
                      required
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        min={0}
                        step="0.5"
                        value={editingWeight}
                        onChange={(event) => setEditingWeight(event.target.value)}
                        className="rounded-md border border-gym-border bg-gym-surface px-3 py-2 text-white outline-none focus:border-gym-accent"
                        placeholder="Weight (kg)"
                        required
                      />
                      <input
                        type="number"
                        min={1}
                        value={editingReps}
                        onChange={(event) => setEditingReps(event.target.value)}
                        className="rounded-md border border-gym-border bg-gym-surface px-3 py-2 text-white outline-none focus:border-gym-accent"
                        placeholder="Reps"
                        required
                      />
                    </div>
                    <input
                      type="datetime-local"
                      value={editingDate}
                      onChange={(event) => setEditingDate(event.target.value)}
                      className="w-full rounded-md border border-gym-border bg-gym-surface px-3 py-2 text-white outline-none focus:border-gym-accent"
                      required
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={state === 'loading'}
                        onClick={() => {
                          void handleSaveEdit(entry.id)
                        }}
                        className="rounded-md bg-gym-accent px-3 py-1 text-xs font-medium text-gym-bg disabled:opacity-60"
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        disabled={state === 'loading'}
                        onClick={cancelEditing}
                        className="rounded-md border border-gym-border px-3 py-1 text-xs text-white disabled:opacity-60"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="font-medium text-white">{entry.exerciseName}</p>
                    <p className="text-gym-muted">
                      {entry.weight} kg x {entry.reps} reps
                    </p>
                    <p className="text-xs text-gym-muted">
                      {new Date(entry.date).toLocaleString()}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={state === 'loading'}
                        onClick={() => startEditing(entry)}
                        className="rounded-md border border-gym-border px-3 py-1 text-xs text-white disabled:opacity-60"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        disabled={state === 'loading'}
                        onClick={() => {
                          void handleDeleteEntry(entry.id)
                        }}
                        className="rounded-md border border-red-500/40 px-3 py-1 text-xs text-red-300 disabled:opacity-60"
                      >
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
