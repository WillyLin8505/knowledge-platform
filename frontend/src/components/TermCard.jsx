export default function TermCard({ term }) {
  return (
    <div className="term-card">
      <div className="term-title">
        <span className="term-zh">{term.term}</span>
        {term.english && <span className="term-en">{term.english}</span>}
      </div>
      <div className="term-explanation">{term.explanation}</div>
      {term.example && (
        <div className="term-example">{term.example}</div>
      )}
    </div>
  );
}
