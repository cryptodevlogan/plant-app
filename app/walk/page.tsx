'use client'
import { useState, useEffect } from 'react'
import { Playfair_Display, Lato } from 'next/font/google'
import { useRouter } from 'next/navigation'
import Head from 'next/head'

const playfair = Playfair_Display({ subsets: ['latin'] })
const lato = Lato({ weight: ['300'], subsets: ['latin'] })

export default function WalkPage() {
  const router = useRouter()
  const [thoughts, setThoughts] = useState('')
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const savedThoughts = localStorage.getItem('walkingThoughts')
    const lastSaveDate = localStorage.getItem('walkingThoughtsDate')
    const today = new Date().toDateString()

    if (savedThoughts && lastSaveDate === today) {
      setThoughts(savedThoughts)
    } else {
      localStorage.removeItem('walkingThoughts')
      localStorage.removeItem('walkingThoughtsDate')
      setThoughts('')
    }
  }, [])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
    }

    return () => clearInterval(interval)
  }, [isActive, timeLeft])

  const startTimer = () => {
    setIsActive(true)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleThoughtsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newThoughts = e.target.value
    setThoughts(newThoughts)
    localStorage.setItem('walkingThoughts', newThoughts)
    localStorage.setItem('walkingThoughtsDate', new Date().toDateString())
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>
      <main className="min-h-screen flex flex-col items-center gap-6 p-6 bg-[#E8F5E9]">
        <div className="w-full text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="material-icons text-[#43A047]">directions_walk</span>
            <h1 className={`${playfair.className} text-2xl text-[#2E7D32]`}>
              Walk in Silence
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2">
            <p className={`${lato.className} text-xl font-bold text-[#2E7D32]`}>
              {formatTime(timeLeft)}
            </p>
            {!isActive && timeLeft === 300 && (
              <button
                onClick={startTimer}
                className="text-[#43A047] hover:text-[#2E7D32]"
              >
                <span className="material-icons">play_circle</span>
              </button>
            )}
          </div>
        </div>

        <div className="w-full max-w-md">
          <textarea
            value={thoughts}
            onChange={handleThoughtsChange}
            placeholder="Write your thoughts here..."
            className={`${lato.className} w-full h-64 p-4 rounded-lg border border-[#66BB6A] focus:outline-none focus:border-[#43A047] bg-white text-[#424242] placeholder-[#9E9E9E]`}
          />
          <p className={`${lato.className} mt-4 text-[#66BB6A]`}>
            Brief thoughts that come to mind...
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="fixed bottom-8 left-0 right-0 flex justify-between px-6">
          <button
            onClick={() => router.push('/')}
            className={`${lato.className} px-4 py-2 rounded-full bg-[#43A047] text-white hover:bg-[#2E7D32]`}
          >
            ← Tea
          </button>
          <button
            onClick={() => router.push('/workout')}
            className={`${lato.className} px-4 py-2 rounded-full bg-[#43A047] text-white hover:bg-[#2E7D32]`}
          >
            Workout →
          </button>
        </div>
      </main>
    </>
  )
}