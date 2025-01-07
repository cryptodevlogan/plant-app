'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Cloud, Bird, Home, ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation'

export default function WalkPage() {
  const [thoughts, setThoughts] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showMotivation, setShowMotivation] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const savedThoughts = localStorage.getItem('walkingThoughts');
    const lastSaveDate = localStorage.getItem('walkingThoughtsDate');
    const today = new Date().toDateString();
    
    if (savedThoughts && lastSaveDate === today) {
      setThoughts(savedThoughts);
    } else {
      localStorage.removeItem('walkingThoughts');
      localStorage.removeItem('walkingThoughtsDate');
      setThoughts('');
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            const alarm = new Audio('/gentle-alarm.mp3');
            alarm.play();
            setIsActive(false);
          }
          return time - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleThoughtsChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const newThoughts = e.target.value;
    setThoughts(newThoughts);
    localStorage.setItem('walkingThoughts', newThoughts);
    localStorage.setItem('walkingThoughtsDate', new Date().toDateString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 via-amber-50 to-white">
      <div className="relative w-full h-screen overflow-hidden pb-28">
        {/* Warm morning glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-yellow-100/20 to-orange-100/30 pointer-events-none" />
        
        {/* Header with Background Elements */}
        <div className="px-6 pt-4">
          <div className="flex justify-between items-center relative z-20">
            <div className="p-1 rounded-full bg-white/80 backdrop-blur-sm">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-full text-amber-600/90 hover:text-amber-700
                  hover:bg-amber-50 transition-all duration-300"
              >
                <Home size={20} />
              </button>
            </div>
            <span className="text-amber-900/90 text-lg font-serif">
              {new Date().toLocaleTimeString([], { 
                hour: 'numeric', 
                minute: '2-digit', 
                hour12: true 
              })}
            </span>
          </div>
        </div>

        {!isExpanded && (
          <div className="absolute top-0 left-0 w-full pointer-events-none">
            <div className="relative">
              <Cloud 
                size={32} 
                className="absolute left-12 top-14 text-amber-200/80 animate-float"
              />
              <div className="absolute left-1/2 -translate-x-1/2 top-20">
                <Sun size={64} className="text-amber-400/90 animate-pulse-slow" />
              </div>
              <Bird 
                size={24} 
                className="absolute right-12 top-14 text-amber-200/80 animate-float-delayed"
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="relative z-10 w-full px-6 pt-24">
          <div className="flex flex-col items-center">
            {/* Timer */}
            <button
              onClick={() => setIsActive(!isActive)}
              className={`w-44 h-44 mb-10 rounded-full 
                bg-white/80
                backdrop-blur-md shadow-lg 
                flex items-center justify-center
                transition-all duration-500
                border border-amber-200/30
                group
                ${isActive ? 'ring-2 ring-amber-200/50' : ''}`}
            >
              <div className="text-6xl font-serif text-amber-900/90 transition-transform duration-300 group-hover:scale-105">
                {formatTime(timeLeft)}
              </div>
            </button>
            
            {/* Title and Motivation */}
            {showMotivation && (
              <div className="text-center mb-7 opacity-0 animate-fadeIn">
                <h2 className="text-4xl font-serif text-amber-900/90 mb-2">
                  Morning Walk
                </h2>
                <p className="text-lg text-amber-800/80">
                  Embrace the morning air
                </p>
              </div>
            )}

            {/* Thoughts Input */}
            <div className="w-full">
              <div 
                className={`transition-all duration-300 ease-in-out mb-20
                  ${isExpanded ? 'fixed inset-x-4 top-20 bottom-28 z-50' : 'relative w-full h-32'}`}
              >
                <textarea
                  value={thoughts}
                  onChange={handleThoughtsChange}
                  onFocus={() => {
                    setIsExpanded(true);
                    setShowMotivation(false);
                  }}
                  placeholder="Brief thoughts that come to mind during your walk..."
                  className={`w-full h-full px-6 py-4 rounded-3xl
                    bg-white/90 backdrop-blur-md
                    border border-amber-200/50
                    text-amber-900 placeholder:text-amber-400
                    focus:outline-none focus:ring-2 focus:ring-amber-200/50
                    shadow-lg
                    resize-none
                    text-base text-center
                    transition-all duration-300`}
                  style={{
                    paddingTop: !isExpanded ? '2.5rem' : '1rem',
                  }}
                />
                {isExpanded && (
                  <button
                    onClick={() => {
                      setIsExpanded(false);
                      setShowMotivation(true);
                    }}
                    className="absolute -bottom-12 left-1/2 transform -translate-x-1/2
                      p-3 rounded-full bg-white/90 backdrop-blur-sm
                      text-amber-600 hover:bg-amber-50 transition-all duration-300"
                  >
                    <ChevronDown size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* iOS-style Bottom Navigation */}
        <div className="fixed bottom-8 inset-x-0 px-6 z-30">
          <div className="max-w-xl mx-auto">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-amber-200/30 
                        flex justify-between">
              <button
                onClick={() => router.push('/prayer')}
                className="flex items-center gap-2 text-amber-900/80 hover:text-amber-900 transition-colors py-4 px-6"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Prayer</span>
              </button>
              <button
                onClick={() => router.push('/workout')}
                className="flex items-center gap-2 text-amber-900/80 hover:text-amber-900 transition-colors py-4 px-6"
              >
                <span className="text-sm">Workout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 0.7; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4.5s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}