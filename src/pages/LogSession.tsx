import { useState } from 'react'
import { useSessionLog } from '../hooks/useSessionLog'

export default function LogSession() {
  const { logSession, state, errorMessage } = useSessionLog()
  const [routineId, setRoutineId] = useState('')
  const [routineName, setRoutineName] = useState('')
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSuccessMessage('')

    await logSession({
      routineId: routineId.trim(),
      routineName: routineName.trim(),
      date: new Date(date).toISOString(),
      notes: notes.trim() || undefined,
    })

    setSuccessMessage('Sesion registrada correctamente')
    setNotes('')
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-white">Registrar sesión</h1>
      <p className="mt-2 text-gym-muted">Guarda el entrenamiento de hoy.</p>

      <form
        className="mt-6 space-y-4 rounded-lg border border-gym-border bg-gym-surface p-4"
        onSubmit={(event) => {
          void handleSubmit(event)
        }}
      >
        <div>
          <label className="mb-1 block text-sm text-gym-muted" htmlFor="routineId">
            ID de rutina
          </label>
          <input
            id="routineId"
            value={routineId}
            onChange={(event) => setRoutineId(event.target.value)}
            className="w-full rounded-md border border-gym-border bg-gym-bg px-3 py-2 text-white outline-none focus:border-gym-accent"
            placeholder="push-day"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gym-muted" htmlFor="routineName">
            Nombre de rutina
          </label>
          <input
            id="routineName"
            value={routineName}
            onChange={(event) => setRoutineName(event.target.value)}
            className="w-full rounded-md border border-gym-border bg-gym-bg px-3 py-2 text-white outline-none focus:border-gym-accent"
            placeholder="Push Day"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gym-muted" htmlFor="date">
            Fecha y hora
          </label>
          <input
            id="date"
            type="datetime-local"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="w-full rounded-md border border-gym-border bg-gym-bg px-3 py-2 text-white outline-none focus:border-gym-accent"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gym-muted" htmlFor="notes">
            Notas (opcional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="min-h-20 w-full rounded-md border border-gym-border bg-gym-bg px-3 py-2 text-white outline-none focus:border-gym-accent"
            placeholder="Hoy me senti con energia."
          />
        </div>

        <button
          type="submit"
          disabled={state === 'loading'}
          className="rounded-md bg-gym-accent px-4 py-2 font-medium text-gym-bg disabled:opacity-60"
        >
          {state === 'loading' ? 'Guardando...' : 'Registrar sesion'}
        </button>

        {errorMessage ? (
          <p className="text-sm text-red-400">Error: {errorMessage}</p>
        ) : null}
        {successMessage && state === 'success' ? (
          <p className="text-sm text-emerald-400">{successMessage}</p>
        ) : null}
      </form>
    </div>
  )
}
