import type { MuscleGroup } from '../types'
import { getApiBaseUrl } from './client'

const API_BASE = getApiBaseUrl()

export interface ExerciseCatalogItem {
  externalId: string
  name: string
  muscleGroup: MuscleGroup
  target: string
  bodyPart: string
}

interface ApiResponse<T> {
  data: T
  message?: string
}

export async function searchExercises(query: string): Promise<ExerciseCatalogItem[]> {
  const normalizedQuery = query.trim()
  if (!normalizedQuery) return []

  const response = await fetch(
    `${API_BASE}/api/v1/exercises/search?q=${encodeURIComponent(normalizedQuery)}`,
  )

  if (!response.ok) {
    let payload: ApiResponse<ExerciseCatalogItem[]> | undefined
    try {
      payload = (await response.json()) as ApiResponse<ExerciseCatalogItem[]>
    } catch {
      payload = undefined
    }
    throw new Error(payload?.message ?? 'No se pudo consultar ExerciseDB')
  }

  const payload = (await response.json()) as ApiResponse<ExerciseCatalogItem[]>
  return Array.isArray(payload.data) ? payload.data : []
}
