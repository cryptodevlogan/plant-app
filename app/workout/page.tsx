'use client'

import { useState, useEffect } from 'react'
import { Playfair_Display, Inter } from 'next/font/google'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { Home, ArrowLeft, ArrowRight, Play, Pause, Edit3 } from 'lucide-react'
import WorkoutEditModal from './components/WorkoutEditModal'

const playfair = Playfair_Display({ subsets: ['latin'] })
const inter = Inter({ subsets: ['latin'] })

interface Exercise {
  id: string
  name: string
  duration: number
  description?: string
  completed?: boolean
}

export default function WorkoutPage() {
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([
    { 
      id: '1', 
      name: 'Warm Up', 
      duration: 180,
      description: 'Light stretching and joint mobility exercises to prepare your body.'
    },
    { 
      id: '2', 
      name: 'High Knees', 
      duration: 60,
      description: 'Run in place bringing knees up to hip level. Keep your core engaged.'
    },
    { 
      id: '3', 
      name: 'Mountain Climbers', 
      duration: 60,
      description: 'Start in plank position. Alternate bringing knees to chest rapidly.'
    },
    { 
      id: '4', 
      name: 'Rest', 
      duration: 30,
      description: 'Take deep breaths and shake out your muscles.'
    },
  ])
  const [isEditMode, setIsEditMode] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>(0)

  // Load saved exercises from localStorage on client side
  useEffect(() => {
    const saved = localStorage.getItem('workoutExercises')
    if (saved) {
      setExercises(JSON.parse(saved))
    }
  }, [])

  // Initialize audio on client side only
  useEffect(() => {
    setAudio(new Audio('/workout-music.mp3'))
  }, [])

  // Handle audio play/pause
  useEffect(() => {
    if (!audio) return

    if (isPlaying) {
      audio.play()
    } else {
      audio.pause()
    }

    return () => {
      audio.pause()
    }
  }, [isPlaying, audio])

  // Handle exercise timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isPlaying && exercises[currentIndex]) {
      setTimeLeft(exercises[currentIndex].duration)
      
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Move to next exercise
            if (currentIndex < exercises.length - 1) {
              setCurrentIndex(currentIndex + 1)
            } else {
              setIsPlaying(false)
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isPlaying, currentIndex, exercises])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50
    if (Math.abs(info.offset.x) > swipeThreshold) {
      if (info.offset.x > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1)
      } else if (info.offset.x < 0 && currentIndex < exercises.length - 1) {
        setCurrentIndex(currentIndex + 1)
      }
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900 overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-white/10 px-4 py-3">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/')}
            className="p-2.5 -ml-2.5 rounded-full hover:bg-white/10 text-white/90 transition-colors"
          >
            <Home className="w-[18px] h-[18px]" />
          </button>
          <h1 className={`${playfair.className} text-lg font-bold text-white/90`}>
            Morning Flow
          </h1>
          <div className="w-[18px]" />
        </div>
      </header>

      {/* Swipeable Workout Cards */}
      <div className="px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="aspect-square max-w-sm mx-auto relative touch-pan-x"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-indigo-600/30 rounded-3xl backdrop-blur-md border border-white/10" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white">
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setIsEditMode(true)}
                  className="p-2.5 rounded-full hover:bg-white/10 text-white/90 transition-colors"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              </div>
              
              <div className="w-full text-center">
                <p className={`${inter.className} text-sm font-medium text-white/60 mb-2`}>
                  {currentIndex + 1} of {exercises.length}
                </p>
                <h2 className={`${playfair.className} text-3xl font-bold mb-4`}>
                  {exercises[currentIndex].name}
                </h2>
                <p className={`${inter.className} text-xl font-medium text-white/90 mb-6`}>
                  {formatTime(timeLeft || exercises[currentIndex].duration)}
                </p>
                <p className={`${inter.className} text-sm text-white/80 leading-relaxed max-w-xs mx-auto`}>
                  {exercises[currentIndex].description}
                </p>
              </div>

              <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-1.5">
                {exercises.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Playback Controls */}
      <div className="fixed bottom-24 inset-x-0 px-4">
        <div className="max-w-sm mx-auto flex justify-center items-center gap-8">
          <button
            onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
            className="p-3 rounded-full hover:bg-white/10 text-white/80 transition-all"
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-6 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all 
                     transform hover:scale-105 active:scale-95 backdrop-blur-sm"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </button>
          <button
            onClick={() => currentIndex < exercises.length - 1 && setCurrentIndex(currentIndex + 1)}
            className="p-3 rounded-full hover:bg-white/10 text-white/80 transition-all"
            disabled={currentIndex === exercises.length - 1}
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-8 inset-x-0 px-4 z-20">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 
                     p-4 flex justify-between max-w-md mx-auto">
          <button
            onClick={() => router.push('/walk')}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors px-2"
          >
            <ArrowLeft className="w-[18px] h-[18px]" />
            <span className={`${inter.className} text-sm font-medium`}>Walk</span>
          </button>
          <button
            onClick={() => router.push('/anchors')}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors px-2"
          >
            <span className={`${inter.className} text-sm font-medium`}>Anchors</span>
            <ArrowRight className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      <WorkoutEditModal
        isOpen={isEditMode}
        onClose={() => setIsEditMode(false)}
        exercises={exercises}
        setExercises={(newExercises: Exercise[]) => {
          setExercises(newExercises)
          localStorage.setItem('workoutExercises', JSON.stringify(newExercises))
        }}
      />
    </main>
  )
}