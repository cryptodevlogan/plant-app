'use client'
import { useState } from 'react'
import { Playfair_Display, Lato } from 'next/font/google'
import { useRouter } from 'next/navigation'
import Head from 'next/head'

const playfair = Playfair_Display({ subsets: ['latin'] })
const lato = Lato({ weight: ['300'], subsets: ['latin'] })

export default function WorkoutPage() {
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)

  const exercises = [
    { name: 'Groin stretches', duration: '30 seconds each side' },
    { name: 'Squat position hold', duration: '1 minute' },
    { name: 'Bodyweight squats', reps: '10 reps' },
    { name: 'Pushups', description: 'as many as you can' },
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
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>
      <main className="min-h-screen flex flex-col items-center p-6 bg-white">
        <div className="w-full text-center mb-4">
          <h1 className={`${playfair.className} text-2xl mb-2 text-[#4A148C]`}>
            Daily Affirmation & Grounding
          </h1>
        </div>

        {/* Audio controls */}
        <div className="w-full max-w-md flex justify-center gap-4 mb-4">
          <audio 
            id="backgroundAudio" 
            src="/meditation.mp3" 
            loop
            onError={(e) => console.error('Audio error:', e)}
          />
          <button
            onClick={() => {
              const audio = document.getElementById('backgroundAudio') as HTMLAudioElement
              audio.currentTime = Math.max(0, audio.currentTime - 10)
            }}
            className={`${lato.className} p-2 rounded-full bg-[#7B1FA2] text-white hover:bg-[#6A1B9A]`}
          >
            ⏪
          </button>
          <button
            onClick={toggleAudio}
            className={`${lato.className} p-2 rounded-full bg-[#7B1FA2] text-white hover:bg-[#6A1B9A]`}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button
            onClick={() => {
              const audio = document.getElementById('backgroundAudio') as HTMLAudioElement
              audio.currentTime = Math.min(audio.duration, audio.currentTime + 10)
            }}
            className={`${lato.className} p-2 rounded-full bg-[#7B1FA2] text-white hover:bg-[#6A1B9A]`}
          >
            ⏩
          </button>
        </div>

        {/* Exercise list */}
        <div className="w-full max-w-md">
          <h2 className={`${playfair.className} text-xl mb-4 text-[#4A148C]`}>Exercise Routine:</h2>
          <ul className="space-y-4">
            {exercises.map((exercise, index) => (
              <li 
                key={index}
                className={`${lato.className} flex items-center gap-4`}
              >
                <span className="text-[#7B1FA2] font-bold">{index + 1}.</span>
                <div>
                  <p className="font-medium text-[#4A148C]">{exercise.name}</p>
                  <p className="text-sm text-[#9C27B0]">
                    {exercise.duration || exercise.reps || exercise.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Navigation buttons */}
        <div className="fixed bottom-8 left-0 right-0 flex justify-between px-6">
          <button
            onClick={() => router.push('/walk')}
            className={`${lato.className} px-4 py-2 rounded-full bg-[#7B1FA2] text-white hover:bg-[#6A1B9A]`}
          >
            ← Walk
          </button>
          <button
            onClick={() => router.push('/tasks')}
            className={`${lato.className} px-4 py-2 rounded-full bg-[#7B1FA2] text-white hover:bg-[#6A1B9A]`}
          >
            Tasks →
          </button>
        </div>
      </main>
    </>
  )
}
