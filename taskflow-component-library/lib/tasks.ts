import type { Task } from "@/types/task";

const TASKS_URL = "https://jsonplaceholder.typicode.com/todos";
const STORAGE_KEY = "taskflow-completed";

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(TASKS_URL);
  if (!response.ok) throw new Error("Unable to load tasks.");
  const tasks: Task[] = await response.json();

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const completedById: Record<number, boolean> = saved ? JSON.parse(saved) : {};
    return tasks.map((task) => ({
      ...task,
      completed: completedById[task.id] ?? task.completed,
    }));
  } catch {
    return tasks;
  }
}

export function saveTaskStatuses(tasks: Task[]) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(Object.fromEntries(tasks.map((task) => [task.id, task.completed])))
    );
  } catch {
    // The dashboard remains usable for the current session if storage is unavailable.
  }
}
