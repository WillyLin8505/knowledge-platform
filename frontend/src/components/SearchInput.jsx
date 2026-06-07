import { useState } from 'react';

export default function SearchInput({ onSearch, disabled }) {
  const [value, setValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        className="search-input"
        type="text"
        placeholder="輸入想學習的領域，例如：機器學習、區塊鏈、量子計算…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
      />
      <button className="search-btn" type="submit" disabled={disabled || !value.trim()}>
        分析
      </button>
    </form>
  );
}
