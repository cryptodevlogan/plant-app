'use client'
import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, SkipForward, SkipBack, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WorkoutPage() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isPlaying) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const exercises = [
    {
      section: "Warm-Up (2 Minutes)",
      items: [
        { name: "Jumping Jacks", time: "1 minute", description: "Get your blood flowing and loosen up your muscles" },
        { name: "Arm Circles + Torso Twists", time: "1 minute", description: "Focus on mobility and joint preparation" }
      ]
    },
    {
      section: "Main Circuit (7 Minutes)",
      description: "Perform each exercise for 40 seconds, followed by 20 seconds of rest. Repeat the circuit twice.",
      items: [
        {
          name: "Bodyweight Squats",
          goal: "to 100 over the entire session",
          notes: [
            "Build leg strength and endurance",
            "Keep your back straight, and don't let your knees cave inward"
          ]
        },
        {
          name: "Pull-Ups",
          notes: [
            "Strengthen your back, biceps, and shoulders",
            "Modify by using a resistance band or a pull-up assist machine if needed"
          ]
        },
        {
          name: "Leg Lifts",
          description: "lying down",
          notes: [
            "Target your core, especially the lower abs",
            "Keep your back flat on the ground and lift your legs slowly"
          ]
        },
        {
          name: "Step Knee Exercise",
          description: "side step-downs",
          notes: [
            "Strengthen knees and improve balance",
            "Stand sideways on a step, squat slightly, and lower the non-weight-bearing leg below the step. Alternate sides"
          ]
        }
      ]
    },
    {
      section: "Cool Down (1 Minute)",
      items: [
        { name: "Child's Pose", time: "30 seconds", description: "Stretch your lower back and hips" },
        { name: "Standing Forward Fold", time: "30 seconds", description: "Stretch your hamstrings and lower back" }
      ]
    }
  ];

  const toggleAudio = () => {
    const audio = document.getElementById('backgroundAudio') as HTMLAudioElement;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 via-amber-50 to-white font-sans">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-serif text-3xl text-orange-950 mb-1">
                Morning Workout
              </h1>
              <p className="text-sm text-orange-600">
                Healthy body, Healthy mind, Healthy life
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-amber-50 px-6 py-3 rounded-lg">
              <Timer className="text-amber-600 w-5 h-5" />
              <p className="font-serif text-2xl text-orange-950">
                {formatTime(seconds)}
              </p>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors"
              >
                {isPlaying ? 'Pause' : 'Start'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow bg-gradient-to-b from-orange-50/50 to-transparent">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex gap-8 h-full">
            {/* Left Sidebar */}
            <div className="w-1/3">
              <div className="sticky top-6 bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col items-center gap-6">
                  <audio id="backgroundAudio" src="/meditation.mp3" loop />
                  
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => {
                        const audio = document.getElementById('backgroundAudio') as HTMLAudioElement;
                        if (audio) {
                          audio.currentTime = Math.max(0, audio.currentTime - 10);
                        }
                      }}
                      className="p-2 hover:bg-orange-50 rounded-full transition-colors"
                    >
                      <SkipBack className="w-6 h-6 text-amber-600" />
                    </button>
                    
                    <button
                      onClick={toggleAudio}
                      className="p-4 bg-amber-100 hover:bg-amber-200 rounded-full transition-colors"
                    >
                      {isPlaying ? 
                        <Pause className="w-8 h-8 text-amber-600" /> :
                        <Play className="w-8 h-8 text-amber-600" />
                      }
                    </button>
                    
                    <button
                      onClick={() => {
                        const audio = document.getElementById('backgroundAudio') as HTMLAudioElement;
                        if (audio) {
                          audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
                        }
                      }}
                      className="p-2 hover:bg-orange-50 rounded-full transition-colors"
                    >
                      <SkipForward className="w-6 h-6 text-amber-600" />
                    </button>
                  </div>

                  <h2 className="font-serif text-2xl text-orange-950">
                    No Excuses
                  </h2>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-2/3 pb-24">
              <div className="space-y-8">
                {exercises.map((section, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-serif text-xl text-orange-950 mb-4">
                      {section.section}
                    </h3>
                    
                    {section.description && (
                      <p className="text-sm text-orange-600 mb-6">
                        {section.description}
                      </p>
                    )}
                    
                    <div className="space-y-6">
                      {section.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="pl-4 border-l-2 border-amber-200 hover:border-amber-400 transition-colors">
                          <div>
                            <div className="flex items-baseline gap-2">
                              <h4 className="text-lg font-medium text-orange-950">{item.name}</h4>
                              {'time' in item ? (
                                <span className="text-sm text-orange-600">
                                  ({item.time})
                                </span>
                              ) : 'goal' in item ? (
                                <span className="text-sm text-orange-600">
                                  ({item.goal})
                                </span>
                              ) : null}
                            </div>
                            {item.description && (
                              <p className="text-sm text-orange-600 mt-1">{item.description}</p>
                            )}
                            
                            {'notes' in item && item.notes && (
                              <ul className="mt-3 space-y-2">
                                {item.notes.map((note: string, noteIdx: number) => (
                                  <li key={noteIdx} className="flex items-start gap-2 text-sm text-orange-600">
                                    <span className="text-amber-400 mt-1">•</span>
                                    <span>{note}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between">
          <button
            onClick={() => router.push('/walk')}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Walk
          </button>
          
          <button
            onClick={() => router.push('/tasks')}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors"
          >
            Tasks
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  );
}