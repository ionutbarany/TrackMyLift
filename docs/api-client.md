# Capa de red del frontend

La capa de red del frontend vive en `src/api/` y centraliza todas las llamadas HTTP para evitar `fetch` directo en componentes.

## `src/api/client.ts`

Cliente HTTP hacia la API propia (Express).

### Base URL

- Usa `VITE_API_URL` si existe.
- Si no existe:
  - en local usa `http://localhost:3001`,
  - en producción usa el mismo dominio de la app.

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

Cliente frontend para el endpoint interno de búsqueda de ejercicios.

### Configuración

- No usa ninguna API key en cliente.
- El frontend llama al backend: `GET /api/v1/exercises/search?q=...`.
- El backend se encarga de consultar RapidAPI con `RAPIDAPI_KEY` privada.

### Funciones implementadas

- `searchExercises(query)` -> consulta `GET /api/v1/exercises/search?q=...`.
- Devuelve resultados ya normalizados al modelo `ExerciseCatalogItem`.
