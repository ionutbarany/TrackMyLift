import cors from 'cors'
import express, { type NextFunction, type Request, type Response } from 'express'
import progressRouter from './routes/progress.routes'
import sessionsRouter from './routes/sessions.routes'

const app = express()

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
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

app.use((_req, res) => {
  return res.status(404).json({
    data: null,
    message: 'Endpoint no encontrado',
  })
})

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err)

  return res.status(500).json({
    data: null,
    message: 'Error interno del servidor',
  })
})

export default app
