import TermCard from './TermCard.jsx';

export default function CategorySection({ category }) {
  return (
    <div className="category-section">
      <div className="category-header">
        <div className="category-name">{category.name}</div>
        {category.description && (
          <div className="category-desc">{category.description}</div>
        )}
      </div>
      <div className="terms-grid">
        {category.terms.map((term, i) => (
          <TermCard key={i} term={term} />
        ))}
      </div>
    </div>
  );
}
