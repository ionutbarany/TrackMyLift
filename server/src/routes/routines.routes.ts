import { Router } from 'express'
import { getPopularRoutines } from '../controllers/routines.controller'

const routinesRouter = Router()

routinesRouter.get('/popular', getPopularRoutines)

export default routinesRouter
