/**
 * Reusable Sort Dropdown Component
 * Accepts options array, selected value, onChange callback, and optional className
 */

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

export default SortDropdown;
