/**
 * Global Search Component with Consistent Functionality
 * Provides unified search across all pages
 */

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Search, X, Loader } from 'lucide-react';
import '../css/globalSearch.css';

const GlobalSearch = ({
  items = [],
  onSearchChange,
  placeholder = 'Search...',
  searchFields = ['title', 'name', 'excerpt', 'description'],
  showSuggestions = false,
  onSuggestionClick = () => {},
  isLoading = false,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Generate suggestions from items
  const generateSuggestions = (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2 || !showSuggestions) {
      setSuggestions([]);
      return;
    }

    const normalizedQuery = searchQuery.toLowerCase().trim();
    const suggestionSet = new Set();

    for (const item of items) {
      for (const field of searchFields) {
        if (item[field]) {
          const fieldValue = item[field].toLowerCase();
          if (fieldValue.includes(normalizedQuery)) {
            // Extract relevant text snippet
            const index = fieldValue.indexOf(normalizedQuery);
            const start = Math.max(0, index - 20);
            const end = Math.min(fieldValue.length, index + normalizedQuery.length + 20);
            const snippet = fieldValue.substring(start, end);
            suggestionSet.add(snippet);
          }
        }
      }
    }

    setSuggestions(Array.from(suggestionSet).slice(0, 5));
  };

  // Handle search input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    generateSuggestions(value);
    onSearchChange(value);
    setShowDropdown(value.length > 0 && showSuggestions);
  };

  // Handle clear button
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    onSearchChange('');
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    onSearchChange(suggestion);
    onSuggestionClick(suggestion);
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + K for focus
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }

      // Escape to close suggestions
      if (e.key === 'Escape') {
        setShowDropdown(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`global-search ${className}`}>
      <div className="global-search-container" ref={dropdownRef}>
        <div className="global-search-input-wrapper">
          <Search className="global-search-icon" size={20} aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            className="global-search-input"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={() => showSuggestions && setShowDropdown(query.length > 0)}
            aria-label="Search"
            aria-autocomplete="list"
            aria-expanded={showDropdown && suggestions.length > 0}
            role="combobox"
          />
          {isLoading && <Loader className="global-search-loader" size={20} aria-hidden="true" />}
          {query && !isLoading && (
            <button
              type="button"
              className="global-search-clear"
              onClick={handleClear}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <div className="global-search-suggestions" role="listbox">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="global-search-suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
                role="option"
              >
                <Search size={16} />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        )}

        {/* No results message */}
        {showDropdown && query.length > 0 && suggestions.length === 0 && (
          <div className="global-search-no-results">
            No suggestions found
          </div>
        )}
      </div>

      {/* Keyboard shortcut hint (optional) */}
      <div className="global-search-hint" aria-label="Keyboard shortcut hint">
        <kbd>⌘</kbd>K
      </div>
    </div>
  );
};

GlobalSearch.propTypes = {
  items: PropTypes.array,
  onSearchChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  searchFields: PropTypes.array,
  showSuggestions: PropTypes.bool,
  onSuggestionClick: PropTypes.func,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
};

export default GlobalSearch;
