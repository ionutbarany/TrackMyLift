import { Router } from 'express'
import {
  deleteSession,
  getSessions,
  postSession,
} from '../controllers/sessions.controller'

const sessionsRouter = Router()

sessionsRouter.get('/', getSessions)
sessionsRouter.post('/', postSession)
sessionsRouter.delete('/:id', deleteSession)

export default sessionsRouter
