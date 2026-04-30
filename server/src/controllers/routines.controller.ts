import type { Request, Response } from 'express'
import { listPopularRoutines } from '../services/routines.service'

export function getPopularRoutines(_req: Request, res: Response) {
  const data = listPopularRoutines()

  return res.status(200).json({
    data,
    message: 'Rutinas populares recuperadas correctamente',
  })
}
