import { useCallback, useEffect, useState } from 'react'
import { Moon, Plus, Sun } from 'lucide-react'
import TaskAlarm from './components/TaskAlarm.jsx'
import TaskItem from './components/TaskItem.jsx'

const createTask = () => ({
  id: crypto.randomUUID(),
  title: '',
  timeLeft: '25:00',
  status: 'incomplete',
})

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [tasks, setTasks] = useState([
    {
      id: crypto.randomUUID(),
      title: 'Find your focus here',
      timeLeft: '25:00',
      status: 'incomplete',
    },
  ])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [alarmTask, setAlarmTask] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode((currentMode) => !currentMode)
  }

  const addTask = useCallback(() => {
    setTasks((currentTasks) => [...currentTasks, createTask()])
  }, [])

  const deleteTask = useCallback((taskId) => {
    setTasks((currentTasks) => currentTasks.filter(({ id }) => id !== taskId))
  }, [])

  const updateTaskTitle = useCallback((taskId, title) => {
    setTasks((currentTasks) => currentTasks.map((task) => (
      task.id === taskId ? { ...task, title } : task
    )))
  }, [])

  const updateTaskTimerStatus = useCallback((taskId, isTimerRunning) => {
    setTasks((currentTasks) => currentTasks.map((task) => (
      task.id === taskId
        ? { ...task, status: isTimerRunning ? 'inprogress' : 'incomplete' }
        : task
    )))
  }, [])

  const completeTask = useCallback((taskId) => {
    const completedTask = tasks.find((task) => task.id === taskId)

    if (completedTask) {
      setAlarmTask({ id: completedTask.id, title: completedTask.title })
    }

    setTasks((currentTasks) => currentTasks.map((task) => (
      task.id === taskId ? { ...task, status: 'completed' } : task
    )))
  }, [tasks])

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-amber-100 to-orange-200 text-amber-950 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950 dark:text-zinc-100">
      <header className="border-b border-amber-400/60 bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-300 shadow-md shadow-amber-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:bg-none dark:shadow-none">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-amber-950 dark:text-zinc-100">Focus Flow</h1>
            <p className="text-sm font-semibold text-amber-800 dark:text-zinc-400">Today's Focus</p>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-right text-amber-950 dark:text-zinc-100">
              <div className="text-xl font-semibold">
                {currentTime.toLocaleDateString('en-IN', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div className="text-2xl font-mono tracking-widest">
                {currentTime.toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>

            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/40 bg-amber-100/70 text-amber-800 shadow-sm transition hover:bg-yellow-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-yellow-300 dark:hover:bg-zinc-700"
              onClick={toggleDarkMode}
              title={darkMode ? 'Switch to day theme' : 'Switch to night theme'}
              type="button"
            >
              {darkMode ?  <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-amber-300/70 bg-yellow-200/60 px-5 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Your Tasks</h2>
            <p className="text-sm font-medium text-amber-700 dark:text-zinc-400">
              {tasks.length === 0
                ? 'Add a task to begin your focus session.'
                : `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'} ready for focus.`}
            </p>
          </div>
          <button
            className="flex items-center gap-2 rounded-xl bg-amber-700 px-4 py-2.5 text-sm font-bold text-yellow-50 shadow-lg shadow-amber-700/20 transition hover:-translate-y-0.5 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-yellow-100 dark:bg-violet-600 dark:text-white dark:shadow-violet-500/20 dark:hover:bg-violet-500 dark:focus:ring-violet-400 dark:focus:ring-offset-zinc-950"
            onClick={addTask}
            type="button"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        </div>

        <div className="space-y-4">
          {tasks.map((task, index) => (
            <TaskItem
              key={task.id}
              {...task}
              number={index + 1}
              onComplete={completeTask}
              onDelete={deleteTask}
              onTitleChange={updateTaskTitle}
              onToggleTimer={updateTaskTimerStatus}
            />
          ))}
        </div>
      </main>

      <TaskAlarm
        task={alarmTask}
        onStop={() => setAlarmTask(null)}
      />
    </div>
  )
}

export default App
