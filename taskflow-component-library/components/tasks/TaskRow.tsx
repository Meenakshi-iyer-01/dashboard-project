import type { Task } from "@/types/task";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function TaskRow({ task, selected, onSelect }: { task: Task; selected: boolean; onSelect: (task: Task) => void }) {
  return (
    <button className={`task-row ${selected ? "row-selected" : ""}`} type="button" onClick={() => onSelect(task)} aria-label={`View details for ${task.title}`}>
      <span className="task-title"><span className={`task-check ${task.completed ? "checked" : ""}`}>{task.completed ? "✓" : ""}</span><span className="task-name">{task.title}</span></span>
      <span className="user-cell"><span className="user-avatar">U{task.userId}</span><span>User {task.userId}</span></span>
      <span><StatusBadge completed={task.completed} /></span><span className="row-arrow">›</span>
    </button>
  );
}
