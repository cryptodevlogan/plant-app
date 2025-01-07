'use client'

import { useDrop } from 'react-dnd'
import { useRef } from 'react'
import type { Anchor } from '../types'
import DraggableAnchor from './DraggableAnchor'

interface DroppableCategoryProps {
  category: string
  anchors: Anchor[]
  onEdit: (anchor: Anchor) => void
  onDelete: (id: string) => void
  onDrop: (item: Anchor, category: string) => void
}

export default function DroppableCategory({
  category,
  anchors,
  onEdit,
  onDelete,
  onDrop,
}: DroppableCategoryProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  const [{ isOver }, connectDrop] = useDrop(() => ({
    accept: 'anchor',
    drop: (item: Anchor) => onDrop(item, category),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }))

  connectDrop(ref)

  return (
    <div
      ref={ref}
      className={`mb-6 ${isOver ? 'bg-blue-50' : ''} rounded-lg transition-colors`}
    >
      <h3 className="text-lg font-medium text-gray-700 mb-3">{category}</h3>
      <div className="space-y-3">
        {anchors.map((anchor) => (
          <DraggableAnchor
            key={anchor.id}
            anchor={anchor}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
} 