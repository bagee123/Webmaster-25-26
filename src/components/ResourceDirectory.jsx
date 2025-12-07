import React, { useContext } from 'react';
import { ResourceContext } from '../context/ResourceContext';
import ResourceCard from './ResourceCard';
import '../css/directory.css';


export default function ResourceDirectory() {
    const { resources, search, setSearch, setSort } = useContext(ResourceContext);


return (
    <section id="resources" className="directory">
        <h3>Resource Directory</h3>
        <p>Find the support and services you need in our community</p>


        <div className="controls">
            <input
                type="text"
                placeholder="Search resources..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <select onChange={e => setSort(e.target.value)}>
                <option value="name">Sort by Name</option>
            </select>
        </div>


        <div className="tags">
            {['Health','Education','Volunteering','Events','Support Services','Recreation','Nonprofits','More']
            .map(tag => (<span key={tag} className="tag">{tag}</span>))}
        </div>


        <div className="grid">
            {resources.map(res => <ResourceCard key={res.title} item={res} />)}
        </div>
        </section>
    );
}