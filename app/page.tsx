'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Quicksand } from 'next/font/google'

const quicksand = Quicksand({ subsets: ['latin'] })

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-[#7883e7]">
      <div className="w-full mb-4">
        <Image
          src="/home.png"
          alt="Home"
          width={500}
          height={300}
          className="w-full h-auto"
          priority
        />
      </div>
      <nav className={`grid grid-cols-3 gap-x-4 gap-y-6 px-4 ${quicksand.className}`}>
        <Link href="/tea" className="flex flex-col items-center group">
          <div className="w-24 h-24 flex items-center justify-center transform transition-all duration-200 active:scale-90 hover:scale-105">
            <Image
              src="/cup.png"
              alt="Tea"
              width={72}
              height={72}
              className="object-contain"
            />
          </div>
          <span className="text-sm font-medium text-white tracking-wide group-active:opacity-70">Tea Time</span>
        </Link>
        <Link href="/prayer" className="flex flex-col items-center group">
          <div className="w-24 h-24 flex items-center justify-center transform transition-all duration-200 active:scale-90 hover:scale-105">
            <Image
              src="/hands.png"
              alt="Prayer"
              width={72}
              height={72}
              className="object-contain"
            />
          </div>
          <span className="text-sm font-medium text-white tracking-wide group-active:opacity-70">Prayer</span>
        </Link>
        <Link href="/walk" className="flex flex-col items-center group">
          <div className="w-24 h-24 flex items-center justify-center transform transition-all duration-200 active:scale-90 hover:scale-105">
            <Image
              src="/walk.png"
              alt="Walk"
              width={72}
              height={72}
              className="object-contain"
            />
          </div>
          <span className="text-sm font-medium text-white tracking-wide group-active:opacity-70">Walk</span>
        </Link>
        <Link href="/workout" className="flex flex-col items-center group">
          <div className="w-24 h-24 flex items-center justify-center transform transition-all duration-200 active:scale-90 hover:scale-105">
            <Image
              src="/flex.png"
              alt="Workout"
              width={72}
              height={72}
              className="object-contain"
            />
          </div>
          <span className="text-sm font-medium text-white tracking-wide group-active:opacity-70">Workout</span>
        </Link>
        <Link href="/tasks" className="flex flex-col items-center group">
          <div className="w-24 h-24 flex items-center justify-center transform transition-all duration-200 active:scale-90 hover:scale-105">
            <Image
              src="/tasks.png"
              alt="Tasks"
              width={72}
              height={72}
              className="object-contain"
            />
          </div>
          <span className="text-sm font-medium text-white tracking-wide group-active:opacity-70">Tasks</span>
        </Link>
        <Link href="/notes" className="flex flex-col items-center group">
          <div className="w-24 h-24 flex items-center justify-center transform transition-all duration-200 active:scale-90 hover:scale-105">
            <Image
              src="/notes.png"
              alt="Notes"
              width={72}
              height={72}
              className="object-contain"
            />
          </div>
          <span className="text-sm font-medium text-white tracking-wide group-active:opacity-70">Notes</span>
        </Link>
        <Link href="/anchors" className="flex flex-col items-center group">
          <div className="w-24 h-24 flex items-center justify-center transform transition-all duration-200 active:scale-90 hover:scale-105">
            <Image
              src="/anchor.png"
              alt="Daily Anchors"
              width={72}
              height={72}
              className="object-contain"
            />
          </div>
          <span className="text-sm font-medium text-white tracking-wide group-active:opacity-70">Daily Anchors</span>
        </Link>
      </nav>
    </div>
  )
}