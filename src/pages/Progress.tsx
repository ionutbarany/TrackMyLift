import { useMemo, useState } from 'react'
import { useProgress } from '../hooks/useProgress'

export default function Progress() {
  const { entries, addEntry, getByExercise, state, errorMessage } = useProgress()
  const [searchExercise, setSearchExercise] = useState('')
  const [exerciseName, setExerciseName] = useState('')
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [date, setDate] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

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
    await getByExercise(exerciseName.trim())
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
                <p className="font-medium text-white">{entry.exerciseName}</p>
                <p className="text-gym-muted">
                  {entry.weight} kg x {entry.reps} reps
                </p>
                <p className="text-xs text-gym-muted">
                  {new Date(entry.date).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
