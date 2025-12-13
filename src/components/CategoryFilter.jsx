/**
 * Reusable Category Filter Component
 * Accepts categories array, selected value, onChange callback, and optional className
 */

const CategoryFilter = ({ categories, selected, onChange, className = '' }) => {
  return (
    <div className={`category-filters ${className}`}>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`category-btn ${selected === category ? 'active' : ''}`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
