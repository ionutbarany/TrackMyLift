# Estructura de rutas

## Router

La navegación está implementada con **React Router** usando `BrowserRouter` en `src/main.tsx`.

## Mapa de rutas

Definidas en `src/App.tsx`:

- `/` -> `Dashboard`
- `/routines` -> `MyRoutines`
- `/routines/:id` -> `RoutineDetail`
- `/session` -> `LogSession`
- `/progress` -> `Progress`
- `/explore` -> `ExploreRoutines`
- `/404` -> `NotFound`
- `*` -> redirección a `/404`

## Navegación principal

`NavBar` centraliza los enlaces a las pantallas principales:

- Dashboard
- Mis rutinas
- Registrar sesión
- Progreso
- Explorar rutinas

## Manejo de ruta no encontrada

Se implementó página 404 dedicada (`NotFound`) y una ruta comodín (`*`) que redirige a esa página para evitar pantallas en blanco o errores de navegación.
