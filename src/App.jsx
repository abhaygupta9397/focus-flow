import { useState, useEffect } from 'react'
import TaskItem from './components/TaskItem.jsx'

function App() {
  const [darkMode, setDarkMode] = useState(true)

  // Live Clock
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100`}>
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Focus Flow</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Today's Focus</p>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-right">
              <div className="text-xl font-medium">
                {currentTime.toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-2xl font-mono tracking-widest">
                {currentTime.toLocaleTimeString('en-IN', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>

            <button
              onClick={toggleDarkMode}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="space-y-4">
          <TaskItem
            number={1}
            title="Find your focus here"
            timeLeft="25:00"
            status="inprogress"
          />
        </div>
      </main>
    </div>
  )
}

export default App
