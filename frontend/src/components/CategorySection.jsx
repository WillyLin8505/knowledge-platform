import TermCard from './TermCard.jsx';

export function catId(catName) {
  return 'cat-' + catName.replace(/\s+/g, '-').replace(/[^\w一-鿿-]/g, '');
}

export default function CategorySection({ category }) {
  return (
    <div className="category-section" id={catId(category.name)}>
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
