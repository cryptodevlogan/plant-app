'use client'

import { useState, useEffect } from 'react'
import { Montserrat, Inter } from 'next/font/google'
import { useRouter } from 'next/navigation'
import { Play, Pause, SkipForward, SkipBack, X, Edit2, Home } from 'lucide-react'
import Image from 'next/image'
import SwipeNavigation from '../components/SwipeNavigation'

// Font configuration
const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600', '700'],  // Semi-bold and bold for headings
})

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500'],  // Regular and medium for body text
})

interface ExerciseItem {
  name: string
  time?: string
  duration?: string
  goal?: string
  description?: string
  notes?: string[]
}

interface ExerciseSection {
  section: string
  description?: string
  items: ExerciseItem[]
}

interface EditModalProps {
  exercises: ExerciseSection[]
  setExercises: (exercises: ExerciseSection[]) => void
  isOpen: boolean
  onClose: () => void
}

function EditModal({ exercises, setExercises, isOpen, onClose }: EditModalProps) {
  if (!isOpen) return null

  const updateSection = (sectionIdx: number, field: string, value: string) => {
    const newExercises = [...exercises]
    if (field === 'section') {
      newExercises[sectionIdx].section = value
    } else if (field === 'description') {
      newExercises[sectionIdx].description = value
    }
    setExercises(newExercises)
  }

  const updateExercise = (sectionIdx: number, itemIdx: number, field: keyof ExerciseItem, value: string) => {
    const newExercises = [...exercises]
    const exercise = newExercises[sectionIdx].items[itemIdx]
    if (field in exercise) {
      if (field === 'notes') {
        // Handle notes array separately
        exercise[field] = [value]
      } else {
        // Handle string fields
        (exercise[field] as string) = value
      }
    }
    setExercises(newExercises)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`${montserrat.className} text-xl font-bold text-orange-950`}>
            Edit Workout Plan
          </h2>
          <button onClick={onClose} className="text-orange-600 hover:text-orange-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-8">
          {exercises.map((section, sectionIdx) => (
            <div key={sectionIdx} className="bg-amber-50/50 rounded-lg p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-orange-800 mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  value={section.section}
                  onChange={(e) => updateSection(sectionIdx, 'section', e.target.value)}
                  className="w-full px-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>

              <div className="space-y-4">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="bg-white rounded-md p-3 space-y-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateExercise(sectionIdx, itemIdx, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
                      placeholder="Exercise name"
                    />
                    {item.time && (
                      <input
                        type="text"
                        value={item.time}
                        onChange={(e) => updateExercise(sectionIdx, itemIdx, 'time', e.target.value)}
                        className="w-full px-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
                        placeholder="Duration"
                      />
                    )}
                    {item.description && (
                      <textarea
                        value={item.description}
                        onChange={(e) => updateExercise(sectionIdx, itemIdx, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
                        placeholder="Description"
                        rows={2}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Save to localStorage here if needed
              onClose()
            }}
            className="px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 rounded-md transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default function WorkoutPage() {
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [exercises, setExercises] = useState<ExerciseSection[]>([
    {
      section: "Warm-Up (2 Minutes)",
      items: [
        { name: "Jumping Jacks", time: "1 minute", description: "Get your blood flowing and loosen up your muscles" },
        { name: "Arm Circles + Torso Twists", time: "1 minute", description: "Focus on mobility and joint preparation" }
      ]
    },
    {
      section: "Main Circuit (7 Minutes)",
      description: "Perform each exercise for 40 seconds, followed by 20 seconds of rest. Repeat the circuit twice.",
      items: [
        {
          name: "Bodyweight Squats",
          goal: "to 100 over the entire session",
          notes: [
            "Build leg strength and endurance",
            "Keep your back straight, and don't let your knees cave inward"
          ]
        },
        {
          name: "Pull-Ups",
          notes: [
            "Strengthen your back, biceps, and shoulders",
            "Modify by using a resistance band or a pull-up assist machine if needed"
          ]
        },
        {
          name: "Leg Lifts",
          description: "lying down",
          notes: [
            "Target your core, especially the lower abs",
            "Keep your back flat on the ground and lift your legs slowly"
          ]
        },
        {
          name: "Step Knee Exercise",
          description: "side step-downs",
          notes: [
            "Strengthen knees and improve balance",
            "Stand sideways on a step, squat slightly, and lower the non-weight-bearing leg below the step. Alternate sides"
          ]
        }
      ]
    },
    {
      section: "Cool Down (1 Minute)",
      items: [
        { name: "Child's Pose", duration: "30 seconds", description: "Stretch your lower back and hips" },
        { name: "Standing Forward Fold", duration: "30 seconds", description: "Stretch your hamstrings and lower back" }
      ]
    }
  ])
  const [showTooltip, setShowTooltip] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    const hasSeenTooltip = localStorage.getItem('hasSeenWorkoutTooltip')
    if (!hasSeenTooltip) {
      setShowTooltip(true)
    }
  }, [])

  const handleCloseTooltip = () => {
    localStorage.setItem('hasSeenWorkoutTooltip', 'true')
    setShowTooltip(false)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const toggleAudio = () => {
    const audio = document.getElementById('backgroundAudio') as HTMLAudioElement
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <SwipeNavigation
      leftPath="/walk"
      rightPath="/tasks"
      currentPage="Workout"
    >
      <main className="min-h-screen p-6 bg-gradient-to-b from-orange-50 via-amber-50 to-white">
        {showTooltip && (
          <div className="fixed inset-x-0 top-20 mx-auto w-fit bg-amber-100/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg z-50">
            <p className={`${inter.className} text-sm text-orange-800 whitespace-nowrap`}>
              Click the edit icon to customize your workout plan!
            </p>
            <button 
              onClick={handleCloseTooltip}
              className="absolute -right-1 -top-1 w-6 h-6 flex items-center justify-center bg-orange-100 rounded-full text-orange-600 hover:text-orange-800 hover:bg-orange-200 transition-colors"
            >
              ×
            </button>
          </div>
        )}

        <div className="fixed top-4 left-4 right-4 flex justify-between items-center z-50">
          <button
            onClick={() => router.push('/')}
            className="p-2 text-orange-400/50 hover:text-orange-600 transition-colors"
          >
            <Home className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-2 text-orange-400/50 hover:text-orange-600 transition-colors"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        </div>

        <div className="w-full text-center mb-8 relative mt-12">
          <h1 className={`${montserrat.className} text-2xl sm:text-3xl mb-2 text-orange-950 font-bold tracking-wide uppercase`}>
            Morning Workout
          </h1>
          <p className={`${inter.className} text-sm sm:text-base text-orange-600 tracking-wide`}>
            Healthy body, Healthy mind, Healthy life
          </p>
        </div>

        <div className="flex gap-4 sm:gap-6 mt-8">
          <div className="w-1/4">
            <div className="flex justify-center items-center gap-2 mb-6">
              <p className={`${montserrat.className} text-lg sm:text-xl text-orange-950 font-semibold`}>
                {formatTime(seconds)}
              </p>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`${inter.className} px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full bg-amber-500 text-white hover:bg-amber-600 transition-colors font-medium`}
              >
                {isPlaying ? 'Stop' : 'Start'}
              </button>
            </div>

            <div className="mt-8">
              <div className="flex justify-center items-center gap-1 sm:gap-2 mb-8">
                <audio id="backgroundAudio" src="/meditation.mp3" loop />
                <button
                  onClick={() => {
                    const audio = document.getElementById('backgroundAudio') as HTMLAudioElement
                    audio.currentTime = Math.max(0, audio.currentTime - 10)
                  }}
                    className={`${inter.className} p-1.5 hover:bg-amber-50 rounded-full transition-colors`}
                  aria-label="Rewind 10 seconds"
                >
                  <SkipBack className="w-4 h-4 text-amber-600" />
                </button>
                <button
                  onClick={toggleAudio}
                    className={`${inter.className} p-2 bg-amber-100 hover:bg-amber-200 rounded-full transition-colors`}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? 
                    <Pause className="w-5 h-5 text-amber-600" /> :
                    <Play className="w-5 h-5 text-amber-600" />
                  }
                </button>
                <button
                  onClick={() => {
                    const audio = document.getElementById('backgroundAudio') as HTMLAudioElement
                    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10)
                  }}
                    className={`${inter.className} p-1.5 hover:bg-amber-50 rounded-full transition-colors`}
                  aria-label="Forward 10 seconds"
                >
                  <SkipForward className="w-4 h-4 text-amber-600" />
                </button>
              </div>

              <h2 className={`${montserrat.className} text-lg sm:text-xl mb-8 text-orange-950 text-center font-bold tracking-wide uppercase`}>
                No Excuses
              </h2>

              <div className="relative w-32 sm:w-64 mx-auto mt-8">
                <Image 
                  src="/body.png" 
                  alt="Motivational bodybuilder"
                  width={256}
                  height={256}
                  className="w-full h-auto object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          <div className="w-3/4 overflow-y-auto mb-24" 
            style={{ maxHeight: 'calc(100vh - 240px)' }}
          >
            <div className="rounded-lg">
              {exercises.map((section, index) => (
                <div key={section.section} className={`${index === 0 ? '' : 'mt-8'} px-6`}>
                  <h3 className={`${montserrat.className} text-xl sm:text-2xl font-bold text-orange-950 tracking-wide uppercase`}>
                    {section.section}
                  </h3>
                  {section.description && (
                    <p className={`${inter.className} text-sm sm:text-base text-orange-600/90 mt-2`}>
                      {section.description}
                    </p>
                  )}
                  <ul className="mt-6 space-y-6">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="pl-4 border-l-2 border-amber-300">
                        <div className={`${montserrat.className} font-semibold text-base sm:text-lg text-orange-950`}>
                          {item.name} {item.time && `(${item.time})`}
                        </div>
                        {item.description && (
                          <p className={`${inter.className} text-sm sm:text-base text-orange-600/90 italic mt-1`}>
                            {item.description}
                          </p>
                        )}
                        {item.notes && (
                          <ul className="mt-3 space-y-2">
                            {item.notes.map((note, noteIdx) => (
                              <li key={noteIdx} className={`${inter.className} text-sm sm:text-base text-orange-600/90 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-amber-400`}>
                                {note}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <EditModal
          exercises={exercises}
          setExercises={setExercises}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      </main>
    </SwipeNavigation>
  )
}