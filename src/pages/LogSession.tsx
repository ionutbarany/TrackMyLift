import { useEffect, useState } from 'react'
import { useSessionLog } from '../hooks/useSessionLog'
import type { Session } from '../types'

export default function LogSession() {
  const { sessions, logSession, getAllSessions, updateSession, deleteSession, state, errorMessage } =
    useSessionLog()
  const [routineName, setRoutineName] = useState('')
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editingRoutineName, setEditingRoutineName] = useState('')
  const [editingDate, setEditingDate] = useState('')
  const [editingNotes, setEditingNotes] = useState('')

  useEffect(() => {
    void getAllSessions()
  }, [getAllSessions])

  function buildRoutineId(name: string): string {
    const normalized = name.trim().toLowerCase()
    const slug = normalized
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    return slug || `routine-${Date.now()}`
  }

  function toDatetimeLocalValue(isoString: string): string {
    const dateValue = new Date(isoString)
    const timezoneOffset = dateValue.getTimezoneOffset() * 60000
    return new Date(dateValue.getTime() - timezoneOffset).toISOString().slice(0, 16)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSuccessMessage('')
    const trimmedRoutineName = routineName.trim()

    await logSession({
      routineId: buildRoutineId(trimmedRoutineName),
      routineName: trimmedRoutineName,
      date: new Date(date).toISOString(),
      notes: notes.trim() || undefined,
    })

    setSuccessMessage('Sesion registrada correctamente')
    setRoutineName('')
    setDate('')
    setNotes('')
    await getAllSessions()
  }

  function startEditing(session: Session): void {
    setEditingSessionId(session.id)
    setEditingRoutineName(session.routineName)
    setEditingDate(toDatetimeLocalValue(session.date))
    setEditingNotes(session.notes ?? '')
    setSuccessMessage('')
  }

  function cancelEditing(): void {
    setEditingSessionId(null)
    setEditingRoutineName('')
    setEditingDate('')
    setEditingNotes('')
  }

  async function handleSaveEdit(sessionId: string): Promise<void> {
    const trimmedRoutineName = editingRoutineName.trim()
    await updateSession(sessionId, {
      routineId: buildRoutineId(trimmedRoutineName),
      routineName: trimmedRoutineName,
      date: new Date(editingDate).toISOString(),
      notes: editingNotes.trim() || undefined,
    })
    setSuccessMessage('Sesion actualizada correctamente')
    cancelEditing()
  }

  async function handleDeleteSession(sessionId: string): Promise<void> {
    await deleteSession(sessionId)
    setSuccessMessage('Sesion eliminada correctamente')
    if (editingSessionId === sessionId) {
      cancelEditing()
    }
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

      <section className="mt-6 rounded-lg border border-gym-border bg-gym-surface p-4">
        <h2 className="text-lg font-medium text-white">Historial de sesiones</h2>
        {sessions.length === 0 ? (
          <p className="mt-2 text-sm text-gym-muted">No hay sesiones registradas todavia.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {sessions.map((session) => (
              <li
                key={session.id}
                className="rounded-md border border-gym-border bg-gym-bg px-3 py-2 text-sm"
              >
                {editingSessionId === session.id ? (
                  <div className="space-y-2">
                    <input
                      value={editingRoutineName}
                      onChange={(event) => setEditingRoutineName(event.target.value)}
                      className="w-full rounded-md border border-gym-border bg-gym-surface px-3 py-2 text-white outline-none focus:border-gym-accent"
                      placeholder="Nombre de rutina"
                      required
                    />
                    <input
                      type="datetime-local"
                      value={editingDate}
                      onChange={(event) => setEditingDate(event.target.value)}
                      className="w-full rounded-md border border-gym-border bg-gym-surface px-3 py-2 text-white outline-none focus:border-gym-accent"
                      required
                    />
                    <textarea
                      value={editingNotes}
                      onChange={(event) => setEditingNotes(event.target.value)}
                      className="min-h-20 w-full rounded-md border border-gym-border bg-gym-surface px-3 py-2 text-white outline-none focus:border-gym-accent"
                      placeholder="Notas (opcional)"
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={state === 'loading'}
                        onClick={() => {
                          void handleSaveEdit(session.id)
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
                    <p className="font-medium text-white">{session.routineName}</p>
                    <p className="text-xs text-gym-muted">{new Date(session.date).toLocaleString()}</p>
                    {session.notes ? <p className="text-gym-muted">{session.notes}</p> : null}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={state === 'loading'}
                        onClick={() => startEditing(session)}
                        className="rounded-md border border-gym-border px-3 py-1 text-xs text-white disabled:opacity-60"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        disabled={state === 'loading'}
                        onClick={() => {
                          void handleDeleteSession(session.id)
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
