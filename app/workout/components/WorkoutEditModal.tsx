'use client'

import { useState } from 'react'
import { Inter } from 'next/font/google'
import { X, Plus, Trash2, Clock } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

interface Exercise {
  id: string
  name: string
  duration: number
  description?: string
}

interface WorkoutEditModalProps {
  isOpen: boolean
  onClose: () => void
  exercises: Exercise[]
  setExercises: (exercises: Exercise[]) => void
}

export default function WorkoutEditModal({
  isOpen,
  onClose,
  exercises,
  setExercises,
}: WorkoutEditModalProps) {
  const [newExercise, setNewExercise] = useState({
    name: '',
    duration: 60,
    description: ''
  })

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const addExercise = () => {
    if (newExercise.name) {
      setExercises([
        ...exercises,
        {
          ...newExercise,
          id: crypto.randomUUID()
        }
      ])
      setNewExercise({ name: '', duration: 60, description: '' })
    }
  }

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[80vh] overflow-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className={`${inter.className} text-xl font-semibold text-gray-900`}>
              Edit Workout
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Add Exercise Form */}
          <div className="space-y-4">
            <input
              type="text"
              value={newExercise.name}
              onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
              placeholder="Exercise name"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm text-gray-500 mb-1">Duration (seconds)</label>
                <input
                  type="number"
                  value={newExercise.duration}
                  onChange={(e) => setNewExercise({ ...newExercise, duration: parseInt(e.target.value) || 0 })}
                  min="5"
                  max="300"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={addExercise}
                disabled={!newExercise.name}
                className="self-end px-6 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 
                         disabled:opacity-50 disabled:hover:bg-blue-500 transition-colors"
              >
                Add
              </button>
            </div>
            <textarea
              value={newExercise.description}
              onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
              placeholder="Exercise description (optional)"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
            />
          </div>

          {/* Exercise List */}
          <div className="space-y-3">
            <h3 className={`${inter.className} font-medium text-gray-900`}>Current Exercises</h3>
            {exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className="flex justify-between items-start p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="flex-1 mr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-400">#{index + 1}</span>
                    <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                  </div>
                  {exercise.description && (
                    <p className="text-sm text-gray-500 mb-2">{exercise.description}</p>
                  )}
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTime(exercise.duration)}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeExercise(exercise.id)}
                  className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 