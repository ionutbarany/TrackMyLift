import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const inputClass =
  'w-full rounded-md border border-gym-border bg-gym-bg px-3 py-2 text-white outline-none focus:border-gym-accent'

const MIN_PASSWORD = 6

export default function UpdatePassword() {
  const navigate = useNavigate()
  const { updatePassword, supabaseReady, loading, user } = useAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    if (password.length < MIN_PASSWORD) {
      setError(`La contraseña debe tener al menos ${MIN_PASSWORD} caracteres`)
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    setSubmitting(true)
    const result = await updatePassword(password)
    setSubmitting(false)
    if (result.error) {
      setError(result.error)
      return
    }
    navigate('/', { replace: true })
  }

  if (!supabaseReady) {
    return (
      <div className="mx-auto max-w-md p-4">
        <h1 className="text-2xl font-semibold text-white">Nueva contraseña</h1>
        <p className="mt-3 text-sm text-gym-muted">Supabase no está configurado.</p>
        <Link to="/" className="mt-6 inline-block text-sm text-gym-accent hover:underline">
          Volver al inicio
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-md p-4">
        <h1 className="text-2xl font-semibold text-white">Nueva contraseña</h1>
        <p className="mt-3 text-sm text-gym-muted">Comprobando enlace…</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md p-4">
        <h1 className="text-2xl font-semibold text-white">Nueva contraseña</h1>
        <p className="mt-3 text-sm text-gym-muted">
          Enlace inválido o sesión caducada. Solicita un nuevo correo de recuperación.
        </p>
        <Link
          to="/auth/forgot"
          className="mt-6 inline-block text-sm text-gym-accent hover:underline"
        >
          Solicitar enlace
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md p-4">
      <h1 className="text-2xl font-semibold text-white">Nueva contraseña</h1>
      <p className="mt-2 text-sm text-gym-muted">Elige una contraseña nueva para tu cuenta.</p>

      <form
        className="mt-6 space-y-4 rounded-lg border border-gym-border bg-gym-surface p-4"
        onSubmit={(e) => void handleSubmit(e)}
      >
        <div>
          <label className="mb-1 block text-sm text-gym-muted" htmlFor="new-password">
            Nueva contraseña
          </label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting || loading}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gym-muted" htmlFor="new-password-2">
            Confirmar
          </label>
          <input
            id="new-password-2"
            type="password"
            autoComplete="new-password"
            className={inputClass}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={submitting || loading}
          />
        </div>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button
          type="submit"
          disabled={submitting || loading}
          className="w-full rounded-md bg-gym-accent px-4 py-2 text-sm font-medium text-gym-bg disabled:opacity-50"
        >
          {submitting ? 'Guardando…' : 'Guardar contraseña'}
        </button>
      </form>
    </div>
  )
}
