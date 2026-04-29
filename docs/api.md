# API de FitTrack (Express)

Este documento describe los endpoints implementados en el backend de FitTrack para sesiones y progreso.

## Convención de respuesta

Todos los endpoints devuelven siempre este formato:

- `data`: contenido de la respuesta
- `message`: mensaje descriptivo del resultado

## Base URL local

- `http://localhost:3001`

---

## Sesiones

### `GET /api/v1/sessions`

Recupera el historial de sesiones ordenado de la más reciente a la más antigua.

**Respuesta 200**

```json
{
  "data": [
    {
      "id": "session_1",
      "routineId": "routine_push",
      "routineName": "Push Day",
      "date": "2026-04-28T18:30:00.000Z",
      "notes": "Buenas sensaciones"
    }
  ],
  "message": "Sesiones recuperadas correctamente"
}
```

### `POST /api/v1/sessions`

Crea una nueva sesión.

**Body requerido**

```json
{
  "routineId": "routine_push",
  "routineName": "Push Day",
  "date": "2026-04-29T16:00:00.000Z",
  "notes": "Subí peso en press banca"
}
```

**Respuesta 201**

```json
{
  "data": {
    "id": "session_generated_id",
    "routineId": "routine_push",
    "routineName": "Push Day",
    "date": "2026-04-29T16:00:00.000Z",
    "notes": "Subí peso en press banca"
  },
  "message": "Sesión registrada correctamente"
}
```

**Respuesta 400 (ejemplo)**

```json
{
  "data": null,
  "message": "date debe ser una fecha ISO válida"
}
```

### `DELETE /api/v1/sessions/:id`

Elimina una sesión por ID.

**Respuesta 200**

```json
{
  "data": {
    "id": "session_generated_id"
  },
  "message": "Sesión eliminada correctamente"
}
```

**Respuesta 404**

```json
{
  "data": null,
  "message": "Sesión no encontrada"
}
```

---

## Progreso

### `GET /api/v1/progress/:exercise`

Devuelve el historial de un ejercicio concreto (filtro case-insensitive), ordenado por fecha ascendente.

**Respuesta 200**

```json
{
  "data": [
    {
      "id": "progress_1",
      "exerciseName": "Bench Press",
      "weight": 70,
      "reps": 8,
      "date": "2026-04-20T17:00:00.000Z"
    },
    {
      "id": "progress_2",
      "exerciseName": "Bench Press",
      "weight": 72.5,
      "reps": 8,
      "date": "2026-04-27T17:00:00.000Z"
    }
  ],
  "message": "Historial de \"Bench Press\" recuperado correctamente"
}
```

### `POST /api/v1/progress`

Crea un nuevo registro de progreso.

**Body requerido**

```json
{
  "exerciseName": "Bench Press",
  "weight": 75,
  "reps": 6,
  "date": "2026-04-29T18:00:00.000Z"
}
```

**Respuesta 201**

```json
{
  "data": {
    "id": "progress_generated_id",
    "exerciseName": "Bench Press",
    "weight": 75,
    "reps": 6,
    "date": "2026-04-29T18:00:00.000Z"
  },
  "message": "Registro de progreso creado correctamente"
}
```

**Respuesta 400 (ejemplo)**

```json
{
  "data": null,
  "message": "reps debe ser un número válido mayor o igual a 1"
}
```

---

## Errores globales

### Endpoint no existente (404)

```json
{
  "data": null,
  "message": "Endpoint no encontrado"
}
```

### Error interno (500)

```json
{
  "data": null,
  "message": "Error interno del servidor"
}
```
