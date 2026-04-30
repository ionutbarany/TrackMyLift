# Context API en TrackMyLift

## Qué se implementó

Se implementó un contexto global usando:

- `createContext` en `src/context/workoutContext.ts`
- `WorkoutProvider` en `src/context/WorkoutProvider.tsx`
- Hook consumidor `useWorkout` en `src/hooks/useWorkout.ts`

## Estado compartido actualmente

El contexto expone:

- `activeRoutine`: rutina activa seleccionada.
- `setActiveRoutine`: función para actualizar la rutina activa.
- `weekSessions`: sesiones de la semana (estructura preparada).
- `refreshSessions`: función para refrescar sesiones (base preparada para integración).

## Dónde se monta el Provider

`WorkoutProvider` envuelve toda la app en `src/main.tsx`, por lo que cualquier página/componente puede consumir el contexto.

## Casos en los que Context API es útil

Context API es útil cuando varios componentes necesitan el mismo estado sin pasar props por muchos niveles:

- Estado de usuario o sesión.
- Preferencias globales (tema, idioma).
- Entidades activas compartidas (como rutina seleccionada).
- Banderas globales de UI (modales, notificaciones).

## Por qué se eligió en este proyecto

Se eligió para mantener un estado global simple sin añadir librerías externas de estado, manteniendo el proyecto ligero y adecuado para una fase académica de React + TypeScript.
