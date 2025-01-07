'use client'

import { useState, useEffect } from 'react'
import { Montserrat } from 'next/font/google'
import { X, Plus, Pencil, XCircle, Check, Trash2 } from 'lucide-react'
import type { Anchor } from '../types'
import { Dispatch, SetStateAction } from 'react'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700']
})

interface AnchorModalProps {
  isOpen: boolean
  onClose: () => void
  anchors: Anchor[]
  setAnchors: Dispatch<SetStateAction<Anchor[]>>
  suggestions: {
    category: string
    items: {
      title: string
      description: string
    }[]
  }[]
}

export default function AnchorModal({
  isOpen,
  onClose,
  anchors,
  setAnchors,
  suggestions
}: AnchorModalProps) {
  const [editingAnchor, setEditingAnchor] = useState<Anchor | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [editForm, setEditForm] = useState({
    category: '',
    text: '',
    notes: ''
  })
  const [inactiveAnchors, setInactiveAnchors] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  // Load anchors from localStorage on initial mount
  useEffect(() => {
    const savedAnchors = localStorage.getItem('anchors')
    const savedInactiveAnchors = localStorage.getItem('inactiveAnchors')
    
    if (savedAnchors) {
      setAnchors(JSON.parse(savedAnchors))
    }
    
    if (savedInactiveAnchors) {
      setInactiveAnchors(new Set(JSON.parse(savedInactiveAnchors)))
    }
  }, [setAnchors])

  // Save anchors whenever they change
  useEffect(() => {
    localStorage.setItem('anchors', JSON.stringify(anchors))
  }, [anchors])

  // Save inactive anchors whenever they change
  useEffect(() => {
    localStorage.setItem('inactiveAnchors', 
      JSON.stringify(Array.from(inactiveAnchors)))
  }, [inactiveAnchors])

  if (!isOpen) return null

  const handleCreateNew = () => {
    const newAnchor: Anchor = {
      id: crypto.randomUUID(),
      category: editForm.category,
      text: editForm.text,
      notes: editForm.notes || undefined
    }
    setAnchors(prev => [newAnchor, ...prev])
    setEditForm({ category: '', text: '', notes: '' })
    setIsCreating(false)
  }

  const handleEditSave = () => {
    if (!editingAnchor) return

    const updatedAnchor: Anchor = {
      id: editingAnchor.id,
      category: editForm.category,
      text: editForm.text,
      notes: editForm.notes || undefined
    }

    setAnchors(prev =>
      prev.map(a => (a.id === editingAnchor.id ? updatedAnchor : a))
    )

    setEditingAnchor(null)
    setEditForm({ category: '', text: '', notes: '' })
  }

  const handleEditClick = (anchor: Anchor) => {
    setEditingAnchor(anchor)
    setEditForm({
      category: anchor.category,
      text: anchor.text,
      notes: anchor.notes || ''
    })
  }

  const handleDeactivate = (anchor: Anchor) => {
    setInactiveAnchors(prev => {
      const newSet = new Set(prev)
      newSet.add(anchor.id)
      return newSet
    })
  }

  const handleActivate = (anchor: Anchor) => {
    setInactiveAnchors(prev => {
      const newSet = new Set(prev)
      newSet.delete(anchor.id)
      return newSet
    })
  }

  // Group anchors by category and sort within categories
  const anchorsByCategory = anchors.reduce((acc, anchor) => {
    if (!acc[anchor.category]) acc[anchor.category] = []
    acc[anchor.category].push(anchor)
    return acc
  }, {} as Record<string, Anchor[]>)

  // Sort anchors within each category - active first, then inactive
  Object.keys(anchorsByCategory).forEach(category => {
    anchorsByCategory[category].sort((a, b) => {
      const aInactive = inactiveAnchors.has(a.id)
      const bInactive = inactiveAnchors.has(b.id)
      if (aInactive === bInactive) return 0
      return aInactive ? 1 : -1
    })
  })

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[9999] overflow-y-auto">
      <div className="min-h-screen px-6 py-8">
        <div className="w-full max-w-xl mx-auto bg-[#1e3a8a] rounded-3xl shadow-2xl 
                     border border-white/10 overflow-hidden">
          {/* Modal Header */}
          <div className="sticky top-0 z-10 bg-white/5 backdrop-blur-xl border-b border-white/10 
                       px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className={`${montserrat.className} text-xl font-bold text-white`}>
                {isCreating ? 'New Anchor' : editingAnchor ? 'Edit Anchor' : 'Your Anchors'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-full hover:bg-white/10 active:bg-white/5 
                         transition-colors text-white/90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* Create New Button */}
            {!isCreating && !editingAnchor && (
              <button
                onClick={() => {
                  setIsCreating(true)
                  setEditForm({
                    category: 'Personal',
                    text: '',
                    notes: ''
                  })
                }}
                className="w-full p-4 rounded-2xl bg-white/10 hover:bg-white/15 
                         active:bg-white/5 backdrop-blur-sm border border-white/10 
                         transition-all duration-200 transform hover:scale-[1.02] 
                         active:scale-[0.98] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center 
                               justify-center group-hover:bg-white/20 transition-colors">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-medium">Create New Anchor</span>
                </div>
              </button>
            )}

            {/* Edit Form */}
            {(isCreating || editingAnchor) && (
              <div className="space-y-4 bg-white/5 rounded-2xl p-6 backdrop-blur-sm 
                           border border-white/10">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm(prev => ({ ...prev, category: e.target.value }))
                    }
                    className="w-full p-3 rounded-xl bg-white/10 border border-white/10 
                             text-white placeholder-white/40 focus:outline-none 
                             focus:ring-2 focus:ring-white/20"
                  >
                    <option value="Personal" className="bg-[#1e3a8a] text-white">
                      Personal
                    </option>
                    <option disabled className="bg-[#1e3a8a] text-white/50">
                      ──────────
                    </option>
                    {suggestions.map(cat => (
                      <option key={cat.category} value={cat.category}
                             className="bg-[#1e3a8a] text-white">
                        {cat.category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Text</label>
                  <input
                    type="text"
                    value={editForm.text}
                    onChange={(e) =>
                      setEditForm(prev => ({ ...prev, text: e.target.value }))
                    }
                    className="w-full p-3 rounded-xl bg-white/10 border border-white/10 
                             text-white placeholder-white/40 focus:outline-none 
                             focus:ring-2 focus:ring-white/20"
                    placeholder="Enter anchor text"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Notes (Optional)</label>
                  <textarea
                    value={editForm.notes}
                    onChange={(e) =>
                      setEditForm(prev => ({ ...prev, notes: e.target.value }))
                    }
                    className="w-full p-3 rounded-xl bg-white/10 border border-white/10 
                             text-white placeholder-white/40 focus:outline-none 
                             focus:ring-2 focus:ring-white/20 min-h-[100px] resize-none"
                    placeholder="Add additional notes"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={isCreating ? handleCreateNew : handleEditSave}
                    disabled={!editForm.category || !editForm.text}
                    className="flex-1 p-3 rounded-xl bg-white/20 hover:bg-white/30 
                             active:bg-white/10 backdrop-blur-sm text-white font-medium 
                             transition-all duration-200 disabled:opacity-50 
                             disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    {isCreating ? 'Create' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setIsCreating(false)
                      setEditingAnchor(null)
                      setEditForm({ category: '', text: '', notes: '' })
                    }}
                    className="flex-1 p-3 rounded-xl bg-white/10 hover:bg-white/15 
                             active:bg-white/5 backdrop-blur-sm text-white font-medium 
                             transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Existing Anchors List */}
            {!isCreating && !editingAnchor && (
              <div className="space-y-6">
                {/* Personal Category First */}
                {anchorsByCategory['Personal'] && (
                  <div key="Personal" className="space-y-3">
                    <h3 className={`${montserrat.className} text-sm font-semibold text-white/60`}>
                      Personal
                    </h3>
                    <div className="space-y-2">
                      {anchorsByCategory['Personal'].map(anchor => (
                        <div
                          key={anchor.id}
                          className={`p-4 rounded-xl transition-all duration-200 relative ${
                            inactiveAnchors.has(anchor.id)
                              ? 'bg-white/5 border border-dashed border-white/20'
                              : 'bg-white/10'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-white font-medium mb-1">{anchor.text}</p>
                                {inactiveAnchors.has(anchor.id) && (
                                  <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-white/60">
                                    Inactive
                                  </span>
                                )}
                              </div>
                              {anchor.notes && (
                                <p className="text-sm text-white/60">{anchor.notes}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditClick(anchor)}
                                className="p-2 rounded-full hover:bg-white/10 active:bg-white/5 
                                         transition-colors text-white/80"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  inactiveAnchors.has(anchor.id)
                                    ? handleActivate(anchor)
                                    : handleDeactivate(anchor)
                                }
                                className={`p-2 rounded-full transition-all duration-200 ${
                                  inactiveAnchors.has(anchor.id)
                                    ? 'bg-white/5 hover:bg-white/10 text-white/60'
                                    : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                                }`}
                                title={inactiveAnchors.has(anchor.id) ? "Activate" : "Deactivate"}
                              >
                                <div className="relative">
                                  {inactiveAnchors.has(anchor.id) ? (
                                    <div className="w-4 h-4 relative">
                                      <div className="absolute inset-0 rounded-full border-2 border-white/60 border-dashed animate-[spin_3s_linear_infinite]"></div>
                                    </div>
                                  ) : (
                                    <div className="w-4 h-4 rounded-full border-2 border-green-400"></div>
                                  )}
                                </div>
                              </button>
                              <button
                                onClick={() => {
                                  setAnchors(prev => prev.filter(a => a.id !== anchor.id))
                                  setInactiveAnchors(prev => {
                                    const newSet = new Set(prev)
                                    newSet.delete(anchor.id)
                                    return newSet
                                  })
                                }}
                                className="p-2 rounded-full hover:bg-white/10 active:bg-white/5 
                                         transition-colors text-white/80"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Divider after Personal category if it exists */}
                {anchorsByCategory['Personal'] && (
                  <div className="h-px bg-gradient-to-r from-white/0 via-white/10 to-white/0"></div>
                )}

                {/* Other Categories */}
                {Object.entries(anchorsByCategory)
                  .filter(([category]) => category !== 'Personal')
                  .map(([category, categoryAnchors]) => (
                    <div key={category} className="space-y-3">
                      <h3 className={`${montserrat.className} text-sm font-semibold text-white/60`}>
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {categoryAnchors.map(anchor => (
                          <div
                            key={anchor.id}
                            className={`p-4 rounded-xl transition-all duration-200 relative ${
                              inactiveAnchors.has(anchor.id)
                                ? 'bg-white/5 border border-dashed border-white/20'
                                : 'bg-white/10'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-white font-medium mb-1">{anchor.text}</p>
                                  {inactiveAnchors.has(anchor.id) && (
                                    <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-white/60">
                                      Inactive
                                    </span>
                                  )}
                                </div>
                                {anchor.notes && (
                                  <p className="text-sm text-white/60">{anchor.notes}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditClick(anchor)}
                                  className="p-2 rounded-full hover:bg-white/10 active:bg-white/5 
                                           transition-colors text-white/80"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    inactiveAnchors.has(anchor.id)
                                      ? handleActivate(anchor)
                                      : handleDeactivate(anchor)
                                  }
                                  className={`p-2 rounded-full transition-all duration-200 ${
                                    inactiveAnchors.has(anchor.id)
                                      ? 'bg-white/5 hover:bg-white/10 text-white/60'
                                      : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                                  }`}
                                  title={inactiveAnchors.has(anchor.id) ? "Activate" : "Deactivate"}
                                >
                                  <div className="relative">
                                    {inactiveAnchors.has(anchor.id) ? (
                                      <div className="w-4 h-4 relative">
                                        <div className="absolute inset-0 rounded-full border-2 border-white/60 border-dashed animate-[spin_3s_linear_infinite]"></div>
                                      </div>
                                    ) : (
                                      <div className="w-4 h-4 rounded-full border-2 border-green-400"></div>
                                    )}
                                  </div>
                                </button>
                                <button
                                  onClick={() => {
                                    setAnchors(prev => prev.filter(a => a.id !== anchor.id))
                                    setInactiveAnchors(prev => {
                                      const newSet = new Set(prev)
                                      newSet.delete(anchor.id)
                                      return newSet
                                    })
                                  }}
                                  className="p-2 rounded-full hover:bg-white/10 active:bg-white/5 
                                           transition-colors text-white/80"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}