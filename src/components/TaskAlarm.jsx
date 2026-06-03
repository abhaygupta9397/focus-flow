import { useEffect, useRef } from 'react'
import { AlarmClock, VolumeX } from 'lucide-react'

const TaskAlarm = ({ task, onStop }) => {
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !task) return undefined

    audio.currentTime = 0
    audio.play().catch(() => {
      // Browser autoplay rules can block sound if there has not been a user gesture.
    })

    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [task])

  if (!task) return null

  const taskTitle = task.title?.trim() || 'Your focus task'

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-2xl border border-amber-400 bg-yellow-100 px-5 py-4 text-amber-950 shadow-xl shadow-amber-950/20 dark:border-violet-500/50 dark:bg-zinc-900 dark:text-zinc-100 dark:shadow-black/40">
        <audio ref={audioRef} loop src="/audio/task-complete.mp3" />

        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-600 text-yellow-50 dark:bg-violet-600">
            <AlarmClock className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700 dark:text-violet-300">
              Timer finished
            </p>
            <p className="truncate text-base font-bold text-amber-950 dark:text-zinc-100">
              {taskTitle}
            </p>
          </div>
        </div>

        <button
          className="flex shrink-0 items-center gap-2 rounded-xl bg-amber-700 px-4 py-2.5 text-sm font-bold text-yellow-50 transition hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-yellow-100 dark:bg-violet-600 dark:text-white dark:hover:bg-violet-500 dark:focus:ring-violet-400 dark:focus:ring-offset-zinc-950"
          onClick={onStop}
          type="button"
        >
          <VolumeX className="h-4 w-4" />
          Stop
        </button>
      </div>
    </div>
  )
}

export default TaskAlarm
