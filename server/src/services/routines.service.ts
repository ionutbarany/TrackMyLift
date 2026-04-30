import type { Routine } from '../types.js'

const popularRoutinesStore: Routine[] = [
  {
    id: 'popular-ppl-push',
    name: 'PPL - Push',
    description: 'Pecho, hombro y triceps en una sesion de empuje.',
    isPublic: true,
    createdAt: new Date('2026-01-10').toISOString(),
    exercises: [
      {
        id: 'push-1',
        name: 'Bench Press',
        muscleGroup: 'chest',
        sets: 4,
        reps: 8,
        weight: 60,
      },
      {
        id: 'push-2',
        name: 'Overhead Press',
        muscleGroup: 'shoulders',
        sets: 3,
        reps: 10,
        weight: 35,
      },
      {
        id: 'push-3',
        name: 'Triceps Pushdown',
        muscleGroup: 'arms',
        sets: 3,
        reps: 12,
        weight: 25,
      },
    ],
  },
  {
    id: 'popular-ppl-pull',
    name: 'PPL - Pull',
    description: 'Espalda y biceps para ganar fuerza de traccion.',
    isPublic: true,
    createdAt: new Date('2026-01-11').toISOString(),
    exercises: [
      {
        id: 'pull-1',
        name: 'Barbell Row',
        muscleGroup: 'back',
        sets: 4,
        reps: 8,
        weight: 55,
      },
      {
        id: 'pull-2',
        name: 'Lat Pulldown',
        muscleGroup: 'back',
        sets: 3,
        reps: 12,
        weight: 45,
      },
      {
        id: 'pull-3',
        name: 'Barbell Curl',
        muscleGroup: 'arms',
        sets: 3,
        reps: 10,
        weight: 22.5,
      },
    ],
  },
  {
    id: 'popular-full-body',
    name: 'Full Body 3 dias',
    description: 'Rutina equilibrada para entrenar todo el cuerpo.',
    isPublic: true,
    createdAt: new Date('2026-01-12').toISOString(),
    exercises: [
      {
        id: 'full-1',
        name: 'Back Squat',
        muscleGroup: 'legs',
        sets: 4,
        reps: 6,
        weight: 70,
      },
      {
        id: 'full-2',
        name: 'Bench Press',
        muscleGroup: 'chest',
        sets: 4,
        reps: 8,
        weight: 60,
      },
      {
        id: 'full-3',
        name: 'Romanian Deadlift',
        muscleGroup: 'glutes',
        sets: 3,
        reps: 10,
        weight: 65,
      },
    ],
  },
]

export function listPopularRoutines(): Routine[] {
  return popularRoutinesStore
}
