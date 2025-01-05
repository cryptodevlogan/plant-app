'use client'
import { useState } from 'react'
import { Playfair_Display, Inter } from 'next/font/google'
import { useRouter } from 'next/navigation'
import Head from 'next/head'
import { Plus, Calendar, CheckCircle2, Edit3, Trash2, ArrowLeft, ArrowRight } from 'lucide-react'

const playfair = Playfair_Display({ subsets: ['latin'] })
const inter = Inter({ subsets: ['latin'] })

// Add interface for Task
interface Task {
  text: string
  completed: boolean
  isActive?: boolean  // Add this to track active state
}

export default function TasksPage() {
  const router = useRouter()
  // Update state to use Task interface
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingText, setEditingText] = useState('')

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { text: newTask.trim(), completed: false }])
      setNewTask('')
    }
  }

  const toggleTask = (index: number) => {
    const newTasks = [...tasks]
    newTasks[index].completed = !newTasks[index].completed
    setTasks(newTasks)
  }

  const deleteTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index)
    setTasks(newTasks)
  }

  const startEditing = (index: number) => {
    setEditingIndex(index)
    setEditingText(tasks[index].text)
  }

  const saveEdit = () => {
    if (editingIndex !== null && editingText.trim()) {
      const newTasks = [...tasks]
      newTasks[editingIndex] = { ...newTasks[editingIndex], text: editingText.trim() }
      setTasks(newTasks)
      setEditingIndex(null)
      setEditingText('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (editingIndex !== null) {
        saveEdit()
      } else {
        addTask()
      }
    }
  }

  const toggleTaskActive = (index: number) => {
    const newTasks = tasks.map((task, i) => ({
      ...task,
      isActive: i === index ? !task.isActive : false
    }))
    setTasks(newTasks)
    setEditingIndex(null)  // Reset editing state when toggling active state
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
          <h1 className={`${playfair.className} text-3xl text-gray-900 mb-2`}>
            Daily Tasks
          </h1>
          <p className={`${inter.className} text-gray-500 font-light`}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Task Input */}
        <div className="px-6 -mt-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-3">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new task..."
              className={`${inter.className} flex-1 text-gray-700 placeholder:text-gray-400 focus:outline-none`}
            />
            <button
              onClick={addTask}
              className="bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Updated Task List */}
        <div className="px-6 mt-6">
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <div
                key={index}
                onClick={() => toggleTaskActive(index)}
                className={`rounded-2xl p-4 shadow-sm border border-gray-100 
                           flex items-center gap-3 cursor-pointer
                           hover:bg-gray-50 transition-colors
                           ${task.completed ? 'bg-green-50' : 'bg-white'}
                           ${task.isActive ? 'ring-2 ring-blue-200' : ''}`}
              >
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleTask(index)
                  }}
                  className={`${task.completed ? 'text-green-500' : 'text-gray-300'} 
                             hover:text-green-500 transition-colors`}
                >
                  <CheckCircle2 size={22} />
                </button>
                
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onClick={(e) => e.stopPropagation()}
                    className={`${inter.className} flex-1 focus:outline-none`}
                    autoFocus
                  />
                ) : (
                  <span className={`${inter.className} flex-1 text-gray-700 
                                  ${task.completed ? 'line-through text-gray-400' : ''}`}>
                    {task.text}
                  </span>
                )}

                {task.isActive && (
                  <div className="flex gap-2 animate-fade-in" onClick={e => e.stopPropagation()}>
                    {editingIndex === index ? (
                      <button
                        onClick={saveEdit}
                        className="text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        <CheckCircle2 size={20} />
                      </button>
                    ) : (
                      <button
                        onClick={() => startEditing(index)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="fixed bottom-8 inset-x-0 px-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex justify-between max-w-md mx-auto">
            <button
              onClick={() => router.push('/workout')}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className={`${inter.className} text-sm`}>Workout</span>
            </button>
            <button
              onClick={() => window.open('https://calendar.google.com', '_blank')}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
            >
              <Calendar size={20} />
              <span className={`${inter.className} text-sm`}>Calendar</span>
            </button>
            <button
              onClick={() => router.push('/notes')}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
            >
              <span className={`${inter.className} text-sm`}>Notes</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </main>
    </>
  )
}

// Add this to your globals.css or as a style tag
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .animate-fade-in {
    animation: fadeIn 0.2s ease-in-out;
  }
`
