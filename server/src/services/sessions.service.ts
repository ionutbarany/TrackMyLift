export interface Session {
  id: string
  routineId: string
  routineName: string
  date: string
  notes?: string
}

export interface CreateSessionInput {
  routineId?: unknown
  routineName?: unknown
  date?: unknown
  notes?: unknown
}

export type UpdateSessionInput = CreateSessionInput

export interface PatchSessionInput {
  routineId?: unknown
  routineName?: unknown
  date?: unknown
  notes?: unknown
}

const sessionsStore: Session[] = []

function isValidIsoDate(value: string): boolean {
  return !Number.isNaN(Date.parse(value))
}

function buildSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `session_${Date.now()}_${Math.floor(Math.random() * 10000)}`
}

function validateCreateSessionInput(input: CreateSessionInput): string | null {
  if (typeof input.routineId !== 'string' || input.routineId.trim().length === 0) {
    return 'routineId es obligatorio'
  }

  if (
    typeof input.routineName !== 'string' ||
    input.routineName.trim().length === 0
  ) {
    return 'routineName es obligatorio'
  }

  if (typeof input.date !== 'string' || !isValidIsoDate(input.date)) {
    return 'date debe ser una fecha ISO válida'
  }

  if (input.notes !== undefined && typeof input.notes !== 'string') {
    return 'notes debe ser texto'
  }

  return null
}

function normalizeNotes(notes: unknown): string | undefined {
  if (typeof notes !== 'string') return undefined
  const trimmedNotes = notes.trim()
  return trimmedNotes.length > 0 ? trimmedNotes : undefined
}

function validatePatchSessionInput(input: PatchSessionInput): string | null {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return 'Body inválido para actualización parcial'
  }

  const hasAnyField =
    input.routineId !== undefined ||
    input.routineName !== undefined ||
    input.date !== undefined ||
    input.notes !== undefined

  if (!hasAnyField) {
    return 'Debes enviar al menos un campo para actualizar'
  }

  if (input.routineId !== undefined) {
    if (typeof input.routineId !== 'string' || input.routineId.trim().length === 0) {
      return 'routineId debe ser texto no vacío'
    }
  }

  if (input.routineName !== undefined) {
    if (
      typeof input.routineName !== 'string' ||
      input.routineName.trim().length === 0
    ) {
      return 'routineName debe ser texto no vacío'
    }
  }

  if (input.date !== undefined) {
    if (typeof input.date !== 'string' || !isValidIsoDate(input.date)) {
      return 'date debe ser una fecha ISO válida'
    }
  }

  if (input.notes !== undefined && typeof input.notes !== 'string') {
    return 'notes debe ser texto'
  }

  return null
}

export function listSessions(): Session[] {
  return [...sessionsStore].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

export function createSession(
  input: CreateSessionInput,
): { session?: Session; error?: string } {
  const validationError = validateCreateSessionInput(input)
  if (validationError) {
    return { error: validationError }
  }

  const routineId = input.routineId as string
  const routineName = input.routineName as string
  const date = input.date as string

  const session: Session = {
    id: buildSessionId(),
    routineId: routineId.trim(),
    routineName: routineName.trim(),
    date,
    notes: normalizeNotes(input.notes),
  }

  sessionsStore.push(session)
  return { session }
}

export function replaceSessionById(
  id: string,
  input: UpdateSessionInput,
): { session?: Session; error?: string; notFound?: boolean } {
  const validationError = validateCreateSessionInput(input)
  if (validationError) {
    return { error: validationError }
  }

  const index = sessionsStore.findIndex((session) => session.id === id)
  if (index === -1) {
    return { notFound: true }
  }

  const routineId = input.routineId as string
  const routineName = input.routineName as string
  const date = input.date as string

  const updatedSession: Session = {
    id,
    routineId: routineId.trim(),
    routineName: routineName.trim(),
    date,
    notes: normalizeNotes(input.notes),
  }

  sessionsStore[index] = updatedSession
  return { session: updatedSession }
}

export function patchSessionById(
  id: string,
  input: PatchSessionInput,
): { session?: Session; error?: string; notFound?: boolean } {
  const validationError = validatePatchSessionInput(input)
  if (validationError) {
    return { error: validationError }
  }

  const index = sessionsStore.findIndex((session) => session.id === id)
  if (index === -1) {
    return { notFound: true }
  }

  const routineId = input.routineId as string | undefined
  const routineName = input.routineName as string | undefined
  const date = input.date as string | undefined

  const currentSession = sessionsStore[index]
  const patchedSession: Session = {
    ...currentSession,
    ...(routineId !== undefined ? { routineId: routineId.trim() } : {}),
    ...(routineName !== undefined ? { routineName: routineName.trim() } : {}),
    ...(date !== undefined ? { date } : {}),
    ...(input.notes !== undefined ? { notes: normalizeNotes(input.notes) } : {}),
  }

  sessionsStore[index] = patchedSession
  return { session: patchedSession }
}

export function removeSessionById(id: string): boolean {
  const index = sessionsStore.findIndex((session) => session.id === id)
  if (index === -1) {
    return false
  }

  sessionsStore.splice(index, 1)
  return true
}
