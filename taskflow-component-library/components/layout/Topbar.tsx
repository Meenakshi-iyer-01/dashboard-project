import { Icon } from "@/components/ui/Icon";

type TopbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  darkMode: boolean;
  onToggleTheme: () => void;
};

export function Topbar({ search, onSearchChange, darkMode, onToggleTheme }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="welcome"><p className="welcome-label">Welcome back</p><h1>Your Task Dashboard</h1><p className="subtitle">Keep track of your tasks and progress.</p></div>
      <div className="topbar-actions">
        <label className="global-search"><Icon name="search" /><input type="search" placeholder="Search tasks..." value={search} onChange={(e) => onSearchChange(e.target.value)} aria-label="Search all tasks" /><span className="shortcut">⌘ K</span></label>
        <button className="icon-button theme-toggle" type="button" onClick={onToggleTheme} aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"} title={darkMode ? "Switch to light mode" : "Switch to dark mode"}><Icon name={darkMode ? "sun" : "moon"} /></button>
        <button className="icon-button notification-button" type="button" aria-label="Notifications"><Icon name="bell" /><span className="notification-dot" /></button>
        <div className="workspace-menu"><span className="workspace-avatar">TF</span><span>My workspace</span><span className="chevron">⌄</span></div>
      </div>
    </header>
  );
}
