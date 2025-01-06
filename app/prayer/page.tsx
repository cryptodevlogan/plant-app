'use client'
import { useState, useEffect } from 'react'
import { Playfair_Display } from 'next/font/google'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import SwipeNavigation from '../components/SwipeNavigation'
import { Home } from 'lucide-react'

const playfair = Playfair_Display({ subsets: ['latin'] })

export default function PrayerPage() {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState(120)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            const alarm = new Audio('/gentle-alarm.mp3')
            alarm.play()
            setIsActive(false)
          }
          return time - 1
        })
      }, 1000)
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

  return (
    <SwipeNavigation
      leftPath="/tea"
      rightPath="/walk"
      currentPage="Prayer"
    >
      <main className="min-h-screen relative overflow-hidden bg-[#FBF0DE]">
        <button
          onClick={() => router.push('/')}
          className="fixed top-4 left-4 p-2 text-[#8B4513]/50 hover:text-[#8B4513] transition-colors z-50"
        >
          <Home className="w-5 h-5" />
        </button>

        <div className="w-full text-center mb-8 pt-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="material-icons text-[#8B4513]">church</span>
            <h1 className={`${playfair.className} text-2xl text-[#8B4513]`}>
              Prayer
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2">
            <p className={`${playfair.className} text-[3.5rem] leading-none text-[#8B4513] tracking-wide`}>
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>

        <div className="relative w-64 h-64 mb-4 mx-auto" onClick={startTimer}>
          <Image
            src="/cross.png"
            alt="Cross"
            width={256}
            height={256}
            className="object-contain cursor-pointer"
            priority
          />
        </div>

        <div className="text-center mb-8">
          <p className={`${playfair.className} text-lg text-[#8B4513]`}>
            Start your day in His presence.
          </p>
          <p className={`${playfair.className} text-lg text-[#8B4513]`}>
            Pause, reflect, and trust in His plan.
          </p>
        </div>
      </main>
    </SwipeNavigation>
  )
}