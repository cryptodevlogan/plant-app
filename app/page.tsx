'use client'
import { useRouter } from 'next/navigation'
import { Playfair_Display, Lato } from 'next/font/google'

const playfair = Playfair_Display({ subsets: ['latin'] })
const lato = Lato({ weight: ['300'], subsets: ['latin'] })

export default function HomePage() {
  const router = useRouter()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FBF0DE]">
      <h1 className={`${playfair.className} text-3xl text-[#8B4513] mb-8`}>
        Daily Rituals
      </h1>
      
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => router.push('/tea')}
          className={`${lato.className} px-6 py-3 rounded-full bg-[#8B4513] text-white text-lg hover:bg-[#6A4423] transition-colors`}
        >
          Tea Time
        </button>
        
        <button
          onClick={() => router.push('/prayer')}
          className={`${lato.className} px-6 py-3 rounded-full bg-[#8B4513] text-white text-lg hover:bg-[#6A4423] transition-colors`}
        >
          Prayer
        </button>
        
        <button
          onClick={() => router.push('/walk')}
          className={`${lato.className} px-6 py-3 rounded-full bg-[#8B4513] text-white text-lg hover:bg-[#6A4423] transition-colors`}
        >
          Walk
        </button>

        <button
          onClick={() => router.push('/workout')}
          className={`${lato.className} px-6 py-3 rounded-full bg-[#8B4513] text-white text-lg hover:bg-[#6A4423] transition-colors`}
        >
          Workout
        </button>

        <button
          onClick={() => router.push('/tasks')}
          className={`${lato.className} px-6 py-3 rounded-full bg-[#8B4513] text-white text-lg hover:bg-[#6A4423] transition-colors`}
        >
          Tasks
        </button>

        <button
          onClick={() => router.push('/notes')}
          className={`${lato.className} px-6 py-3 rounded-full bg-[#8B4513] text-white text-lg hover:bg-[#6A4423] transition-colors`}
        >
          Notes
        </button>
      </div>
    </main>
  )
}