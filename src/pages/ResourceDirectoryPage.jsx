import React from 'react';
import ResourceDirectory from '../components/ResourceDirectory';
import PageHero from '../components/PageHero';
import '../css/resourcesPage.css';

export default function ResourceDirectoryPage() {
  return (
    <>
      <PageHero
        title="Community Resource Directory"
        subtitle="Browse and search through our comprehensive database of local services and support"
        className="resources-hero"
      />
      <ResourceDirectory />
    </>
  );
}
