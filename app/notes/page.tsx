'use client'
import { useState, useEffect } from 'react'
import { Playfair_Display, Inter } from 'next/font/google'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar } from 'lucide-react'
import Head from 'next/head'

const playfair = Playfair_Display({ subsets: ['latin'] })
const inter = Inter({ subsets: ['latin'] })

export default function NotesPage() {
  const router = useRouter()
  const [notes, setNotes] = useState<{ text: string; date: string }[]>([])

  useEffect(() => {
    const savedThoughts = localStorage.getItem('walkingThoughts')
    const lastSaveDate = localStorage.getItem('walkingThoughtsDate')

    if (savedThoughts && lastSaveDate) {
      setNotes([{ text: savedThoughts, date: lastSaveDate }])
    }
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric'
    })
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>

      <main className="min-h-screen bg-[#F5F5F7]">
        {/* Header */}
        <div className="bg-white pt-12 pb-6 px-6 rounded-b-[2rem] shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className={`${playfair.className} text-3xl text-gray-900`}>
              Walking Thoughts
            </h1>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Calendar size={16} />
            <p className={`${inter.className} font-light`}>
              Today's Reflections
            </p>
          </div>
        </div>

        {/* Notes Display */}
        <div className="px-6 py-8">
          {notes.length > 0 ? (
            notes.map((note, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-2 mb-4">
                  <p className={`${inter.className} text-sm text-gray-500`}>
                    {formatDate(note.date)}
                  </p>
                </div>
                <p className={`${playfair.className} text-gray-700 whitespace-pre-wrap leading-relaxed`}>
                  {note.text || "No thoughts recorded yet."}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className={`${inter.className} text-gray-500`}>
                No walking thoughts recorded today.
              </p>
              <button
                onClick={() => router.push('/walk')}
                className="mt-4 text-blue-500 hover:text-blue-600 transition-colors"
              >
                Start your morning walk →
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  )
}