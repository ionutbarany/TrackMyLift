import type { ApiResponse, ProgressEntry, Routine, Session } from '../types'

function resolveApiBase(): string {
  const envBase = import.meta.env.VITE_API_URL?.replace(/\/$/, '')
  if (envBase) return envBase

  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }

  return 'http://localhost:3001'
}

const API_BASE = resolveApiBase()

export interface CreateSessionInput {
  routineId: string
  routineName: string
  date: string
  notes?: string
}

export interface CreateProgressInput {
  exerciseName: string
  weight: number
  reps: number
  date: string
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  })

  let payload: ApiResponse<T> | undefined
  try {
    payload = (await response.json()) as ApiResponse<T>
  } catch {
    payload = undefined
  }

  if (!response.ok) {
    throw new Error(payload?.message ?? 'Error de red con la API')
  }

  return payload?.data as T
}

export function getApiBaseUrl(): string {
  return API_BASE
}

export function fetchSessions(): Promise<Session[]> {
  return request<Session[]>('/api/v1/sessions')
}

export function fetchPopularRoutines(): Promise<Routine[]> {
  return request<Routine[]>('/api/v1/routines/popular')
}

export function createSession(input: CreateSessionInput): Promise<Session> {
  return request<Session>('/api/v1/sessions', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function deleteSessionById(id: string): Promise<{ id: string }> {
  return request<{ id: string }>(`/api/v1/sessions/${id}`, {
    method: 'DELETE',
  })
}

export function fetchProgressByExercise(
  exerciseName: string,
): Promise<ProgressEntry[]> {
  const encodedExercise = encodeURIComponent(exerciseName.trim())
  return request<ProgressEntry[]>(`/api/v1/progress/${encodedExercise}`)
}

export function createProgressEntry(
  input: CreateProgressInput,
): Promise<ProgressEntry> {
  return request<ProgressEntry>('/api/v1/progress', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
