'use client'

import { useState } from 'react'
import { Montserrat } from 'next/font/google'
import { useRouter } from 'next/navigation'
import { Plus, ArrowLeft, ArrowRight, Home } from 'lucide-react'
import anchorData from './anchors.json'
import AnchorModal from './components/AnchorModal'
import Slideshow from './components/Slideshow'
import type { Anchor } from './types'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600', '700']
})

export default function AnchorsPage() {
  const router = useRouter()
  const [isSlideshow, setIsSlideshow] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<string | null>(null)
  const [anchors, setAnchors] = useState<Anchor[]>(() => {
    return anchorData.suggestions.flatMap(category =>
      category.items.map(item => ({
        id: crypto.randomUUID(),
        category: category.category,
        text: item.title,
        notes: item.description
      }))
    )
  })

  const slideshowAnchors = currentCategory 
    ? anchors.filter(anchor => anchor.category === currentCategory)
    : anchors

  const handleStartSlideshow = (category: string | null) => {
    setCurrentCategory(category)
    setCurrentSlide(0)
    setIsSlideshow(true)
  }

  return (
    <main className="min-h-screen bg-[#1e3a8a]">
      {/* Header - Updated with Home button */}
      <header className="sticky top-0 z-20 backdrop-blur-lg bg-[#1e3a8a]/80 px-4 py-4 border-b border-white/10">
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.push('/')}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 active:bg-white/5 
                     transition-all duration-200 text-white/90"
          >
            <Home className="w-5 h-5" />
          </button>
          <h1 className={`${montserrat.className} text-xl font-bold text-white/90`}>
            Memory Anchors
          </h1>
          <button
            onClick={() => setIsEditMode(true)}
            className="p-2 -mr-2 rounded-full hover:bg-white/10 active:bg-white/5 
                     transition-all duration-200 text-white/90"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content - Enhanced Layout */}
      <div className="p-6 space-y-6 max-w-md mx-auto pb-32">
        {/* Play All - More Prominent */}
        <button
          onClick={() => handleStartSlideshow(null)}
          className="w-full p-5 rounded-2xl bg-white/15 hover:bg-white/20 
                   active:bg-white/10 backdrop-blur-sm border border-white/20 
                   transition-all duration-200 transform hover:scale-[1.02] 
                   active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center 
                           justify-center text-white">
                ▶️
              </div>
              <div>
                <h2 className={`${montserrat.className} text-lg font-bold text-white`}>
                  Play All Anchors
                </h2>
                <p className="text-sm text-white/60 mt-0.5">
                  Start your memory journey
                </p>
              </div>
            </div>
            <span className="text-white/60 text-sm font-medium px-3 py-1 
                         bg-white/10 rounded-full">
              {anchors.length}
            </span>
          </div>
        </button>

        {/* Categories - Enhanced Cards */}
        <div className="space-y-3">
          {anchorData.suggestions.map((category) => {
            const count = anchors.filter(a => a.category === category.category).length;
            return (
              <button
                key={category.category}
                onClick={() => handleStartSlideshow(category.category)}
                className="w-full p-4 rounded-xl bg-white/10 hover:bg-white/15 
                         active:bg-white/5 backdrop-blur-sm border border-white/10 
                         transition-all duration-200 transform hover:scale-[1.02] 
                         active:scale-[0.98] group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center 
                                justify-center text-white/60 group-hover:text-white/80 
                                transition-colors">
                      📍
                    </div>
                    <div className="text-left">
                      <h2 className={`${montserrat.className} text-base font-semibold 
                                  text-white group-hover:text-white/90 transition-colors`}>
                        {category.category}
                      </h2>
                      <p className="text-sm text-white/50 group-hover:text-white/60 
                                transition-colors">
                        {count} {count === 1 ? 'anchor' : 'anchors'}
                      </p>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-white/60" />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Bottom Navigation - Updated with Tasks route */}
      <div className="fixed bottom-8 inset-x-0 px-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 
                     p-4 flex justify-between max-w-md mx-auto">
          <button
            onClick={() => router.push('/workout')}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors px-2"
          >
            <ArrowLeft className="w-[18px] h-[18px]" />
            <span className={`${montserrat.className} text-sm font-medium`}>Workout</span>
          </button>
          <button
            onClick={() => router.push('/tasks')}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors px-2"
          >
            <span className={`${montserrat.className} text-sm font-medium`}>Tasks</span>
            <ArrowRight className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <AnchorModal
        isOpen={isEditMode}
        onClose={() => setIsEditMode(false)}
        anchors={anchors}
        setAnchors={setAnchors}
        suggestions={anchorData.suggestions}
      />

      {isSlideshow && (
        <Slideshow
          anchors={slideshowAnchors}
          currentSlide={currentSlide}
          onClose={() => {
            setIsSlideshow(false)
            setCurrentSlide(0)
            setCurrentCategory(null)
          }}
          onNextSlide={() => setCurrentSlide((prev) => (prev + 1) % slideshowAnchors.length)}
          onPrevSlide={() => setCurrentSlide((prev) => (prev - 1 + slideshowAnchors.length) % slideshowAnchors.length)}
        />
      )}
    </main>
  )
}