import type { Task } from '@/types'
import { defineStore } from 'pinia'
import { addDays } from 'date-fns'

const today = new Date()

const initialTasks = [
  {
    id: 1,
    name: "Interview",
    start: addDays(today, -30),
    end: addDays(today, -20),
    progress: 80,
  },
  {
    id: 2,
    name: "Recording Check",
    start: addDays(today, -20),
    end: addDays(today, -10),
    progress: 0,
  },
  {
    id: 3,
    name: "Transcription",
    start: addDays(today, 0),
    end: addDays(today, 10),
    progress: 0,
  },
  {
    id: 4,
    name: "Writing",
    start: addDays(today, 0),
    end: addDays(today, 20),
    progress: 0,
  },
  {
    id: 5,
    name: "Layout",
    start: addDays(today, 20),
    end: addDays(today, 30),
    progress: 0,
  },
  {
    id: 6,
    name: "Review",
    start: addDays(today, 15),
    end: addDays(today, 30),
    progress: 0,
  },
  {
    id: 7,
    name: "Publish",
    start: addDays(today, 30),
    end: addDays(today, 35),
    progress: 0,
  },
] as Task[]

export const useTaskStore = defineStore({
  id: 'task',
  state: () => ({
    tasks: initialTasks,
    nextTaskId: 8,
  }),
  getters: {
    tasksInCsv: (state): string => {
      let content = "id,name,start,end,progress\n"
      for (const task of state.tasks) {
        content += task.id + "," + task.name + "," + task.start.toISOString().substring(0,10) + "," + task.end.toISOString().substring(0,10) + "," + task.progress + "\n"
      }
      return content
    }
  },
  actions: {
    deleteTask(id: number) {
      this.tasks = this.tasks.filter(e => e.id !== id)
    },
    addTask(task: Task) {
      task.id = this.nextTaskId
      this.nextTaskId++
      this.tasks.push(task)
    },
  }
})
