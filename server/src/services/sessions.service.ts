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

  const session: Session = {
    id: buildSessionId(),
    routineId: input.routineId!.trim(),
    routineName: input.routineName!.trim(),
    date: input.date!,
    notes: typeof input.notes === 'string' ? input.notes.trim() : undefined,
  }

  sessionsStore.push(session)
  return { session }
}

export function removeSessionById(id: string): boolean {
  const index = sessionsStore.findIndex((session) => session.id === id)
  if (index === -1) {
    return false
  }

  sessionsStore.splice(index, 1)
  return true
}
