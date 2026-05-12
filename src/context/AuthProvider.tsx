import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { AuthContext, type AuthContextValue } from './authContext'
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabaseClient'

interface AuthProviderProps {
  children: ReactNode
}

function mapAuthError(message: string | undefined): string {
  if (!message) return 'Error de autenticación'
  if (message.includes('Invalid login credentials')) {
    return 'Email o contraseña incorrectos'
  }
  if (message.includes('User already registered')) {
    return 'Ya existe una cuenta con este email'
  }
  if (message.includes('Password should be at least')) {
    return 'La contraseña no cumple los requisitos mínimos'
  }
  return message
}

export function AuthProvider({ children }: AuthProviderProps) {
  const supabaseReady = isSupabaseConfigured()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(() => supabaseReady)

  useEffect(() => {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabaseReady])

  const signInWithEmail = useCallback(
    async (email: string, password: string): Promise<{ error: string | null }> => {
      const supabase = getSupabaseClient()
      if (!supabase) {
        return {
          error:
            'Supabase no está configurado. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.',
        }
      }
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (error) return { error: mapAuthError(error.message) }
      return { error: null }
    },
    [],
  )

  const signUpWithEmail = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<{ error: string | null; needsEmailConfirmation: boolean }> => {
      const supabase = getSupabaseClient()
      if (!supabase) {
        return {
          error:
            'Supabase no está configurado. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.',
          needsEmailConfirmation: false,
        }
      }
      const redirectTo =
        typeof window !== 'undefined' ? `${window.location.origin}/` : undefined
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: redirectTo ? { emailRedirectTo: redirectTo } : undefined,
      })
      if (error) {
        return { error: mapAuthError(error.message), needsEmailConfirmation: false }
      }
      // Sin sesión suele indicar que falta confirmar el email (según ajustes del proyecto).
      const needsEmailConfirmation = Boolean(data.user && !data.session)
      return { error: null, needsEmailConfirmation }
    },
    [],
  )

  const signOut = useCallback(async () => {
    const supabase = getSupabaseClient()
    if (!supabase) return
    await supabase.auth.signOut()
  }, [])

  const requestPasswordReset = useCallback(
    async (email: string): Promise<{ error: string | null }> => {
      const supabase = getSupabaseClient()
      if (!supabase) {
        return {
          error:
            'Supabase no está configurado. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.',
        }
      }
      const redirectTo =
        typeof window !== 'undefined'
          ? `${window.location.origin}/auth/update-password`
          : undefined
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      })
      if (error) return { error: mapAuthError(error.message) }
      return { error: null }
    },
    [],
  )

  const updatePassword = useCallback(
    async (newPassword: string): Promise<{ error: string | null }> => {
      const supabase = getSupabaseClient()
      if (!supabase) {
        return {
          error:
            'Supabase no está configurado. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.',
        }
      }
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) return { error: mapAuthError(error.message) }
      return { error: null }
    },
    [],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      loading,
      supabaseReady,
      signInWithEmail,
      signUpWithEmail,
      signOut,
      requestPasswordReset,
      updatePassword,
    }),
    [
      loading,
      requestPasswordReset,
      session,
      signInWithEmail,
      signOut,
      signUpWithEmail,
      supabaseReady,
      updatePassword,
      user,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
