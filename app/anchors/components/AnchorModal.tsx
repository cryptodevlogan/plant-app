'use client'

import { useState } from 'react'
import type { Anchor } from '../types'
import { Dispatch, SetStateAction } from 'react'

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

  const handleCreateNew = () => {
    const newAnchor: Anchor = {
      id: crypto.randomUUID(),
      category: editForm.category,
      text: editForm.text,
      notes: editForm.notes || undefined
    }
    setAnchors(prev => [...prev, newAnchor])
    setEditForm({ category: '', text: '', notes: '' })
    setIsCreating(false)
  }

  if (!isOpen) return null

  const handleEditClick = (anchor: Anchor) => {
    setEditingAnchor(anchor)
    setEditForm({
      category: anchor.category,
      text: anchor.text,
      notes: anchor.notes || ''
    })
  }

  const handleEditSave = () => {
    if (!editingAnchor) return

    const updatedAnchor: Anchor = {
      id: editingAnchor.id,
      category: editForm.category,
      text: editForm.text,
      notes: editForm.notes || undefined
    }

    setAnchors(prev => prev.map(a => 
      a.id === editingAnchor.id ? updatedAnchor : a
    ))
    
    setEditingAnchor(null)
    setEditForm({ category: '', text: '', notes: '' })
  }

  const handleEditCancel = () => {
    setEditingAnchor(null)
    setEditForm({ category: '', text: '', notes: '' })
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

  // Group and sort anchors by category, with inactive ones at the bottom
  const anchorsByCategory = anchors.reduce((acc, anchor) => {
    if (!acc[anchor.category]) acc[anchor.category] = []
    acc[anchor.category].push(anchor)
    return acc
  }, {} as Record<string, Anchor[]>)

  // Sort each category's anchors
  Object.keys(anchorsByCategory).forEach(category => {
    anchorsByCategory[category].sort((a, b) => {
      const aInactive = inactiveAnchors.has(a.id)
      const bInactive = inactiveAnchors.has(b.id)
      if (aInactive === bInactive) return 0
      return aInactive ? 1 : -1
    })
  })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Manage Your Anchors</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-8">
            {!isCreating ? (
              <button
                onClick={() => {
                  setIsCreating(true)
                  setEditForm({ category: suggestions[0]?.category || '', text: '', notes: '' })
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Create New Anchor
              </button>
            ) : (
              <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
                <h3 className="font-medium text-gray-900">Create New Anchor</h3>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border rounded"
                >
                  {suggestions.map(cat => (
                    <option key={cat.category} value={cat.category}>
                      {cat.category}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={editForm.text}
                  onChange={(e) => setEditForm(prev => ({ ...prev, text: e.target.value }))}
                  className="w-full p-2 border rounded"
                  placeholder="Anchor text"
                />
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full p-2 border rounded"
                  placeholder="Notes (optional)"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleCreateNew}
                    disabled={!editForm.category || !editForm.text}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setIsCreating(false)
                      setEditForm({ category: '', text: '', notes: '' })
                    }}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {Object.entries(anchorsByCategory).map(([category, categoryAnchors]) => (
              <div key={category} className="border rounded-lg p-4">
                <h4 className="font-medium mb-4">{category}</h4>
                <div className="space-y-3">
                  {categoryAnchors.map(anchor => (
                    <div 
                      key={anchor.id} 
                      className={`flex justify-between items-start p-3 rounded transition-all ${
                        inactiveAnchors.has(anchor.id) 
                          ? 'bg-gray-100 opacity-50 border border-dashed border-gray-300 relative' 
                          : 'bg-gray-50'
                      }`}
                    >
                      {inactiveAnchors.has(anchor.id) && (
                        <div className="absolute -top-2 right-2 px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">
                          Inactive
                        </div>
                      )}
                      {editingAnchor?.id === anchor.id ? (
                        <div className="w-full space-y-2">
                          <select
                            value={editForm.category}
                            onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full p-2 border rounded"
                          >
                            {suggestions.map(cat => (
                              <option key={cat.category} value={cat.category}>
                                {cat.category}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={editForm.text}
                            onChange={(e) => setEditForm(prev => ({ ...prev, text: e.target.value }))}
                            className="w-full p-2 border rounded"
                            placeholder="Anchor text"
                          />
                          <textarea
                            value={editForm.notes}
                            onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                            className="w-full p-2 border rounded"
                            placeholder="Notes (optional)"
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={handleEditSave}
                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleEditCancel}
                              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className={inactiveAnchors.has(anchor.id) ? 'italic' : ''}>
                            <p className={`font-medium ${inactiveAnchors.has(anchor.id) ? 'text-gray-500' : 'text-gray-900'}`}>
                              {anchor.text}
                            </p>
                            {anchor.notes && (
                              <p className={`text-sm ${inactiveAnchors.has(anchor.id) ? 'text-gray-400' : 'text-gray-600'}`}>
                                {anchor.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-3 items-center">
                            <button
                              onClick={() => handleEditClick(anchor)}
                              className="text-blue-500 hover:text-blue-600"
                              title="Edit"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            {inactiveAnchors.has(anchor.id) ? (
                              <button
                                onClick={() => handleActivate(anchor)}
                                className="text-green-500 hover:text-green-600"
                                title="Activate"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDeactivate(anchor)}
                                className="text-yellow-500 hover:text-yellow-600"
                                title="Deactivate"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setAnchors(prev => prev.filter(a => a.id !== anchor.id))
                                setInactiveAnchors(prev => {
                                  const newSet = new Set(prev)
                                  newSet.delete(anchor.id)
                                  return newSet
                                })
                              }}
                              className="text-red-500 hover:text-red-600"
                              title="Delete"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 