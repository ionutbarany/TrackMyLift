# Hooks personalizados

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

### Ejemplo de uso

```ts
addRoutine({
  id: 'routine_1',
  name: 'Push Day',
  description: 'Pecho, hombro y tríceps',
  exercises: [],
  isPublic: false,
  createdAt: new Date().toISOString(),
})
```

---

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

---

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
