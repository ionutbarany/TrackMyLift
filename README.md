# FitTrack (TrackMyLift)

Aplicación web para organizar rutinas de gimnasio, registrar sesiones y seguir la evolución de los pesos. Stack **full stack**: **React 19 + TypeScript + Vite** en el cliente, **Express 5 + TypeScript** en la API, datos de sesiones y progreso en **JSON local** (`server/data/`), autenticación opcional con **Supabase**, y catálogo de ejercicios vía **ExerciseDB (RapidAPI)** en el servidor.

## Requisitos

- Node.js 20 o superior recomendado
- npm

## Desarrollo local

Hace falta **dos procesos**: el frontend (Vite) y la API (Express).

1. Crea un `.env` en la **raíz del repositorio** (véase la sección de variables). La API carga ese fichero aunque arranques `tsx` desde otra carpeta (`server/src/load-env.ts`).
2. Terminal 1 — frontend:

   ```bash
   npm run dev
   ```

3. Terminal 2 — API (no hay script npm dedicado; usa `tsx`):

   ```bash
   npx tsx server/src/index.ts
   ```

Por defecto la API escucha en el puerto **3001** (`PORT` opcional en `.env`).

Comprueba el estado del servidor: `GET http://localhost:3001/health`.

### Frontend y URL de la API

El cliente resuelve la base de la API así (`src/api/client.ts`): si existe `VITE_API_URL`, la usa; si no, en el navegador usa `window.location.origin`. En **Vite** eso apunta al propio dev server (p. ej. `http://localhost:5173`), donde **no** están montadas las rutas `/api/v1/...` salvo que configures un proxy. Por tanto, en local conviene definir:

```env
VITE_API_URL=http://localhost:3001
```

En **Vercel**, el rewrite de `vercel.json` envía `/api/*` al handler serverless (`api/[...path].ts`), que exporta la misma app Express; con el mismo origen suele bastar sin `VITE_API_URL`.

## Scripts npm (raíz)

| Comando           | Descripción                                      |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Servidor de desarrollo Vite (frontend).        |
| `npm run build`   | Compila el frontend (`tsc -b` + `vite build`). |
| `npm run preview` | Previsualiza el build de producción.           |
| `npm run lint`    | ESLint.                                        |

## Variables de entorno

Plantilla comentada: [`.env.example`](./.env.example).

**Frontend (prefijo `VITE_`)**

- `VITE_API_URL` — Base URL de la API (recomendada en local; véase arriba).
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — Auth y datos en Supabase cuando estén configurados (solo clave anónima, nunca la service role en el cliente).
- `VITE_RAPIDAPI_KEY` — Declarada en tipos; la búsqueda de ejercicios pasa hoy por el backend con `RAPIDAPI_KEY`.

**Backend**

- `RAPIDAPI_KEY` — Clave RapidAPI para ExerciseDB (búsqueda en Explorar / ejercicios). Si falta, el servidor avisa al arrancar y esa parte no funcionará.
- `PORT` — Puerto del servidor Express (por defecto `3001`).

## API (Express)

Rutas bajo prefijo `/api/v1`:

- `GET /health` — Comprobación de servicio.
- Sesiones, progreso, rutinas populares y ejercicios — ver [docs/api.md](./docs/api.md).

Persistencia local de sesiones y progreso: ficheros JSON en `server/data/`.

## Documentación

En la carpeta [`docs/`](./docs/) está la documentación del trabajo en **español** (idea, componentes, despliegue, API, etc.).

## Tablero de proyecto (Trello)

- [TrackMyLift en Trello](https://trello.com/b/5MnwVGzY/trackmylift)

## Estructura principal

- `src/` — Frontend React (páginas, hooks, contexto, cliente API, Supabase).
- `server/src/` — API Express (rutas, controladores, servicios, carga de `.env`).
- `server/data/` — Almacenamiento JSON (sesiones, progreso).
- `api/` — Entrada serverless en Vercel que reutiliza la app Express.
- `docs/` — Documentación del proyecto.

## Licencia

Uso académico / proyecto personal.
