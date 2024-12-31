'use client'
import { useState } from 'react'
import { Playfair_Display, Lato } from 'next/font/google'
import { useRouter } from 'next/navigation'
import Head from 'next/head'

const playfair = Playfair_Display({ subsets: ['latin'] })
const lato = Lato({ weight: ['300'], subsets: ['latin'] })

export default function TasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<string[]>([])
  const [newTask, setNewTask] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingText, setEditingText] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [walkingThoughts, setWalkingThoughts] = useState<string>('')

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, newTask.trim()])
      setNewTask('')
    }
  }

  const deleteTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index)
    setTasks(newTasks)
  }

  const startEditing = (index: number) => {
    setEditingIndex(index)
    setEditingText(tasks[index])
  }

  const saveEdit = () => {
    if (editingIndex !== null && editingText.trim()) {
      const newTasks = [...tasks]
      newTasks[editingIndex] = editingText.trim()
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

  const saveTasks = () => {
    const content = tasks.map((task, index) => `${index + 1}. ${task}`).join('\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'daily-tasks.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const openModal = () => {
    // Get walking thoughts from localStorage
    const thoughts = localStorage.getItem('walkingThoughts') || 'No thoughts recorded yet.'
    setWalkingThoughts(thoughts)
    setIsModalOpen(true)
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>
      <main className="min-h-screen flex flex-col items-center p-6 bg-white">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className={`${playfair.className} text-2xl text-gray-800`}>
              Daily Tasks
            </h1>
            <button
              onClick={openModal}
              className={`${lato.className} px-4 py-2 rounded-lg bg-[#4285F4] text-white flex items-center gap-2`}
            >
              <span className="material-icons text-xl">book</span>
              View Walking Thoughts
            </button>
          </div>

          {/* Task input */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a task..."
              className={`${lato.className} flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#4285F4]`}
            />
            <button
              onClick={addTask}
              className="p-2 rounded-lg bg-[#4285F4] text-white"
            >
              <span className="material-icons">add_task</span>
            </button>
          </div>

          {/* Task list with fixed height and scrolling */}
          <div className="h-[calc(100vh-400px)] overflow-y-auto mb-6">
            <ul className="space-y-3">
              {tasks.map((task, index) => (
                <li
                  key={index}
                  className={`${lato.className} p-3 rounded-lg border border-gray-200 flex items-center gap-3`}
                >
                  <span className="material-icons text-gray-400">check_box_outline_blank</span>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 px-2 py-1 border-b border-[#4285F4] focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <span className="flex-1">{task}</span>
                  )}
                  <div className="flex gap-2">
                    {editingIndex === index ? (
                      <button
                        onClick={saveEdit}
                        className="text-[#4285F4] hover:text-[#2962FF]"
                      >
                        <span className="material-icons">save</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => startEditing(index)}
                        className="text-gray-400 hover:text-[#4285F4]"
                      >
                        <span className="material-icons">edit</span>
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Save button */}
          <div className="flex justify-center mb-20">
            <button
              onClick={saveTasks}
              className={`${lato.className} px-6 py-3 rounded-lg bg-gray-600 text-white flex items-center gap-2`}
            >
              <span className="material-icons">save</span>
              Save Tasks
            </button>
          </div>

          {/* Navigation buttons */}
          <div className="fixed bottom-8 left-0 right-0 flex justify-between px-6">
            <button
              onClick={() => router.push('/workout')}
              className={`${lato.className} px-4 py-2 rounded-full bg-[#7B1FA2] text-white hover:bg-[#6A1B9A]`}
            >
              ← Workout
            </button>
            <button
              onClick={() => window.open('https://calendar.google.com', '_blank')}
              className={`${lato.className} px-4 py-2 rounded-full bg-[#7B1FA2] text-white hover:bg-[#6A1B9A]`}
            >
              Calendar →
            </button>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh]">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`${playfair.className} text-xl text-gray-800`}>Walking Thoughts</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="material-icons">close</span>
                </button>
              </div>
              <div 
                className={`${lato.className} text-gray-600 overflow-y-auto pr-4 
                  shadow-[inset_0_-10px_10px_-10px_rgba(0,0,0,0.1)]`}
                style={{ 
                  maxHeight: 'calc(80vh - 100px)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
              >
                {walkingThoughts}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
