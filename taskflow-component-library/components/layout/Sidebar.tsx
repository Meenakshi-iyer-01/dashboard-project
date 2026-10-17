import { Icon } from "@/components/ui/Icon";

export function Sidebar({ onShowAll }: { onShowAll: () => void }) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#" aria-label="TaskFlow home"><span className="brand-mark">✳</span><span>TaskFlow</span></a>
      <p className="nav-label">WORKSPACE</p>
      <button className="nav-item active" type="button"><Icon name="grid" />Dashboard</button>
      <button className="nav-item" type="button" onClick={onShowAll}><Icon name="list" />All Tasks</button>
      <div className="sidebar-divider" />
      <p className="nav-label">GENERAL</p>
      <div className="nav-item muted"><Icon name="settings" />Settings</div>
      <div className="nav-item muted"><Icon name="help" />Help</div>
      <div className="sidebar-promo">
        <div className="promo-art"><span className="promo-blob" /><span className="promo-sparkle">✦</span></div>
        <h3>Stay organised</h3><p>Manage your tasks efficiently and achieve more.</p>
      </div>
    </aside>
  );
}
