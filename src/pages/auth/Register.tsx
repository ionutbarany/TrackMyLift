import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const inputClass =
  'w-full rounded-md border border-gym-border bg-gym-bg px-3 py-2 text-white outline-none focus:border-gym-accent'

const MIN_PASSWORD = 6

export default function Register() {
  const { signUpWithEmail, supabaseReady, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setInfo(null)
    if (!email.trim()) {
      setError('El email es obligatorio')
      return
    }
    if (password.length < MIN_PASSWORD) {
      setError(`La contraseña debe tener al menos ${MIN_PASSWORD} caracteres`)
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    setSubmitting(true)
    const result = await signUpWithEmail(email, password)
    setSubmitting(false)
    if (result.error) {
      setError(result.error)
      return
    }
    if (result.needsEmailConfirmation) {
      setInfo('Revisa tu correo para confirmar la cuenta antes de iniciar sesión.')
      setPassword('')
      setConfirm('')
      return
    }
    setInfo('Cuenta creada. Ya puedes usar la app con tu sesión.')
  }

  if (!supabaseReady) {
    return (
      <div className="mx-auto max-w-md p-4">
        <h1 className="text-2xl font-semibold text-white">Crear cuenta</h1>
        <p className="mt-3 text-sm text-gym-muted">
          Supabase no está configurado. Añade las variables{' '}
          <code className="text-gym-accent">VITE_SUPABASE_*</code> en tu entorno.
        </p>
        <Link to="/" className="mt-6 inline-block text-sm text-gym-accent hover:underline">
          Volver al inicio
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md p-4">
      <h1 className="text-2xl font-semibold text-white">Crear cuenta</h1>
      <p className="mt-2 text-sm text-gym-muted">Registro con email y contraseña.</p>

      <form
        className="mt-6 space-y-4 rounded-lg border border-gym-border bg-gym-surface p-4"
        onSubmit={(e) => void handleSubmit(e)}
      >
        <div>
          <label className="mb-1 block text-sm text-gym-muted" htmlFor="reg-email">
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting || loading}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gym-muted" htmlFor="reg-password">
            Contraseña
          </label>
          <input
            id="reg-password"
            type="password"
            autoComplete="new-password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting || loading}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gym-muted" htmlFor="reg-confirm">
            Confirmar contraseña
          </label>
          <input
            id="reg-confirm"
            type="password"
            autoComplete="new-password"
            className={inputClass}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={submitting || loading}
          />
        </div>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {info ? <p className="text-sm text-green-400">{info}</p> : null}
        <button
          type="submit"
          disabled={submitting || loading}
          className="w-full rounded-md bg-gym-accent px-4 py-2 text-sm font-medium text-gym-bg disabled:opacity-50"
        >
          {submitting ? 'Creando…' : 'Registrarse'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gym-muted">
        ¿Ya tienes cuenta?{' '}
        <Link to="/auth/login" className="text-gym-accent hover:underline">
          Iniciar sesión
        </Link>
      </p>
      <p className="mt-6 text-center">
        <Link to="/" className="text-sm text-gym-muted hover:text-white">
          Volver al inicio
        </Link>
      </p>
    </div>
  )
}
