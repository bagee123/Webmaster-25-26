import React, { createContext, useState } from 'react';
import { resources as defaultResources } from '../data/resources';


export const ResourceContext = createContext();


export function ResourceProvider({ children }) {
    const [resources, setResources] = useState(defaultResources);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('name');


    const filteredResources = resources
        .filter(r => r.title.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => a.title.localeCompare(b.title));


    return (
        <ResourceContext.Provider value={{ resources: filteredResources, search, setSearch, sort, setSort }}>
            {children}
        </ResourceContext.Provider>
);
}