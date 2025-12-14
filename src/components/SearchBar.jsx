/**
 * Reusable Search Bar Component
 * Accepts placeholder, value, onChange, and optional className
 */

import { Search } from 'lucide-react';
import PropTypes from 'prop-types';

const SearchBar = ({ placeholder = 'Search...', value, onChange, className = '' }) => {
  return (
    <div className={`search-wrapper ${className}`}>
      <div className="search-box">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="search-input"
        />
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default SearchBar;
