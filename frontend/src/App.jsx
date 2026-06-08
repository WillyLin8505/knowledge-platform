import { useState, useEffect } from 'react';
import SearchInput from './components/SearchInput.jsx';
import CategorySection from './components/CategorySection.jsx';
import Sidebar from './components/Sidebar.jsx';

const STORAGE_KEY = 'knowledge-history';

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []; }
  catch { return []; }
}

function saveHistory(h) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(h));
}

export default function App() {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [history, setHistory] = useState(loadHistory);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => { saveHistory(history); }, [history]);

  function addToHistory(data) {
    const id = Date.now().toString();
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.topic !== data.topic);
      return [{ id, ...data }, ...filtered].slice(0, 30);
    });
    setActiveId(id);
  }

  async function handleSearch(topic) {
    setStatus('loading');
    setResult(null);
    setErrorMsg('');
    try {
      const API = import.meta.env.VITE_API_URL ?? '';
      const res = await fetch(`${API}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || '伺服器發生錯誤');
      }
      const data = await res.json();
      setResult(data);
      setStatus('done');
      addToHistory(data);
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  }

  function handleSidebarSelect(item) {
    setResult(item);
    setStatus('done');
    setActiveId(item.id);
  }

  function handleSidebarDelete(id) {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    if (activeId === id) { setResult(null); setStatus('idle'); setActiveId(null); }
  }

  return (
    <div className="layout">
      <Sidebar
        history={history}
        activeId={activeId}
        onSelect={handleSidebarSelect}
        onDelete={handleSidebarDelete}
      />

      <main className="main">
        <header className="app-header">
          <h1>知識學習平台</h1>
          <p className="subtitle">輸入任何你想學習的領域，AI 幫你整理必備專有名詞</p>
        </header>

        <SearchInput onSearch={handleSearch} disabled={status === 'loading'} />

        {status === 'loading' && (
          <div className="loading">
            <div className="spinner" />
            <span>Claude 分析中，請稍候…</span>
          </div>
        )}

        {status === 'error' && (
          <div className="error-box">
            <strong>發生錯誤：</strong> {errorMsg}
          </div>
        )}

        {status === 'done' && result && (
          <div className="result">
            <h2 className="result-topic">「{result.topic}」的核心專有名詞</h2>
            {result.categories.map((cat, i) => (
              <CategorySection key={i} category={cat} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
