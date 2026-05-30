import { useEffect, useState } from 'react'
import { Clock3, Pause, Play } from 'lucide-react'

const statusConfig = {
  incomplete: {
    label: 'Incomplete',
    fill: 'bg-red-500',
    text: 'text-red-400',
  },
  inprogress: {
    label: 'In progress',
    fill: 'bg-amber-400',
    text: 'text-amber-400',
  },
  completed: {
    label: 'Done',
    fill: 'bg-emerald-500',
    text: 'text-emerald-400',
  },
}

const toSeconds = (time) => {
  const match = String(time).trim().match(/^(\d+):([0-5]?\d)$/)
  if (!match) return null

  return (Number(match[1]) * 60) + Number(match[2])
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

const TaskItem = ({
  id,
  number = 1,
  title = 'Plan the next focused work session',
  timeLeft = '25:00',
  status = 'incomplete',
  onToggleTimer,
  onComplete,
  onTitleChange,
}) => {
  const initialSeconds = toSeconds(timeLeft) ?? 0
  const [taskTitle, setTaskTitle] = useState(title)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds)
  const [timerDraft, setTimerDraft] = useState(() => formatTime(initialSeconds))
  const currentStatus = statusConfig[status] ?? statusConfig.incomplete
  const timeLeftPercentage = totalSeconds === 0
    ? 0
    : Math.round((secondsLeft / totalSeconds) * 100)

  useEffect(() => {
    if (!isTimerRunning || secondsLeft === 0) return undefined

    const timer = setInterval(() => {
      if (secondsLeft <= 1) {
        setSecondsLeft(0)
        setTimerDraft('00:00')
        setIsTimerRunning(false)
        onComplete?.(id)
        return
      }

      setSecondsLeft(secondsLeft - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [id, isTimerRunning, onComplete, secondsLeft])

  const commitTimerDraft = () => {
    const nextSeconds = toSeconds(timerDraft)

    if (nextSeconds === null) {
      setTimerDraft(formatTime(secondsLeft))
      return secondsLeft
    }

    setSecondsLeft(nextSeconds)
    setTotalSeconds(nextSeconds)
    setTimerDraft(formatTime(nextSeconds))
    return nextSeconds
  }

  const handleTimerToggle = () => {
    const nextSeconds = isTimerRunning ? secondsLeft : commitTimerDraft()
    if (!isTimerRunning && nextSeconds === 0) return

    const nextTimerState = !isTimerRunning
    setIsTimerRunning(nextTimerState)
    onToggleTimer?.(id, nextTimerState)
  }

  const handleTitleChange = (event) => {
    const nextTitle = event.target.value
    setTaskTitle(nextTitle)
    onTitleChange?.(id, nextTitle)
  }

  return (
    <article className="task-item group flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 sm:gap-5 sm:p-5">
      <div className="task-number relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 p-0.5 shadow-md shadow-violet-500/20">
        <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white leading-none dark:bg-zinc-900">
          <span className="mb-0.5 text-[9px] font-black uppercase tracking-[0.2em] text-violet-400">Task</span>
          <span className="text-xl font-black tracking-tight text-violet-600 dark:text-violet-300">
            {String(number).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <label className="mb-1 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
          Find your focus
        </label>
        <input
          aria-label={`Title for task ${number}`}
          className="task-title-input w-full border-b border-transparent bg-transparent py-1 text-lg font-bold tracking-wide text-violet-700 outline-none transition placeholder:text-violet-300 hover:border-violet-300 focus:border-fuchsia-500 dark:text-violet-300 dark:placeholder:text-violet-500/70 dark:hover:border-violet-700"
          onChange={handleTitleChange}
          placeholder="Write your task here..."
          type="text"
          value={taskTitle}
        />
      </div>

      <div className="shrink-0">
        <div className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
          {isTimerRunning ? 'Time left' : 'Set timer'}
        </div>
        <div className="timer-panel flex items-center gap-1 rounded-xl border border-cyan-400/30 bg-cyan-950 px-3 py-2 shadow-inner shadow-cyan-400/10">
          <Clock3 className="hidden h-5 w-5 text-cyan-300 sm:block" />
          {isTimerRunning ? (
            <span className="timer-display w-14 text-center text-base font-bold tabular-nums text-cyan-200 sm:text-lg">
              {formatTime(secondsLeft)}
            </span>
          ) : (
            <input
              aria-label={`Timer duration for ${taskTitle || `task ${number}`}`}
              className="timer-display w-14 bg-transparent text-center text-base font-bold tabular-nums text-cyan-200 outline-none placeholder:text-cyan-700 focus:text-cyan-100 sm:text-lg"
              inputMode="numeric"
              maxLength={6}
              onBlur={commitTimerDraft}
              onChange={(event) => setTimerDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') event.currentTarget.blur()
              }}
              title="Enter a timer duration in MM:SS format"
              value={timerDraft}
            />
          )}
          <button
            aria-label={isTimerRunning ? `Pause timer for ${taskTitle}` : `Start timer for ${taskTitle}`}
            className="rounded-lg p-1.5 text-cyan-300 transition hover:bg-cyan-800/70 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            onClick={handleTimerToggle}
            type="button"
          >
            {isTimerRunning
              ? <Pause className="h-4 w-4 fill-current" />
              : <Play className="h-4 w-4 fill-current" />}
          </button>
        </div>
      </div>

      <div className="hidden w-32 shrink-0 sm:block">
        <div className="mb-1 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
          <span className={currentStatus.text}>{currentStatus.label}</span>
          <span>{timeLeftPercentage}%</span>
        </div>
        <div className="flex items-center">
          <div className="h-6 flex-1 overflow-hidden rounded-md border-2 border-zinc-300 p-0.5 dark:border-zinc-600">
            <div
              className={`h-full rounded-sm transition-all duration-500 ${currentStatus.fill}`}
              style={{ width: `${timeLeftPercentage}%` }}
            />
          </div>
          <div className="h-3 w-1 rounded-r-sm bg-zinc-300 dark:bg-zinc-600" />
        </div>
      </div>
    </article>
  )
}

export default TaskItem
