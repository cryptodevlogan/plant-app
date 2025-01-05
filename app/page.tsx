'use client'
import { useState, useEffect } from 'react'
import { Playfair_Display, Lato } from 'next/font/google'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const playfair = Playfair_Display({ subsets: ['latin'] })
const lato = Lato({ weight: ['300'], subsets: ['latin'] })

export default function Home() {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState(120)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      router.push('/walk')
    }
    return () => clearInterval(timer)
  }, [isRunning, timeLeft, router])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const startTimer = () => setIsRunning(true)
  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(120)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-start gap-4 pt-8 px-6 bg-[#FFCC90]">
      <div className="w-full max-w-xs flex flex-col items-center text-center mb-4">
        <h1 className={`${playfair.className} text-[2.5rem] leading-tight tracking-wide text-[#8B4513] mb-2`}>
          TEA TIME
        </h1>
        <p className={`${lato.className} text-[#8B4513] text-sm font-light`}>
          Take a moment to prepare and enjoy.
        </p>
      </div>
      
      <div className="relative w-64 h-64">
        <Image
          src="/teacup.png"
          alt="Cute smiling teacup"
          width={256}
          height={256}
          className="object-contain"
          priority
        />
      </div>

      <div className="w-full max-w-xs text-center -mt-24">
        <p className={`${playfair.className} text-[3.5rem] leading-none text-[#8B4513] tracking-wide`}>
          {formatTime(timeLeft)}
        </p>
        <div className="mt-4 space-x-4">
          <button 
            onClick={isRunning ? resetTimer : startTimer}
            className={`${lato.className} px-4 py-2 rounded-full bg-[#8B4513] text-white text-sm`}
          >
            {isRunning ? 'Reset' : 'Start'}
          </button>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-between px-6">
        <div></div>
        <button
          onClick={() => router.push('/prayer')}
          className={`${lato.className} px-4 py-2 rounded-full bg-[#8B4513] text-white text-sm`}
        >
          Prayer →
        </button>
      </div>
    </main>
  )
}