# Hooks de React en TrackMyLift

Este documento explica cómo se usan los hooks principales en el proyecto y qué problema resuelve cada uno.

## `useState`

Se usa para gestionar estado local de componentes y hooks personalizados.

### Dónde se usa

- Formularios (inputs, errores, modo edición).
- Estado de red (`idle`, `loading`, `success`, `error`).
- Datos en memoria (`sessions`, `entries`, `routines`).
- Estado global dentro del provider (`activeRoutine`, `weekSessions`).

### Ejemplo real de uso

- `useSessionLog` usa `useState` para `sessions`, `state` y `errorMessage`.
- `useProgress` usa `useState` para `entries`, `state` y `errorMessage`.

---

## `useEffect`

Se usa para ejecutar efectos secundarios: cargar datos al montar pantalla o reaccionar a cambios.

### Dónde se usa

- En `ExploreRoutines`, para cargar rutinas populares desde la API al iniciar la página.
- En componentes de formularios/páginas donde se sincroniza UI con cambios de estado.

### Beneficio

Permite separar la lógica de renderizado de la lógica de efectos (peticiones HTTP, sincronizaciones, inicializaciones).

---

## `useMemo`

Se usa para memorizar valores calculados y evitar recomputaciones innecesarias.

### Dónde se usa

- En `WorkoutProvider`, para memorizar el objeto `value` del contexto.

### Beneficio

Evita recrear el valor del contexto en cada render cuando las dependencias no cambian, reduciendo renders innecesarios en consumidores.

---

## `useCallback`

Se usa para memorizar funciones y mantener referencias estables entre renders.

### Dónde se usa

- En `useRoutines` (`addRoutine`, `updateRoutine`, `deleteRoutine`).
- En `useSessionLog` (`logSession`, `deleteSession`).
- En `useProgress` (`addEntry`, `getByExercise`).
- En `WorkoutProvider` (`refreshSessions`).

### Beneficio

Ayuda a optimizar rendimiento y evita rerenders innecesarios cuando funciones se pasan como props o dependencias.

---

## Custom hooks reutilizables

Además de hooks nativos, el proyecto define hooks personalizados para encapsular lógica de negocio.

## `useRoutines`

Hook encargado del CRUD de rutinas personales con persistencia en `localStorage`.

### Responsabilidades

- Cargar rutinas desde `localStorage` al inicializar.
- Crear nuevas rutinas (`addRoutine`).
- Actualizar una rutina existente (`updateRoutine`).
- Eliminar una rutina por `id` (`deleteRoutine`).
- Sincronizar cada cambio con `localStorage`.

### API del hook

```ts
const { routines, addRoutine, updateRoutine, deleteRoutine } = useRoutines()
```

## `useSessionLog`

Hook de sesiones conectado a la API Express (`/api/v1/sessions`), con estados de red.

### Responsabilidades

- Registrar una sesión.
- Eliminar una sesión.
- Exponer estado `loading/success/error`.
- Exponer `errorMessage` para feedback en UI.

### API del hook

```ts
const { sessions, logSession, deleteSession, state, errorMessage } =
  useSessionLog()
```

## `useProgress`

Hook de progreso conectado a la API Express (`/api/v1/progress`), con estados de red.

### Responsabilidades

- Crear un nuevo registro de progreso.
- Consultar historial por ejercicio.
- Exponer estado `loading/success/error`.
- Exponer `errorMessage` para feedback en UI.

### API del hook

```ts
const { entries, addEntry, getByExercise, state, errorMessage } = useProgress()
```

## `useWorkout`

Hook para consumir `WorkoutContext` de forma segura.

### Responsabilidades

- Leer estado global del provider.
- Lanzar error claro si se usa fuera de `WorkoutProvider`.

### API del hook

```ts
const { activeRoutine, setActiveRoutine, weekSessions, refreshSessions } =
  useWorkout()
```
