'use client'

import { useEffect } from 'react'
import type { Anchor } from '../types'

interface SlideshowProps {
  anchors: Anchor[]
  currentSlide: number
  onClose: () => void
  onNextSlide: () => void
  onPrevSlide: () => void
}

export default function Slideshow({
  anchors,
  currentSlide,
  onClose,
  onNextSlide,
  onPrevSlide,
}: SlideshowProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    window.scrollTo(0, 0)
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  if (!anchors.length) return null
  const currentAnchor = anchors[currentSlide]
  if (!currentAnchor) return null

  return (
    <div className="fixed inset-0 bg-black/95 z-[9999] flex flex-col safe-area-inset">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 flex items-center justify-between px-4 py-4 bg-black/80 backdrop-blur-sm">
        <button
          onClick={onPrevSlide}
          className="p-2 text-white/90 active:text-white/60"
          aria-label="Previous"
        >
          ←
        </button>

        <button
          onClick={onClose}
          className="p-2 text-white/90 active:text-white/60"
          aria-label="Close"
        >
          ✕
        </button>

        <button
          onClick={onNextSlide}
          className="p-2 text-white/90 active:text-white/60"
          aria-label="Next"
        >
          →
        </button>
      </div>

      {/* Content - Now at top instead of centered */}
      <div className="flex-1 p-6 pt-8">
        <div className="w-full max-w-md mx-auto">
          <div className="text-sm text-white/60 mb-2 text-center">
            {currentAnchor.category}
          </div>
          <h2 className="text-2xl font-bold mb-4 text-white text-center">
            {currentAnchor.text}
          </h2>
          {currentAnchor.notes && (
            <p className="text-base text-white/80 text-center">
              {currentAnchor.notes}
            </p>
          )}
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="sticky bottom-0 flex justify-center gap-1 px-4 py-4 bg-black/80 backdrop-blur-sm">
        {anchors.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  )
} 