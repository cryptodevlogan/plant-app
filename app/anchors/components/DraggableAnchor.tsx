'use client'

import { useDrag } from 'react-dnd'
import type { Anchor } from '../types'
import { type DragSourceMonitor } from 'react-dnd'
import { useRef } from 'react'

interface DraggableAnchorProps {
  anchor: Anchor
  onEdit: (anchor: Anchor) => void
  onDelete: (id: string) => void
}

export default function DraggableAnchor({ anchor, onEdit, onDelete }: DraggableAnchorProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  const [{ isDragging }, connectDrag] = useDrag(() => ({
    type: 'anchor',
    item: anchor,
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  connectDrag(ref)

  return (
    <div
      ref={ref}
      className={`bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="flex flex-col justify-center gap-1 cursor-grab active:cursor-grabbing">
            <div className="w-6 h-1 bg-gray-300 rounded"></div>
            <div className="w-6 h-1 bg-gray-300 rounded"></div>
            <div className="w-6 h-1 bg-gray-300 rounded"></div>
          </div>
          <div>
            <p className="text-gray-800 font-medium">{anchor.text}</p>
            {anchor.notes && (
              <p className="text-gray-500 text-sm mt-1">{anchor.notes}</p>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(anchor)}
            className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
            aria-label="Edit anchor"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(anchor.id)}
            className="p-2 text-red-500 hover:text-red-600 transition-colors"
            aria-label="Delete anchor"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
} 