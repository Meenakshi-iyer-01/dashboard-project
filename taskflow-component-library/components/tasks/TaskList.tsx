import type { Task, TaskFilter } from "@/types/task";
import { Icon } from "@/components/ui/Icon";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskRow } from "@/components/tasks/TaskRow";

type Props = {
  tasks: Task[]; loading: boolean; error: string; filter: TaskFilter; search: string;
  page: number; totalPages: number; totalFiltered: number; selectedTaskId?: number;
  onFilterChange: (filter: TaskFilter) => void; onSearchChange: (value: string) => void;
  onSelectTask: (task: Task) => void; onPageChange: (page: number) => void; onRetry: () => void;
};

export function TaskList(props: Props) {
  const { tasks, loading, error, filter, search, page, totalPages, totalFiltered, selectedTaskId, onFilterChange, onSearchChange, onSelectTask, onPageChange, onRetry } = props;
  const start = totalFiltered ? (page - 1) * 7 + 1 : 0;
  const end = Math.min(page * 7, totalFiltered);
  return (
    <section className="tasks-panel">
      <div className="panel-heading"><div><h2>All Tasks</h2><p>View and manage your task list.</p></div><span className="task-count">{loading ? "Loading..." : `${totalFiltered} tasks`}</span></div>
      <div className="toolbar">
        <label className="panel-search"><Icon name="search" /><input type="search" placeholder="Search tasks..." value={search} onChange={(e) => onSearchChange(e.target.value)} aria-label="Search displayed tasks" /></label>
        <TaskFilters value={filter} onChange={onFilterChange} />
      </div>
      {loading ? <div className="message">Loading tasks...</div> : error ? <div className="message error-message"><p>{error}</p><button type="button" onClick={onRetry}>Try again</button></div> : tasks.length === 0 ? <div className="message">No tasks found. Try another filter or search.</div> : <>
        <div className="task-list"><div className="list-header"><span>Task</span><span>User</span><span>Status</span><span /></div>{tasks.map((task) => <TaskRow key={task.id} task={task} selected={selectedTaskId === task.id} onSelect={onSelectTask} />)}</div>
        <div className="pagination"><span className="pagination-info">Showing {start}–{end} of {totalFiltered} tasks</span><div className="pagination-controls"><button className="page-arrow" type="button" onClick={() => onPageChange(page - 1)} disabled={page === 1} aria-label="Previous page">‹</button>{Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => <button key={number} type="button" className={`page-number ${page === number ? "current" : ""}`} onClick={() => onPageChange(number)} aria-current={page === number ? "page" : undefined} aria-label={`Go to page ${number}`}>{number}</button>)}<button className="page-arrow" type="button" onClick={() => onPageChange(page + 1)} disabled={page === totalPages} aria-label="Next page">›</button></div></div>
      </>}
    </section>
  );
}
