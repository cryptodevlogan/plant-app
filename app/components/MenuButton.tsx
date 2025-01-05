'use client'
import { Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface MenuButtonProps {
  className?: string
}

export default function MenuButton({ className = '' }: MenuButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { name: 'Tea', path: '/' },
    { name: 'Prayer', path: '/prayer' },
    { name: 'Walk', path: '/walk' },
    { name: 'Workout', path: '/workout' },
    { name: 'Tasks', path: '/tasks' },
    { name: 'Notes', path: '/notes' }
  ]

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-full bg-transparent ${className}`}
      >
        <Menu 
          size={24} 
          strokeWidth={2.5}
          className="text-amber-700/50 hover:text-amber-700 transition-colors duration-200" 
        />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50">
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg p-6">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-amber-50"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <nav className="mt-12 space-y-4">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    router.push(item.path)
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
} 