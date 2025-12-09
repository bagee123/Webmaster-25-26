import React from 'react';
import ResourceDirectory from '../components/ResourceDirectory';
import '../css/resourcesPage.css';

export default function ResourceDirectoryPage() {
  return (
    <>
      <div className="resources-hero">
        <div className="resources-hero-content">
          <h1>Community Resource Directory</h1>
          <p>
            Browse and search through our comprehensive database of local services and support
          </p>
        </div>
      </div>
      <ResourceDirectory />
    </>
  );
}
