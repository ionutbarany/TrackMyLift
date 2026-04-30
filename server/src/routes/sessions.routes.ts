import { Router } from 'express'
import {
  deleteSession,
  getSessions,
  patchSession,
  postSession,
  putSession,
} from '../controllers/sessions.controller.js'

const sessionsRouter = Router()

sessionsRouter.get('/', getSessions)
sessionsRouter.post('/', postSession)
sessionsRouter.put('/:id', putSession)
sessionsRouter.patch('/:id', patchSession)
sessionsRouter.delete('/:id', deleteSession)

export default sessionsRouter
