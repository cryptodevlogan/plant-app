'use client'

import { useState } from 'react'
import { Montserrat, Inter } from 'next/font/google'
import { useRouter } from 'next/navigation'
import anchorData from './anchors.json'
import AnchorModal from './components/AnchorModal'
import Slideshow from './components/Slideshow'
import { Plus, PlayCircle, Home, ArrowLeft, ArrowRight } from 'lucide-react'
import type { Anchor } from './types'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600', '700']
})

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500']
})

export default function AnchorsPage() {
  const router = useRouter()
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
  const [isSlideshow, setIsSlideshow] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<string | null>(null)

  const slideshowAnchors = currentCategory 
    ? anchors.filter(anchor => anchor.category === currentCategory)
    : anchors

  const handleStartSlideshow = (category: string | null) => {
    console.log('Starting slideshow for category:', category)
    console.log('Available anchors:', anchors.length)
    
    setCurrentCategory(category)
    setCurrentSlide(0)
    setIsSlideshow(true)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50/80 via-orange-50/50 to-white overflow-auto pb-24">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-white/70 border-b border-amber-100/50 px-4 py-3">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/')}
            className="p-2.5 -ml-2.5 rounded-full hover:bg-amber-100/50 text-amber-700 transition-colors active:bg-amber-200/50"
            aria-label="Go to Home"
          >
            <Home className="w-[18px] h-[18px]" />
          </button>
          <h1 className={`${montserrat.className} text-lg font-bold text-amber-900 tracking-tight`}>
            Daily Anchors
          </h1>
          <div className="flex gap-1.5">
            <button
              onClick={() => setIsEditMode(true)}
              className="p-2.5 rounded-full hover:bg-amber-100/50 text-amber-700 transition-colors active:bg-amber-200/50"
              aria-label="Add or Edit Anchors"
            >
              <Plus className="w-[18px] h-[18px]" />
            </button>
            {anchors.length > 0 && (
              <button
                onClick={() => handleStartSlideshow(null)}
                className="p-2.5 rounded-full hover:bg-amber-100/50 text-amber-700 transition-colors active:bg-amber-200/50"
                aria-label="Start Slideshow"
              >
                <PlayCircle className="w-[18px] h-[18px]" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Enhanced Main Content */}
      <div className="px-4 py-6 max-w-4xl mx-auto">
        <div className="space-y-8">
          {Object.entries(
            anchors.reduce((acc, anchor) => {
              if (!acc[anchor.category]) acc[anchor.category] = []
              acc[anchor.category].push(anchor)
              return acc
            }, {} as Record<string, Anchor[]>)
          ).map(([category, categoryAnchors]) => (
            <section key={category} className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <h2 className={`${montserrat.className} text-base font-semibold text-amber-800/90`}>
                  {category}
                </h2>
                <button
                  onClick={() => handleStartSlideshow(category)}
                  className="text-sm text-amber-600/90 hover:text-amber-800 transition-colors active:text-amber-900 px-3 py-1.5 rounded-full hover:bg-amber-50/50 flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {categoryAnchors.map((anchor) => (
                  <div 
                    key={anchor.id} 
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-amber-100/50 
                             hover:shadow-md hover:bg-white transition-all duration-200 active:scale-[0.98]"
                  >
                    <h3 className={`${inter.className} font-medium text-amber-900/90 mb-2`}>
                      {anchor.text}
                    </h3>
                    {anchor.notes && (
                      <p className={`${inter.className} text-sm text-amber-600/80 leading-relaxed`}>
                        {anchor.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Enhanced Bottom Navigation */}
      <div className="fixed bottom-8 inset-x-0 px-4 z-20">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-amber-100/50 
                      p-4 flex justify-between max-w-md mx-auto">
          <button
            onClick={() => router.push('/workout')}
            className="flex items-center gap-2 text-amber-600/90 hover:text-amber-800 transition-colors px-2"
          >
            <ArrowLeft className="w-[18px] h-[18px]" />
            <span className={`${inter.className} text-sm font-medium`}>Workout</span>
          </button>
          <button
            onClick={() => router.push('/tasks')}
            className="flex items-center gap-2 text-amber-600/90 hover:text-amber-800 transition-colors px-2"
          >
            <span className={`${inter.className} text-sm font-medium`}>Tasks</span>
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