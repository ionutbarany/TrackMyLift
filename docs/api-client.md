# Capa de red del frontend

La capa de red del frontend vive en `src/api/` y centraliza todas las llamadas HTTP para evitar `fetch` directo en componentes.

## `src/api/client.ts`

Cliente HTTP hacia la API propia (Express).

### Base URL

- Usa `VITE_API_URL` si existe.
- Si no existe, usa `http://localhost:3001`.

### Endpoints integrados

- `fetchPopularRoutines()` -> `GET /api/v1/routines/popular`
- `fetchSessions()` -> `GET /api/v1/sessions`
- `createSession()` -> `POST /api/v1/sessions`
- `deleteSessionById()` -> `DELETE /api/v1/sessions/:id`
- `fetchProgressByExercise()` -> `GET /api/v1/progress/:exercise`
- `createProgressEntry()` -> `POST /api/v1/progress`

### Manejo de errores

- Si `response.ok` es `false`, lanza `Error` con `message` recibido del backend.
- Si no hay `message`, usa un fallback: `Error de red con la API`.

## `src/api/exerciseApi.ts`

Cliente para la API externa ExerciseDB (RapidAPI).

### Configuración

- Lee `VITE_RAPIDAPI_KEY` desde variables de entorno.

### Funciones implementadas

- `searchExercises(query)` -> consulta `GET /exercises/name/:query` en ExerciseDB.
- Mapea la respuesta externa al modelo interno `ExerciseCatalogItem`.
- Normaliza grupo muscular al tipo `MuscleGroup` del proyecto.
