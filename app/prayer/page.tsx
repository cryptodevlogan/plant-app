'use client'
import { useState, useEffect } from 'react'
import { Playfair_Display, Lato } from 'next/font/google'
import { useRouter } from 'next/navigation'
import Head from 'next/head'
import Image from 'next/image'

const playfair = Playfair_Display({ subsets: ['latin'] })
const lato = Lato({ weight: ['300'], subsets: ['latin'] })

export default function PrayerPage() {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState(120) // Changed from 60 to 120 seconds (2 minutes)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            // Play alarm sound when timer reaches 0
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
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>
      <main className="min-h-screen flex flex-col items-center p-6 bg-[#FBF0DE]">
        <div className="w-full text-center mb-8">
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

        <div className="relative w-64 h-64 mb-4" onClick={startTimer}>
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

        <div className="fixed bottom-8 left-0 right-0 flex justify-between px-6">
          <button
            onClick={() => router.push('/')}
            className={`${lato.className} px-4 py-2 rounded-full bg-[#8B4513] text-white text-sm hover:bg-[#6A4423]`}
          >
            ← Tea
          </button>
          <button
            onClick={() => router.push('/walk')}
            className={`${lato.className} px-4 py-2 rounded-full bg-[#8B4513] text-white text-sm hover:bg-[#6A4423]`}
          >
            Walk →
          </button>
        </div>
      </main>
    </>
  )
}