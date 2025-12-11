import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import { resources as defaultResources } from '../data/resources';


export const ResourceContext = createContext();


export function ResourceProvider({children}) {
    const [resources] = useState(defaultResources);
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream

ResourceProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
=======
}
>>>>>>> Stashed changes
=======
}
>>>>>>> Stashed changes
