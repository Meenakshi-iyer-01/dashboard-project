
"use client";

import { useEffect, useMemo, useState } from "react";

type Task = {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
};

const PAGE_SIZE = 7;
const MAX_PAGES = 5;
const MAX_VISIBLE_TASKS = PAGE_SIZE * MAX_PAGES;

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [page, setPage] = useState(1);
  const [actionNotice, setActionNotice] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load tasks.");
        return response.json();
      })
      .then((data: Task[]) => {
        let savedTasks: Record<number, boolean> = {};

        try {
          const stored = localStorage.getItem("taskflow-completed");
          if (stored) savedTasks = JSON.parse(stored);
        } catch {
          savedTasks = {};
        }

        const restoredTasks = data.map((task) => ({
          ...task,
          completed:
            savedTasks[task.id] === undefined
              ? task.completed
              : savedTasks[task.id],
        }));

        setTasks(restoredTasks);
        setSelectedTask(
          restoredTasks.find((task) => task.id === 1) ??
            restoredTasks[0] ??
            null
        );
      })
      .catch(() => setError("Unable to load tasks. Please try again."))
      .finally(() => setLoading(false));

    try {
      setDarkMode(localStorage.getItem("taskflow-dark-mode") === "true");
    } catch {
      // Continue with light mode if local storage is unavailable.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("taskflow-dark-mode", String(darkMode));
    } catch {
      // The theme still works for the current session.
    }
  }, [darkMode]);

  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesFilter =
          filter === "All" ||
          (filter === "Completed" && task.completed) ||
          (filter === "Pending" && !task.completed);

        return (
          matchesFilter &&
          task.title.toLowerCase().includes(search.toLowerCase())
        );
      })
      .slice(0, MAX_VISIBLE_TASKS);
  }, [tasks, filter, search]);

  const totalPages = Math.max(
    1,
    Math.min(MAX_PAGES, Math.ceil(filteredTasks.length / PAGE_SIZE))
  );

  const currentPage = Math.min(page, totalPages);

  const visibleTasks = filteredTasks.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  function changeFilter(value: string) {
    setFilter(value);
    setPage(1);
  }

  function changeSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function changePage(value: number) {
    setPage(Math.max(1, Math.min(totalPages, value)));
  }

  function toggleTaskStatus() {
    if (!selectedTask) return;

    const updatedTask = {
      ...selectedTask,
      completed: !selectedTask.completed,
    };

    setTasks((current) => {
      const updatedTasks = current.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );

      try {
        const savedTasks = Object.fromEntries(
          updatedTasks.map((task) => [task.id, task.completed])
        );
        localStorage.setItem(
          "taskflow-completed",
          JSON.stringify(savedTasks)
        );
      } catch {
        // The status still updates in the current session.
      }

      return updatedTasks;
    });

    const stillMatchesFilter =
      filter === "All" ||
      (filter === "Completed" && updatedTask.completed) ||
      (filter === "Pending" && !updatedTask.completed);

    if (!stillMatchesFilter) {
      setSelectedTask(null);
      setActionNotice("");
      setPage(1);
    } else {
      setSelectedTask(updatedTask);
      setActionNotice(
        updatedTask.completed
          ? "Task marked as completed. Your dashboard counts have been updated."
          : "Task moved to Pending. Your dashboard counts have been updated."
      );
    }
  }

  return (
    <main className={`app-shell ${darkMode ? "dark-mode" : ""}`}>
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="TaskFlow home">
          <span className="brand-mark">✳</span>
          <span>TaskFlow</span>
        </a>

        <p className="nav-label">WORKSPACE</p>

        <button className="nav-item active" type="button">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
          Dashboard
        </button>

        <button
          className="nav-item"
          type="button"
          onClick={() => {
            changeFilter("All");
            setSelectedTask(null);
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 6h12M9 12h12M9 18h12" />
            <path d="M3 6h.01M3 12h.01M3 18h.01" />
          </svg>
          All Tasks
        </button>

        <div className="sidebar-divider" />

        <p className="nav-label">GENERAL</p>

        <div className="nav-item muted">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path
              d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.8 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.8-1l-1.7.7-1.4-2.4L7.1 15a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.8-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.8 1l1.7-.7 1.4 2.4-1.4 1.1a8 8 0 0 1 0 2Z"
              transform="translate(-1 -2) scale(1.08)"
            />
          </svg>
          Settings
        </div>

        <div className="nav-item muted">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M9.6 9a2.5 2.5 0 1 1 4.3 1.8c-1.2 1-1.9 1.3-1.9 3" />
            <path d="M12 17h.01" />
          </svg>
          Help
        </div>

        <div className="sidebar-promo">
          <div className="promo-art">
            <span className="promo-blob" />
            <span className="promo-sparkle">✦</span>
          </div>
          <h3>Stay organised</h3>
          <p>Manage your tasks efficiently and achieve more.</p>
        </div>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <div className="welcome">
            <p className="welcome-label">Welcome back</p>
            <h1>Your Task Dashboard</h1>
            <p className="subtitle">
              Keep track of your tasks and progress.
            </p>
          </div>

          <div className="topbar-actions">
            <label className="global-search">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4" />
              </svg>
              <input
                type="search"
                placeholder="Search tasks..."
                value={search}
                onChange={(event) => changeSearch(event.target.value)}
                aria-label="Search all tasks"
              />
              <span className="shortcut">⌘ K</span>
            </label>

            <button
              className="icon-button theme-toggle"
              type="button"
              onClick={() => setDarkMode((current) => !current)}
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
              title={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {darkMode ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z" />
                </svg>
              )}
            </button>

            <button
              className="icon-button notification-button"
              aria-label="Notifications"
              type="button"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                <path d="M10 21h4" />
              </svg>
              <span className="notification-dot" />
            </button>

            <div className="workspace-menu">
              <span className="workspace-avatar">TF</span>
              <span>My workspace</span>
              <span className="chevron">⌄</span>
            </div>
          </div>
        </header>

        <section className="summary-grid" aria-label="Task summary">
          <article className="summary-card total-card">
            <div className="summary-icon purple-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <ellipse cx="12" cy="5" rx="8" ry="3" />
                <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
                <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
              </svg>
            </div>
            <div className="summary-copy">
              <p>Total Tasks</p>
              <strong>{loading ? "—" : tasks.length}</strong>
            </div>
          </article>

          <article className="summary-card completed-card">
            <div className="summary-icon green-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m5 12 4.5 4.5L19 7" />
              </svg>
            </div>
            <div className="summary-copy">
              <p>Completed</p>
              <strong>{loading ? "—" : completed}</strong>
            </div>
          </article>

          <article className="summary-card pending-card">
            <div className="summary-icon orange-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div className="summary-copy">
              <p>Pending</p>
              <strong>{loading ? "—" : pending}</strong>
            </div>
          </article>
        </section>

        <section
          className={`content-grid ${selectedTask ? "" : "details-closed"}`}
        >
          <section className="tasks-panel">
            <div className="panel-heading">
              <div>
                <h2>All Tasks</h2>
                <p>View and manage your task list.</p>
              </div>
              <span className="task-count">
                {loading ? "Loading..." : `${filteredTasks.length} tasks`}
              </span>
            </div>

            <div className="toolbar">
              <label className="panel-search">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m16 16 4 4" />
                </svg>
                <input
                  type="search"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(event) => changeSearch(event.target.value)}
                  aria-label="Search displayed tasks"
                />
              </label>

              <div className="filter-group" aria-label="Filter tasks">
                {["All", "Pending", "Completed"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`filter-button ${
                      filter === option ? "selected" : ""
                    }`}
                    onClick={() => changeFilter(option)}
                    aria-pressed={filter === option}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="message">Loading tasks...</div>
            ) : error ? (
              <div className="message error-message">
                <p>{error}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                >
                  Try again
                </button>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="message">
                No tasks found. Try another filter or search.
              </div>
            ) : (
              <>
                <div className="task-list">
                  <div className="list-header">
                    <span>Task</span>
                    <span>User</span>
                    <span>Status</span>
                    <span />
                  </div>

                  {visibleTasks.map((task) => (
                    <button
                      className={`task-row ${
                        selectedTask?.id === task.id ? "row-selected" : ""
                      }`}
                      key={task.id}
                      type="button"
                      onClick={() => {
                        setSelectedTask(task);
                        setActionNotice("");
                      }}
                      aria-label={`View details for ${task.title}`}
                    >
                      <span className="task-title">
                        <span
                          className={`task-check ${
                            task.completed ? "checked" : ""
                          }`}
                        >
                          {task.completed ? "✓" : ""}
                        </span>
                        <span className="task-name">{task.title}</span>
                      </span>

                      <span className="user-cell">
                        <span className="user-avatar">U{task.userId}</span>
                        <span>User {task.userId}</span>
                      </span>

                      <span>
                        <span
                          className={`status-badge ${
                            task.completed ? "done" : "pending"
                          }`}
                        >
                          {task.completed ? "Completed" : "Pending"}
                        </span>
                      </span>

                      <span className="row-arrow">›</span>
                    </button>
                  ))}
                </div>

                <div className="pagination">
                  <span className="pagination-info">
                    Showing{" "}
                    {filteredTasks.length === 0
                      ? 0
                      : (currentPage - 1) * PAGE_SIZE + 1}
                    –
                    {Math.min(
                      currentPage * PAGE_SIZE,
                      filteredTasks.length
                    )}{" "}
                    of {filteredTasks.length} tasks
                  </span>

                  <div className="pagination-controls">
                    <button
                      type="button"
                      className="page-arrow"
                      onClick={() => changePage(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                    >
                      ‹
                    </button>

                    {pageNumbers.map((pageNumber) => (
                      <button
                        key={pageNumber}
                        type="button"
                        className={`page-number ${
                          currentPage === pageNumber ? "current" : ""
                        }`}
                        onClick={() => changePage(pageNumber)}
                        aria-current={
                          currentPage === pageNumber ? "page" : undefined
                        }
                        aria-label={`Go to page ${pageNumber}`}
                      >
                        {pageNumber}
                      </button>
                    ))}

                    <button
                      type="button"
                      className="page-arrow"
                      onClick={() => changePage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                    >
                      ›
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>

          {selectedTask && (
            <aside className="details-panel">
              <div className="details-heading">
                <h2>Task Details</h2>
                <button
                  className="close-details"
                  type="button"
                  onClick={() => {
                    setSelectedTask(null);
                    setActionNotice("");
                  }}
                  aria-label="Close task details"
                >
                  ×
                </button>
              </div>

              <div className="details-card">
                <h3>{selectedTask.title}</h3>

                <span
                  className={`status-badge detail-status ${
                    selectedTask.completed ? "done" : "pending"
                  }`}
                >
                  {selectedTask.completed ? "Completed" : "Pending"}
                </span>

                <div className="detail-field">
                  <span className="detail-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
                    </svg>
                  </span>
                  <div>
                    <span>User ID</span>
                    <strong>{selectedTask.userId}</strong>
                  </div>
                </div>

                <div className="detail-field">
                  <span className="detail-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="4" y="5" width="16" height="16" rx="2" />
                      <path d="M8 3v4M16 3v4M4 10h16" />
                    </svg>
                  </span>
                  <div>
                    <span>Task ID</span>
                    <strong>{selectedTask.id}</strong>
                  </div>
                </div>

                <div className="detail-field">
                  <span className="detail-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                      <path d="M14 2v6h6M8 13h8M8 17h8" />
                    </svg>
                  </span>
                  <div>
                    <span>Title</span>
                    <strong>{selectedTask.title}</strong>
                  </div>
                </div>

                <div className="detail-description">
                  <h4>Description</h4>
                  <p>
                    This is a sample task from the JSONPlaceholder API.
                  </p>
                </div>

                {actionNotice ? (
                  <div
                    className="task-success"
                    role="status"
                    aria-live="polite"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <path
                        d="m7.5 12.2 3 3 6-6.3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{actionNotice}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    className={`status-action-button ${
                      selectedTask.completed
                        ? "make-pending"
                        : "make-completed"
                    }`}
                    onClick={toggleTaskStatus}
                  >
                    {selectedTask.completed ? (
                      <>
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M3 12a9 9 0 1 0 3-6.7" />
                          <path d="M3 4v5h5" />
                        </svg>
                        Mark as Pending
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="m5 12 4.5 4.5L19 7" />
                        </svg>
                        Mark as Completed
                      </>
                    )}
                  </button>
                )}
              </div>
            </aside>
          )}
        </section>
      </section>
    </main>
  );
}
