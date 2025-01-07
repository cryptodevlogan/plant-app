'use client'

import { useState } from 'react'
import { Montserrat } from 'next/font/google'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  ArrowLeft, 
  ArrowRight, 
  Home,
  Play, 
  ChevronRight,
  Target,
  Sparkles,
  Heart,
  Users,
  Leaf
} from 'lucide-react'
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

  const getCategoryColors = (category: string): { from: string, to: string } => {
    switch (category) {
      case 'Personal':
        return { from: 'from-indigo-500/30', to: 'to-indigo-600/20' }
      case 'Self-Improvement & Discipline':
        return { from: 'from-purple-500/30', to: 'to-purple-600/20' }
      case 'Perspective & Gratitude':
        return { from: 'from-amber-500/30', to: 'to-amber-600/20' }
      case 'Emotional Resilience':
        return { from: 'from-rose-500/30', to: 'to-rose-600/20' }
      case 'Community & Relationships':
        return { from: 'from-cyan-500/30', to: 'to-cyan-600/20' }
      default:
        return { from: 'from-emerald-500/30', to: 'to-emerald-600/20' }
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Personal':
        return <Heart className="w-6 h-6" />
      case 'Self-Improvement & Discipline':
        return <Target className="w-6 h-6" />
      case 'Perspective & Gratitude':
        return <Sparkles className="w-6 h-6" />
      case 'Emotional Resilience':
        return <Heart className="w-6 h-6" />
      case 'Community & Relationships':
        return <Users className="w-6 h-6" />
      default:
        return <Leaf className="w-6 h-6" />
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1e3a8a] via-[#1e3a8a] to-[#312e81]">
      {/* Translucent Header */}
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-[#1e3a8a]/10 px-6 py-4 border-b border-white/10">
        <div className="flex justify-between items-center max-w-xl mx-auto">
          <button
            onClick={() => router.push('/')}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 active:bg-white/5 transition-colors text-white/90"
          >
            <Home className="w-5 h-5" />
          </button>
          <h1 className={`${montserrat.className} text-xl font-bold text-white/90`}>
            Memory Anchors
          </h1>
          <button
            onClick={() => setIsEditMode(true)}
            className="p-2 -mr-2 rounded-full hover:bg-white/10 active:bg-white/5 transition-colors text-white/90"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 pt-6 pb-32 space-y-6 max-w-xl mx-auto">
        {/* Featured Card - Center Yourself */}
        <button
          onClick={() => handleStartSlideshow(null)}
          className="w-full p-6 rounded-3xl bg-white/10 hover:bg-white/15 active:bg-white/5 
                     backdrop-blur-lg border border-white/20 transition-all duration-300 
                     transform hover:scale-[1.02] active:scale-[0.98] group relative
                     overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 
                        translate-x-[-200%] group-hover:translate-x-[200%] transition-transform 
                        duration-1000"></div>
          <div className="relative flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/40 to-purple-600/20 
                          flex items-center justify-center group-hover:from-purple-500/50 
                          group-hover:to-purple-600/30 transition-all duration-300 
                          border border-purple-400/20">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
            <div className="flex-1 text-left">
              <h2 className={`${montserrat.className} text-xl font-bold text-white mb-1`}>
                Center Yourself
              </h2>
              <p className="text-white/60">
                Pause, reflect, and realign
              </p>
            </div>
            <ChevronRight className="w-6 h-6 text-white/40 group-hover:text-white/60 
                                   group-hover:translate-x-1 transition-all" />
          </div>
        </button>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-4">
          {/* Personal Category First */}
          <div className="space-y-4">
            {/* Personal Category Header */}
            <button
              onClick={() => handleStartSlideshow('Personal')}
              className="w-full p-5 rounded-2xl bg-white/10 hover:bg-white/15 active:bg-white/5 
                       backdrop-blur-md border border-white/10 transition-all duration-200 
                       transform hover:scale-[1.02] active:scale-[0.98] group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/30 
                             to-indigo-600/20 flex items-center justify-center 
                             group-hover:opacity-100 opacity-90 transition-all duration-300 
                             border border-white/10 text-white/90">
                  <Heart className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className={`${montserrat.className} text-lg font-semibold text-white 
                                group-hover:text-white/90 transition-colors`}>
                    Personal
                  </h3>
                  <p className="text-sm text-white/50 group-hover:text-white/60 transition-colors">
                    {anchors.filter(a => a.category === 'Personal').length} anchors
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/60 
                                     group-hover:translate-x-1 transition-all" />
              </div>
            </button>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-white/0 via-white/10 to-white/0"></div>
          </div>

          {/* Other Categories */}
          {anchorData.suggestions.map((category) => {
            const count = anchors.filter(a => a.category === category.category).length
            return (
              <button
                key={category.category}
                onClick={() => handleStartSlideshow(category.category)}
                className="p-5 rounded-2xl bg-white/10 hover:bg-white/15 active:bg-white/5 
                         backdrop-blur-md border border-white/10 transition-all duration-200 
                         transform hover:scale-[1.02] active:scale-[0.98] group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryColors(category.category).from} 
                               ${getCategoryColors(category.category).to} flex items-center justify-center 
                               group-hover:opacity-100 opacity-90 transition-all duration-300 
                               border border-white/10 text-white/90`}>
                    {getCategoryIcon(category.category)}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className={`${montserrat.className} text-lg font-semibold text-white 
                                  group-hover:text-white/90 transition-colors`}>
                      {category.category}
                    </h3>
                    <p className="text-sm text-white/50 group-hover:text-white/60 transition-colors">
                      {count} {count === 1 ? 'anchor' : 'anchors'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/60 
                                       group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* iOS-style Bottom Navigation */}
      <div className="fixed bottom-8 inset-x-0 px-6">
        <div className="max-w-xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 
                       p-4 flex justify-between">
            <button
              onClick={() => router.push('/workout')}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors px-3"
            >
              <ArrowLeft className="w-[18px] h-[18px]" />
              <span className={`${montserrat.className} text-sm font-medium`}>Workout</span>
            </button>
            <button
              onClick={() => router.push('/tasks')}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors px-3"
            >
              <span className={`${montserrat.className} text-sm font-medium`}>Tasks</span>
              <ArrowRight className="w-[18px] h-[18px]" />
            </button>
          </div>
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