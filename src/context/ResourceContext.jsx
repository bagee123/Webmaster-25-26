import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import resourcesData from '../data/resources';

export const ResourceContext = createContext();

export function ResourceProvider({ children }) {
  const [resources] = useState(resourcesData);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');

  const filteredResources = resources
    .filter(resource => resource.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'category') return a.category.localeCompare(b.category);
      if (sort === 'newest') return b.id - a.id;
      return a.name.localeCompare(b.name);
    });

  return (
    <ResourceContext.Provider value={{ resources: filteredResources, search, setSearch, sort, setSort }}>
      {children}
    </ResourceContext.Provider>
  );
}

ResourceProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
