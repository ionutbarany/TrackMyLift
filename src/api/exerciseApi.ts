import type { MuscleGroup } from '../types'

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY
const EXERCISE_API_BASE = 'https://exercisedb.p.rapidapi.com'
const EXERCISE_LIMIT = 10

interface ExerciseDbItem {
  id: string
  name: string
  target: string
  bodyPart: string
}

export interface ExerciseCatalogItem {
  externalId: string
  name: string
  muscleGroup: MuscleGroup
  target: string
  bodyPart: string
}

function mapToMuscleGroup(value: string): MuscleGroup {
  const normalized = value.toLowerCase()
  if (normalized.includes('chest') || normalized.includes('pector')) return 'chest'
  if (normalized.includes('back') || normalized.includes('lats')) return 'back'
  if (normalized.includes('quad') || normalized.includes('hamstring')) return 'legs'
  if (normalized.includes('leg')) return 'legs'
  if (normalized.includes('shoulder') || normalized.includes('delt')) return 'shoulders'
  if (normalized.includes('tricep') || normalized.includes('bicep') || normalized.includes('forearm')) return 'arms'
  if (normalized.includes('ab') || normalized.includes('core') || normalized.includes('waist')) return 'core'
  if (normalized.includes('glute')) return 'glutes'
  if (normalized.includes('cardio')) return 'cardio'
  return 'core'
}

function mapExercise(item: ExerciseDbItem): ExerciseCatalogItem {
  const muscleGroupSource = `${item.target} ${item.bodyPart}`

  return {
    externalId: item.id,
    name: item.name
      .split(' ')
      .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
      .join(' '),
    muscleGroup: mapToMuscleGroup(muscleGroupSource),
    target: item.target,
    bodyPart: item.bodyPart,
  }
}

export function getRapidApiKey(): string | undefined {
  return RAPIDAPI_KEY
}

export async function searchExercises(query: string): Promise<ExerciseCatalogItem[]> {
  if (!RAPIDAPI_KEY) {
    throw new Error('Falta VITE_RAPIDAPI_KEY en el entorno')
  }

  const normalizedQuery = query.trim()
  if (!normalizedQuery) return []

  const response = await fetch(
    `${EXERCISE_API_BASE}/exercises/name/${encodeURIComponent(normalizedQuery)}?limit=${EXERCISE_LIMIT}`,
    {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
      },
    },
  )

  if (!response.ok) {
    throw new Error('No se pudo consultar ExerciseDB')
  }

  const payload = (await response.json()) as ExerciseDbItem[]
  if (!Array.isArray(payload)) return []

  return payload.map(mapExercise)
}
