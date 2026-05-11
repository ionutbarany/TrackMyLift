import type { Exercise, Routine } from '../types'

export interface RoutineRow {
  id: string
  user_id: string
  name: string
  description: string | null
  exercises: unknown
  is_public: boolean
  created_at: string
}

function isExerciseArray(value: unknown): value is Exercise[] {
  if (!Array.isArray(value)) return false
  return value.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      'id' in item &&
      typeof (item as Exercise).id === 'string' &&
      'name' in item &&
      typeof (item as Exercise).name === 'string',
  )
}

export function routineRowToRoutine(row: RoutineRow): Routine {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    exercises: isExerciseArray(row.exercises) ? row.exercises : [],
    isPublic: row.is_public,
    createdAt: row.created_at,
  }
}

export function routineToInsertRow(routine: Routine, userId: string): Record<string, unknown> {
  return {
    id: routine.id,
    user_id: userId,
    name: routine.name,
    description: routine.description ?? null,
    exercises: routine.exercises,
    is_public: routine.isPublic,
    created_at: routine.createdAt,
  }
}
