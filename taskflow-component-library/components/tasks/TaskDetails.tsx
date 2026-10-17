import type { Task } from "@/types/task";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";

type Props = { task: Task; notice: string; onClose: () => void; onToggleStatus: () => void };

export function TaskDetails({ task, notice, onClose, onToggleStatus }: Props) {
  return (
    <aside className="details-panel">
      <div className="details-heading"><h2>Task Details</h2><button className="close-details" type="button" onClick={onClose} aria-label="Close task details">×</button></div>
      <div className="details-card">
        <h3>{task.title}</h3><StatusBadge completed={task.completed} />
        <div className="detail-field"><span className="detail-icon"><Icon name="user" /></span><div><span>User ID</span><strong>{task.userId}</strong></div></div>
        <div className="detail-field"><span className="detail-icon"><Icon name="calendar" /></span><div><span>Task ID</span><strong>{task.id}</strong></div></div>
        <div className="detail-field"><span className="detail-icon"><Icon name="file" /></span><div><span>Title</span><strong>{task.title}</strong></div></div>
        <div className="detail-description"><h4>Description</h4><p>This is a sample task from the JSONPlaceholder API.</p></div>
        {notice ? <div className="task-success" role="status" aria-live="polite"><Icon name="check" /><span>{notice}</span></div> : <button type="button" className={`status-action-button ${task.completed ? "make-pending" : "make-completed"}`} onClick={onToggleStatus}><Icon name={task.completed ? "refresh" : "check"} />{task.completed ? "Mark as Pending" : "Mark as Completed"}</button>}
      </div>
    </aside>
  );
}
