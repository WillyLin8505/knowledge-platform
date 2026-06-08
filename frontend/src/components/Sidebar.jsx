import { useState } from 'react';

function ChevronIcon({ open }) {
  return (
    <svg
      width="10" height="10" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s', flexShrink: 0 }}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function TopicEntry({ item, isActive, onSelect, onDelete }) {
  const [open, setOpen] = useState(isActive);

  return (
    <div className={`sidebar-item ${isActive ? 'sidebar-item--active' : ''}`}>
      {/* Topic row */}
      <div className="sidebar-topic-row">
        <button className="sidebar-chevron" onClick={() => setOpen((o) => !o)}>
          <ChevronIcon open={open} />
        </button>
        <button className="sidebar-topic" onClick={() => { onSelect(item); setOpen(true); }}>
          {item.topic}
        </button>
        <button
          className="sidebar-delete"
          onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
          title="刪除"
        >×</button>
      </div>

      {/* Categories + terms */}
      {open && (
        <div className="sidebar-tree">
          {item.categories.map((cat, ci) => (
            <div key={ci} className="sidebar-cat-group">
              <div className="sidebar-cat-name">{cat.name}</div>
              {cat.terms.map((term, ti) => (
                <div key={ti} className="sidebar-term">
                  {term.term}
                  {term.english && <span className="sidebar-term-en"> {term.english}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ history, activeId, onSelect, onDelete }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
        知識大綱
      </div>

      <nav className="sidebar-nav">
        {history.length === 0 ? (
          <div className="sidebar-empty">查詢後會出現在這裡</div>
        ) : (
          history.map((item) => (
            <TopicEntry
              key={item.id}
              item={item}
              isActive={item.id === activeId}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))
        )}
      </nav>
    </aside>
  );
}
