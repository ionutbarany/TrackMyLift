import type { Request, Response } from 'express'
import {
  createSession,
  listSessions,
  removeSessionById,
} from '../services/sessions.service'

export function getSessions(_req: Request, res: Response) {
  const data = listSessions()

  return res.status(200).json({
    data,
    message: 'Sesiones recuperadas correctamente',
  })
}

export function postSession(req: Request, res: Response) {
  const { session, error } = createSession(req.body ?? {})

  if (error) {
    return res.status(400).json({
      data: null,
      message: error,
    })
  }

  return res.status(201).json({
    data: session,
    message: 'Sesión registrada correctamente',
  })
}

export function deleteSession(req: Request, res: Response) {
  const removed = removeSessionById(req.params.id)

  if (!removed) {
    return res.status(404).json({
      data: null,
      message: 'Sesión no encontrada',
    })
  }

  return res.status(200).json({
    data: { id: req.params.id },
    message: 'Sesión eliminada correctamente',
  })
}
