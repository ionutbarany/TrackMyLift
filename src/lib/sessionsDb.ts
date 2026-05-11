import type { Session } from '../types'

export interface SessionRow {
  id: string
  user_id: string
  routine_id: string
  routine_name: string
  workout_at: string
  notes: string | null
}

export function sessionRowToSession(row: SessionRow): Session {
  const date = new Date(row.workout_at).toISOString()

  return {
    id: row.id,
    routineId: row.routine_id,
    routineName: row.routine_name,
    date,
    notes: row.notes ?? undefined,
  }
}

export function newSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `session_${Date.now()}_${Math.floor(Math.random() * 10000)}`
}

export function sessionInputToInsertRow(
  id: string,
  userId: string,
  input: Omit<Session, 'id'>,
): Record<string, unknown> {
  return {
    id,
    user_id: userId,
    routine_id: input.routineId,
    routine_name: input.routineName,
    workout_at: new Date(input.date).toISOString(),
    notes: input.notes ?? null,
  }
}

export function sessionInputToUpdateRow(input: Omit<Session, 'id'>): Record<string, unknown> {
  return {
    routine_id: input.routineId,
    routine_name: input.routineName,
    workout_at: new Date(input.date).toISOString(),
    notes: input.notes ?? null,
  }
}
