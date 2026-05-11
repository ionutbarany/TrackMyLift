import type { ProgressEntry } from '../types'

export interface ProgressRow {
  id: string
  user_id: string
  exercise_name: string
  weight: number
  reps: number
  entry_at: string
}

export function progressRowToEntry(row: ProgressRow): ProgressEntry {
  const date = new Date(row.entry_at).toISOString()

  return {
    id: row.id,
    exerciseName: row.exercise_name,
    weight: row.weight,
    reps: row.reps,
    date,
  }
}

export function newProgressEntryId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `progress_${Date.now()}_${Math.floor(Math.random() * 10000)}`
}

export function progressInputToInsertRow(
  id: string,
  userId: string,
  input: Omit<ProgressEntry, 'id'>,
): Record<string, unknown> {
  return {
    id,
    user_id: userId,
    exercise_name: input.exerciseName.trim(),
    weight: input.weight,
    reps: input.reps,
    entry_at: new Date(input.date).toISOString(),
  }
}

export function progressInputToUpdateRow(
  input: Omit<ProgressEntry, 'id'>,
): Record<string, unknown> {
  return {
    exercise_name: input.exerciseName.trim(),
    weight: input.weight,
    reps: input.reps,
    entry_at: new Date(input.date).toISOString(),
  }
}
