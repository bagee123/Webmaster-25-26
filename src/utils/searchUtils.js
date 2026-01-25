/**
 * Search Utilities - Centralized search functionality for consistent filtering
 * Used across Blog, Events, Forum, and Resources pages
 */

/**
 * Normalize text for case-insensitive search
 * @param {string} text - Text to normalize
 * @returns {string} Normalized text
 */
export const normalizeSearchText = (text) => {
  if (!text) return '';
  return text.toLowerCase().trim();
};

/**
 * Check if an item matches search query
 * @param {object} item - Item to search (blog post, event, resource, forum topic)
 * @param {string} query - Search query string
 * @param {array} searchFields - Fields to search in the item
 * @returns {boolean} True if item matches search query
 */
export const matchesSearch = (item, query, searchFields = ['title', 'name', 'excerpt', 'description']) => {
  if (!query || query.trim() === '') {
    return true;
  }

  const normalizedQuery = normalizeSearchText(query);

  // Search through specified fields
  for (const field of searchFields) {
    if (item[field]) {
      const fieldValue = normalizeSearchText(item[field]);
      if (fieldValue.includes(normalizedQuery)) {
        return true;
      }
    }
  }

  // Also search tags if available
  if (item.tags && Array.isArray(item.tags)) {
    for (const tag of item.tags) {
      if (normalizeSearchText(tag).includes(normalizedQuery)) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Filter array of items based on search query and optional category
 * @param {array} items - Items to filter
 * @param {string} query - Search query
 * @param {string} category - Optional category filter
 * @param {string} categoryField - Field name for category (default: 'category')
 * @param {array} searchFields - Fields to search (default: ['title', 'name', 'excerpt', 'description'])
 * @returns {array} Filtered items
 */
export const filterBySearch = (
  items,
  query,
  category = null,
  categoryField = 'category',
  searchFields = ['title', 'name', 'excerpt', 'description']
) => {
  return items.filter(item => {
    // Check category filter if provided
    if (category && category !== 'All' && item[categoryField] !== category) {
      return false;
    }

    // Check search query
    return matchesSearch(item, query, searchFields);
  });
};

/**
 * Highlight search results by wrapping matched text
 * @param {string} text - Text to highlight
 * @param {string} query - Search query to highlight
 * @param {string} className - CSS class for highlight span (default: 'search-highlight')
 * @returns {string} HTML string with highlighted text
 */
export const highlightSearchResults = (text, query, className = 'search-highlight') => {
  if (!text || !query || query.trim() === '') {
    return text;
  }

  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');

  return text.replace(regex, `<span class="${className}">$1</span>`);
};

/**
 * Sort search results by relevance (exact matches first, then partial matches)
 * @param {array} items - Items to sort
 * @param {string} query - Search query
 * @param {array} searchFields - Fields to check for relevance
 * @returns {array} Sorted items
 */
export const sortByRelevance = (
  items,
  query,
  searchFields = ['title', 'name', 'excerpt', 'description']
) => {
  if (!query || query.trim() === '') {
    return items;
  }

  const normalizedQuery = normalizeSearchText(query);

  return items.sort((a, b) => {
    // Check for exact field matches
    for (const field of searchFields) {
      const aValue = normalizeSearchText(a[field] || '');
      const bValue = normalizeSearchText(b[field] || '');

      const aExact = aValue === normalizedQuery;
      const bExact = bValue === normalizedQuery;

      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      // Check for starts with
      const aStarts = aValue.startsWith(normalizedQuery);
      const bStarts = bValue.startsWith(normalizedQuery);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
    }

    return 0;
  });
};

/**
 * Get search suggestions based on common terms
 * @param {array} items - Items to search
 * @param {string} query - Partial search query
 * @param {array} searchFields - Fields to search
 * @param {number} maxSuggestions - Maximum suggestions to return
 * @returns {array} Array of suggestion objects {text, count}
 */
export const getSearchSuggestions = (
  items,
  query,
  searchFields = ['title', 'name', 'excerpt', 'description'],
  maxSuggestions = 5
) => {
  if (!query || query.trim() === '') {
    return [];
  }

  const normalizedQuery = normalizeSearchText(query);
  const matches = new Map();

  for (const item of items) {
    for (const field of searchFields) {
      if (item[field]) {
        const fieldValue = normalizeSearchText(item[field]);

        // Extract words that start with the query
        const words = fieldValue.split(/\s+/);
        for (const word of words) {
          if (word.startsWith(normalizedQuery)) {
            matches.set(word, (matches.get(word) || 0) + 1);
          }
        }
      }
    }
  }

  // Sort by frequency and return top suggestions
  return Array.from(matches.entries())
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, maxSuggestions);
};
