# FitTrack

Aplicación web para organizar rutinas de gimnasio, registrar sesiones y seguir la evolución de los pesos. Proyecto académico full stack: **React + TypeScript + Vite** en el cliente y **Node + Express + TypeScript** en el servidor (en desarrollo).

## Requisitos

- Node.js 20 o superior recomendado
- npm

## Scripts

| Comando | Descripción |
|--------|-------------|
| `npm run dev` | Arranca el servidor de desarrollo de Vite (frontend). |
| `npm run build` | Compila el frontend para producción. |
| `npm run preview` | Previsualiza el build de producción. |
| `npm run lint` | Ejecuta ESLint sobre el código. |

## Variables de entorno (frontend)

Crea un fichero `.env` en la raíz del proyecto según necesites:

- `VITE_API_URL` — URL base de la API (si no se define, usa el mismo dominio en producción y `http://localhost:3001` en local).

## Variables de entorno (backend)

- `RAPIDAPI_KEY` — clave privada para consultar ExerciseDB desde el servidor (no se expone al navegador).

## Documentación

En la carpeta `docs/` encontrarás la documentación del trabajo en **español** (idea del proyecto, metodologías ágiles, etc.).

## Tablero de proyecto (Trello)

Organización del trabajo, tareas y seguimiento del avance del proyecto:

- [TrackMyLift en Trello](https://trello.com/b/5MnwVGzY/trackmylift)

## Estructura principal

- `src/` — código del frontend (React).
- `server/` — código del backend Express (TypeScript).
- `docs/` — documentación del proyecto.

## Licencia

Uso académico / proyecto personal.
