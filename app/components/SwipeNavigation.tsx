'use client'
import { useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SwipeNavigationProps {
  leftPath: string
  rightPath: string
  currentPage: 'Tea' | 'Prayer' | 'Walk' | 'Workout' | 'Anchors' | 'Tasks' | 'Notes'
  children: React.ReactNode
}

export default function SwipeNavigation({ leftPath, rightPath, currentPage, children }: SwipeNavigationProps) {
  const router = useRouter()
  const [swipeAmount, setSwipeAmount] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isSwiping, setIsSwiping] = useState(false)

  const handlers = useSwipeable({
    onSwiping: (e) => {
      setSwipeAmount(e.deltaX)
      setIsSwiping(true)
    },
    onSwipedLeft: () => {
      setIsTransitioning(true)
      router.push(rightPath)
    },
    onSwipedRight: () => {
      setIsTransitioning(true)
      router.push(leftPath)
    },
    onTouchEndOrOnMouseUp: () => {
      setSwipeAmount(0)
      setIsSwiping(false)
    },
    preventScrollOnSwipe: true,
    trackMouse: true
  })

  const leftOpacity = Math.max(0, Math.min(1, swipeAmount / 100))
  const rightOpacity = Math.max(0, Math.min(1, -swipeAmount / 100))

  const pages = ['Tea', 'Prayer', 'Walk', 'Workout', 'Anchors', 'Tasks', 'Notes']
  const currentIndex = pages.indexOf(currentPage)

  return (
    <div {...handlers} className={`
      ${isTransitioning ? 'transition-transform duration-300' : ''}
      transform translate-x-[${swipeAmount}px]
    `}>
      {children}

      {/* Swipe Direction Indicators */}
      <div className="fixed inset-y-0 left-4 flex items-center pointer-events-none">
        <div 
          className="bg-amber-500/20 p-3 rounded-full transition-opacity duration-200"
          style={{ opacity: leftOpacity }}
        >
          <ChevronLeft size={24} className="text-amber-800" />
        </div>
      </div>
      <div className="fixed inset-y-0 right-4 flex items-center pointer-events-none">
        <div 
          className="bg-amber-500/20 p-3 rounded-full transition-opacity duration-200"
          style={{ opacity: rightOpacity }}
        >
          <ChevronRight size={24} className="text-amber-800" />
        </div>
      </div>

      {/* Page Indicators */}
      {isSwiping && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-2 transition-opacity duration-200">
          <div className="flex gap-2 bg-amber-500/20 px-4 py-2 rounded-full">
            {currentIndex > 0 && (
              <span className="text-sm text-amber-800/60">{pages[currentIndex - 1]}</span>
            )}
            <span className="text-sm text-amber-800">{currentPage}</span>
            {currentIndex < pages.length - 1 && (
              <span className="text-sm text-amber-800/60">{pages[currentIndex + 1]}</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 