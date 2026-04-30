import type { Request, Response } from 'express'
import {
  patchSessionById,
  replaceSessionById,
  createSession,
  listSessions,
  removeSessionById,
} from '../services/sessions.service'

function getParamAsString(param: string | string[] | undefined): string {
  if (Array.isArray(param)) {
    return param[0] ?? ''
  }
  return param ?? ''
}

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
  const id = getParamAsString(req.params.id)
  const removed = removeSessionById(id)

  if (!removed) {
    return res.status(404).json({
      data: null,
      message: 'Sesión no encontrada',
    })
  }

  return res.status(200).json({
    data: { id },
    message: 'Sesión eliminada correctamente',
  })
}

export function putSession(req: Request, res: Response) {
  const id = getParamAsString(req.params.id)
  const result = replaceSessionById(id, req.body ?? {})

  if (result.notFound) {
    return res.status(404).json({
      data: null,
      message: 'Sesión no encontrada',
    })
  }

  if (result.error) {
    return res.status(400).json({
      data: null,
      message: result.error,
    })
  }

  return res.status(200).json({
    data: result.session,
    message: 'Sesión actualizada correctamente',
  })
}

export function patchSession(req: Request, res: Response) {
  const id = getParamAsString(req.params.id)
  const result = patchSessionById(id, req.body ?? {})

  if (result.notFound) {
    return res.status(404).json({
      data: null,
      message: 'Sesión no encontrada',
    })
  }

  if (result.error) {
    return res.status(400).json({
      data: null,
      message: result.error,
    })
  }

  return res.status(200).json({
    data: result.session,
    message: 'Sesión actualizada parcialmente',
  })
}
