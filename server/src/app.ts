import cors from 'cors'
import express, { type NextFunction, type Request, type Response } from 'express'
import exercisesRouter from './routes/exercises.routes.js'
import progressRouter from './routes/progress.routes.js'
import routinesRouter from './routes/routines.routes.js'
import sessionsRouter from './routes/sessions.routes.js'

const app = express()

// En Vercel, el rewrite `/api/(.*)` → `/api` puede dejar `req.url` como `/v1/...`
// sin el prefijo `/api`; Express monta las rutas bajo `/api/v1/...`.
if (process.env.VERCEL) {
  app.use((req, _res, next) => {
    const raw = req.url ?? ''
    const qIndex = raw.indexOf('?')
    const pathOnly = qIndex >= 0 ? raw.slice(0, qIndex) : raw
    const query = qIndex >= 0 ? raw.slice(qIndex) : ''
    if (!pathOnly.startsWith('/api') && pathOnly.startsWith('/v1')) {
      req.url = `/api${pathOnly}${query}`
    }
    next()
  })
}

app.use(
  cors({
    origin: true,
  }),
)
app.use(express.json())

app.get('/health', (_req, res) => {
  return res.status(200).json({
    data: { status: 'ok' },
    message: 'Servidor operativo',
  })
})

app.use('/api/v1/sessions', sessionsRouter)
app.use('/api/v1/progress', progressRouter)
app.use('/api/v1/routines', routinesRouter)
app.use('/api/v1/exercises', exercisesRouter)

app.use((_req, res) => {
  return res.status(404).json({
    data: null,
    message: 'Endpoint no encontrado',
  })
})

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  void _next
  console.error(err)

  return res.status(500).json({
    data: null,
    message: 'Error interno del servidor',
  })
})

export default app
