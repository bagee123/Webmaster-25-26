/**
 * Reusable Category Filter Component
 * Accepts categories array, selected value, onChange callback, and optional className
 */

import PropTypes from 'prop-types';

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

CategoryFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default CategoryFilter;
