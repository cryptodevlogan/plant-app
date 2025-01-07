'use client'

import { useEffect, useCallback } from 'react'
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
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowRight') onNextSlide()
    if (e.key === 'ArrowLeft') onPrevSlide()
  }, [onClose, onNextSlide, onPrevSlide])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  const currentAnchor = anchors[currentSlide]

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="absolute inset-0 flex items-center justify-between p-4">
        {/* Previous Button */}
        <button
          onClick={onPrevSlide}
          className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label="Previous slide"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next Button */}
        <button
          onClick={onNextSlide}
          className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label="Next slide"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
        aria-label="Close slideshow"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Content */}
      <div className="text-white text-center p-8 max-w-2xl">
        <div className="mb-8">
          <div className="text-sm text-white/60 mb-1">{currentAnchor.category}</div>
          <h2 className="text-3xl font-bold mb-4">{currentAnchor.text}</h2>
          {currentAnchor.notes && (
            <p className="text-lg text-white/80">{currentAnchor.notes}</p>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2">
          {anchors.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentSlide ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 