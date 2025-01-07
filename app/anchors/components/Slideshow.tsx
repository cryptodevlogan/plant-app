'use client'

import { useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Montserrat } from 'next/font/google'
import type { Anchor } from '../types'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700']
})

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

  const progress = ((currentSlide + 1) / anchors.length) * 100

  return (
    <div className="fixed inset-0 bg-[#1e3a8a]/95 backdrop-blur-xl z-[9999] flex flex-col safe-area-inset">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 px-6 pt-4 pb-2 bg-gradient-to-b from-black/20 to-transparent">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 active:bg-white/5 
                     transition-colors text-white/90"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-sm font-medium text-white/60">
            {currentSlide + 1} of {anchors.length}
          </div>
          <div className="w-9 h-9" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-white/10 relative">
        <div
          className="absolute inset-y-0 left-0 bg-white/80 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-xl mx-auto">
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={onPrevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-3 
                       rounded-full bg-white/10 hover:bg-white/20 active:bg-white/5 
                       backdrop-blur-xl border border-white/10 transition-all duration-200
                       transform hover:scale-105 active:scale-95"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={onNextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-3 
                       rounded-full bg-white/10 hover:bg-white/20 active:bg-white/5 
                       backdrop-blur-xl border border-white/10 transition-all duration-200
                       transform hover:scale-105 active:scale-95"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>

            {/* Touch Navigation Areas */}
            <div className="relative">
              {/* Left touch area */}
              <div
                onClick={onPrevSlide}
                className="absolute left-0 top-0 w-1/3 h-full cursor-pointer z-10"
              />
              {/* Right touch area */}
              <div
                onClick={onNextSlide}
                className="absolute right-0 top-0 w-1/3 h-full cursor-pointer z-10"
              />
              
              {/* Card Content */}
              <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10
                            transform transition-all duration-500">
                <div className="text-sm text-white/60 mb-4 text-center tracking-wide">
                  {currentAnchor.category}
                </div>
                <h2 className={`${montserrat.className} text-2xl font-bold mb-6 text-white text-center
                               leading-relaxed`}>
                  {currentAnchor.text}
                </h2>
                {currentAnchor.notes && (
                  <p className="text-lg text-white/80 text-center leading-relaxed">
                    {currentAnchor.notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="sticky bottom-8 px-6">
        <div className="flex justify-center gap-1.5 max-w-xl mx-auto">
          {anchors.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-6 bg-white' 
                  : 'w-1.5 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}