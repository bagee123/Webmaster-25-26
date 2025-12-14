/**
 * Reusable Sort Dropdown Component
 * Accepts options array, selected value, onChange callback, and optional className
 */

import PropTypes from 'prop-types';

const SortDropdown = ({ options, selected, onChange, className = '' }) => {
  return (
    <div className={`sort-wrapper ${className}`}>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="sort-select"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

SortDropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  selected: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default SortDropdown;
