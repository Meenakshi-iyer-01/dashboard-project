"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskDetails } from "@/components/tasks/TaskDetails";
import { fetchTasks, saveTaskStatuses } from "@/lib/tasks";
import type { Task, TaskFilter } from "@/types/task";

const PAGE_SIZE = 7;
const MAX_VISIBLE_TASKS = 35;

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<TaskFilter>("All");
  const [search, setSearch] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [page, setPage] = useState(1);
  const [actionNotice, setActionNotice] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const data = await fetchTasks();
      setTasks(data);
      setSelectedTask(data.find((task) => task.id === 1) ?? data[0] ?? null);
    } catch {
      setError("Unable to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks();
    try { setDarkMode(localStorage.getItem("taskflow-dark-mode") === "true"); } catch {}
  }, [loadTasks]);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    try { localStorage.setItem("taskflow-dark-mode", String(darkMode)); } catch {}
  }, [darkMode]);

  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;
  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const matchesFilter = filter === "All" || (filter === "Completed" && task.completed) || (filter === "Pending" && !task.completed);
    return matchesFilter && task.title.toLowerCase().includes(search.toLowerCase());
  }).slice(0, MAX_VISIBLE_TASKS), [tasks, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleTasks = filteredTasks.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function changeFilter(value: TaskFilter) { setFilter(value); setPage(1); }
  function changeSearch(value: string) { setSearch(value); setPage(1); }
  function changePage(value: number) { setPage(Math.max(1, Math.min(totalPages, value))); }

  function toggleTaskStatus() {
    if (!selectedTask) return;
    const updatedTask = { ...selectedTask, completed: !selectedTask.completed };
    const updatedTasks = tasks.map((task) => task.id === updatedTask.id ? updatedTask : task);
    setTasks(updatedTasks); saveTaskStatuses(updatedTasks);
    const stillMatches = filter === "All" || (filter === "Completed" && updatedTask.completed) || (filter === "Pending" && !updatedTask.completed);
    if (!stillMatches) { setSelectedTask(null); setActionNotice(""); setPage(1); }
    else {
      setSelectedTask(updatedTask);
      setActionNotice(updatedTask.completed ? "Task marked as completed. Your dashboard counts have been updated." : "Task moved to Pending. Your dashboard counts have been updated.");
    }
  }

  return <main className="app-shell">
    <Sidebar onShowAll={() => { changeFilter("All"); setSelectedTask(null); }} />
    <section className="main-content">
      <Topbar search={search} onSearchChange={changeSearch} darkMode={darkMode} onToggleTheme={() => setDarkMode((value) => !value)} />
      <section className="summary-grid" aria-label="Task summary">
        <SummaryCard label="Total Tasks" value={loading ? "—" : tasks.length} variant="total" icon="database" />
        <SummaryCard label="Completed" value={loading ? "—" : completed} variant="completed" icon="check" />
        <SummaryCard label="Pending" value={loading ? "—" : pending} variant="pending" icon="clock" />
      </section>
      <section className={`content-grid ${selectedTask ? "" : "details-closed"}`}>
        <TaskList tasks={visibleTasks} loading={loading} error={error} filter={filter} search={search} page={currentPage} totalPages={totalPages} totalFiltered={filteredTasks.length} selectedTaskId={selectedTask?.id} onFilterChange={changeFilter} onSearchChange={changeSearch} onSelectTask={(task) => { setSelectedTask(task); setActionNotice(""); }} onPageChange={changePage} onRetry={() => void loadTasks()} />
        {selectedTask && <TaskDetails task={selectedTask} notice={actionNotice} onClose={() => { setSelectedTask(null); setActionNotice(""); }} onToggleStatus={toggleTaskStatus} />}
      </section>
    </section>
  </main>;
}
