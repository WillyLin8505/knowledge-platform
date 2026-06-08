export default function Sidebar({ history, activeId, onSelect, onDelete }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M4 6h16M4 12h16M4 18h10"/>
        </svg>
        知識大綱
      </div>

      <nav className="sidebar-nav">
        {history.length === 0 ? (
          <div className="sidebar-empty">查詢後會出現在這裡</div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className={`sidebar-item ${item.id === activeId ? 'sidebar-item--active' : ''}`}
            >
              <button className="sidebar-topic" onClick={() => onSelect(item)}>
                {item.topic}
              </button>
              <div className="sidebar-cats">
                {item.categories.map((cat, i) => (
                  <div key={i} className="sidebar-cat">
                    <span className="sidebar-dot" />
                    {cat.name}
                  </div>
                ))}
              </div>
              <button
                className="sidebar-delete"
                onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                title="刪除"
              >
                ×
              </button>
            </div>
          ))
        )}
      </nav>
    </aside>
  );
}
