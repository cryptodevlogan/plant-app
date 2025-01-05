'use client'
import SwipeNavigation from '../components/SwipeNavigation'
import MenuButton from '../components/MenuButton'
import { useState, useEffect } from 'react'
import { Playfair_Display, DM_Serif_Display } from 'next/font/google'
import { useRouter } from 'next/navigation'
import { Sun, Cloud, Bird } from 'lucide-react'
import Head from 'next/head'
import { useSwipeable } from 'react-swipeable'

const playfair = Playfair_Display({ subsets: ['latin'] })
const dmSerif = DM_Serif_Display({ weight: '400', subsets: ['latin'] })

export default function WalkPage() {
  const router = useRouter()
  const [thoughts, setThoughts] = useState('')
  const [timeLeft, setTimeLeft] = useState(300)
  const [isActive, setIsActive] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [swipeAmount, setSwipeAmount] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useSwipeable({
    onSwiping: (e) => {
      setSwipeAmount(e.deltaX)
    },
    onSwipedLeft: () => {
      setIsTransitioning(true)
      router.push('/workout')
    },
    onSwipedRight: () => {
      setIsTransitioning(true)
      router.push('/prayer')
    },
    onTouchEndOrOnMouseUp: () => {
      setSwipeAmount(0)
    },
    preventScrollOnSwipe: true,
    trackMouse: true
  })

  const leftOpacity = Math.max(0, Math.min(1, swipeAmount / 100))
  const rightOpacity = Math.max(0, Math.min(1, -swipeAmount / 100))

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
    <SwipeNavigation
      leftPath="/prayer"
      rightPath="/workout"
      currentPage="Walk"
    >
      <div className="bg-gradient-to-b from-amber-50 via-orange-50 to-white">
        <div className="opacity-50 hover:opacity-100 transition-opacity duration-200">
          <MenuButton className="text-amber-700/50" />
        </div>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <link rel="apple-touch-icon" href="/icon.png" />
        </Head>
        
        <main className={`min-h-[calc(100vh-48px)] relative overflow-hidden
          ${isTransitioning ? 'transition-transform duration-300' : ''}
          transform translate-x-[${swipeAmount}px]`}
        >
          {!isExpanded && (
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-12 left-1/2 -translate-x-1/2 text-amber-400">
                <Sun size={64} className="animate-pulse" />
              </div>
              <div className="absolute top-24 left-12 text-amber-200/70">
                <Cloud size={32} className="animate-bounce" />
              </div>
              <div className="absolute top-20 right-12 text-amber-200/70">
                <Bird size={24} className="animate-bounce" />
              </div>
            </div>
          )}

          <div className="relative w-full max-w-md mx-auto flex flex-col items-center gap-6 p-6 pt-32">
            {!isExpanded && (
              <div className="text-center space-y-2">
                <h1 className={`${playfair.className} text-4xl text-amber-800`}>
                  Morning Walk
                </h1>
                <p className={`${playfair.className} text-lg text-amber-700/90`}>
                  Embrace the fresh morning air and note any thoughts that arise
                </p>
              </div>
            )}

            <div className={`${isExpanded ? 'fixed top-6 left-1/2 -translate-x-1/2 z-50' : 'flex flex-col items-center gap-6 my-4'}`}>
              {(!isExpanded || timeLeft <= 60) && (
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`relative flex items-center justify-center ${isExpanded ? 'w-20 h-20' : 'w-36 h-36'} 
                             rounded-full bg-gradient-to-br from-amber-100 to-white shadow-lg border-2 border-amber-200/50
                             hover:from-amber-200 hover:to-amber-50 active:scale-95 transition-all duration-150`}
                >
                  <p className={`${dmSerif.className} ${isExpanded ? 'text-3xl' : 'text-5xl'} text-amber-800`}>
                    {formatTime(timeLeft)}
                  </p>
                </button>
              )}
            </div>

            <div className="w-full px-6">
              {isExpanded && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="fixed top-4 right-4 z-50 w-8 h-8 flex items-center justify-center
                            rounded-full bg-amber-100/80 text-amber-600 backdrop-blur-sm
                            hover:bg-amber-200/90 active:scale-95 transition-all duration-150"
                  aria-label="Close expanded view"
                >
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 14 14" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M13 1L1 13M1 1L13 13" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
              <textarea
                value={thoughts}
                onChange={handleThoughtsChange}
                onFocus={() => setIsExpanded(true)}
                onBlur={() => setIsExpanded(false)}
                placeholder="Brief thoughts that come to mind during your walk..."
                className={`${playfair.className} w-full 
                           ${isExpanded ? 'fixed inset-0 top-24 h-[60vh] px-6 py-4 rounded-lg' : 'h-24 py-2 px-6 rounded-full'} 
                           bg-white
                           border border-amber-200/50
                           text-amber-900 placeholder:text-amber-400/80
                           focus:outline-none
                           shadow-sm
                           resize-none
                           text-lg
                           transition-all duration-300 ease-in-out`}
              />
              {isExpanded && (
                <div className="fixed bottom-12 left-0 w-full flex justify-center pointer-events-none">
                  <Sun 
                    size={48} 
                    className="text-amber-300/70" 
                  />
                </div>
              )}
            </div>
          </div>
        </main>

        <style jsx global>{`
          @keyframes fly {
            0% {
              transform: translate(-100%, 0) rotate(10deg);
            }
            50% {
              transform: translate(0%, -20px) rotate(-5deg);
            }
            100% {
              transform: translate(100%, 0) rotate(10deg);
            }
          }
        `}</style>
      </div>
    </SwipeNavigation>
  )
}