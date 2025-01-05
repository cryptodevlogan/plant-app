'use client'

import { useState, useEffect } from 'react'
import { Montserrat, Inter } from 'next/font/google'
import { useRouter } from 'next/navigation'
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react'
import Image from 'next/image'

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

export default function WorkoutPage() {
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)
  const [seconds, setSeconds] = useState(0)

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

  const exercises: ExerciseSection[] = [
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
  ]

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
    <main className="min-h-screen p-6 bg-gradient-to-b from-orange-50 via-amber-50 to-white">
      <div className="w-full text-center mb-8">
        <h1 className={`${montserrat.className} text-xl sm:text-2xl mb-2 text-orange-950 font-bold tracking-wide uppercase`}>
          Morning Workout
        </h1>
        <p className={`${inter.className} text-xs sm:text-sm text-orange-600 tracking-wide`}>
          Healthy body, Healthy mind, Healthy life
        </p>
      </div>

      <div className="flex gap-4 sm:gap-6">
        <div className="w-1/3">
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

            <div className="relative w-32 sm:w-64 mx-auto mt-8 -ml-4">
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

        <div className="w-2/3 overflow-y-auto mb-20" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <div className="space-y-6 sm:space-y-8">
            {exercises.map((section, idx) => (
              <div key={idx} className="space-y-3 sm:space-y-4">
                <h3 className={`${montserrat.className} text-base sm:text-lg font-semibold text-orange-900 tracking-wide`}>
                  {section.section}
                </h3>
                {section.description && (
                  <p className={`${inter.className} text-xs sm:text-sm text-orange-600 italic mb-2`}>
                    {section.description}
                  </p>
                )}
                <ul className="space-y-3 sm:space-y-4">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className={`${inter.className} pl-3 sm:pl-4 border-l-2 border-amber-200 hover:border-amber-400 transition-colors`}>
                      <div className="flex flex-wrap items-baseline gap-x-2 font-medium text-orange-950 text-sm sm:text-base">
                        <span>{item.name}</span>
                        {item.time && <span className="text-xs sm:text-sm text-orange-600">({item.time})</span>}
                        {item.goal && <span className="text-xs sm:text-sm text-orange-600">({item.goal})</span>}
                      </div>
                      {item.description && (
                        <p className="text-xs sm:text-sm text-orange-600 italic mt-1">{item.description}</p>
                      )}
                      {item.notes && (
                        <ul className="mt-1 space-y-1">
                          {item.notes.map((note, noteIdx) => (
                            <li key={noteIdx} className="text-xs sm:text-sm text-orange-600 pl-3 sm:pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-amber-400">
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

      <div className="fixed bottom-8 left-0 right-0 flex justify-between px-6">
        <button
          onClick={() => router.push('/walk')}
          className={`${inter.className} px-4 py-2 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition-colors font-medium`}
        >
          ← Walk
        </button>
        <button
          onClick={() => router.push('/tasks')}
          className={`${inter.className} px-4 py-2 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition-colors font-medium`}
        >
          Tasks →
        </button>
      </div>
    </main>
  )
}