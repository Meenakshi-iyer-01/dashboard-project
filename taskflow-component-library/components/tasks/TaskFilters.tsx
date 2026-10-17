import type { TaskFilter } from "@/types/task";

const filters: TaskFilter[] = ["All", "Pending", "Completed"];

export function TaskFilters({ value, onChange }: { value: TaskFilter; onChange: (value: TaskFilter) => void }) {
  return <div className="filter-group" aria-label="Filter tasks">{filters.map((filter) => <button key={filter} type="button" className={`filter-button ${value === filter ? "selected" : ""}`} onClick={() => onChange(filter)} aria-pressed={value === filter}>{filter}</button>)}</div>;
}
