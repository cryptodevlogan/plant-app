'use client'

import { useState } from 'react'
import anchorData from './anchors.json'
import AnchorModal from './components/AnchorModal'
import Slideshow from './components/Slideshow'

interface Anchor {
  id: string
  category: string
  text: string
  notes?: string
}

export default function AnchorsPage() {
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

  // Filter anchors for slideshow based on selected category
  const slideshowAnchors = currentCategory 
    ? anchors.filter(anchor => anchor.category === currentCategory)
    : anchors

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      {/* Header */}
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Daily Anchors</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setIsEditMode(true)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Add/Edit Anchors
            </button>
            {anchors.length > 0 && (
              <button
                onClick={() => {
                  setCurrentCategory(null) // Show all anchors
                  setIsSlideshow(true)
                }}
                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
              >
                Start Full Slideshow
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">My Anchors</h2>
        <div className="space-y-8">
          {Object.entries(
            anchors.reduce((acc, anchor) => {
              if (!acc[anchor.category]) acc[anchor.category] = []
              acc[anchor.category].push(anchor)
              return acc
            }, {} as Record<string, Anchor[]>)
          ).map(([category, categoryAnchors]) => (
            <div key={category} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{category}</h3>
                <button
                  onClick={() => {
                    setCurrentCategory(category)
                    setCurrentSlide(0)
                    setIsSlideshow(true)
                  }}
                  className="px-3 py-1 bg-indigo-500 text-white text-sm rounded-md hover:bg-indigo-600 transition-colors"
                >
                  View Section Slideshow
                </button>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categoryAnchors.map((anchor) => (
                  <div 
                    key={anchor.id} 
                    className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-medium text-gray-900 mb-2">{anchor.text}</h4>
                    {anchor.notes && (
                      <p className="text-gray-600 text-sm">{anchor.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

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
    </div>
  )
}
