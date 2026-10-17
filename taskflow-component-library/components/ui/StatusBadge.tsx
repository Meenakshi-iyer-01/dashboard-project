import type { Task } from "@/types/task";

export function StatusBadge({ completed }: { completed: Task["completed"] }) {
  return <span className={`status-badge ${completed ? "done" : "pending"}`}>{completed ? "Completed" : "Pending"}</span>;
}
