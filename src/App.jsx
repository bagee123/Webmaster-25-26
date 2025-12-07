import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PopularCategories from './components/PopularCategories';
import ResourceDirectory from './components/ResourceDirectory';
import EventsStrip from './components/EventsStrip';
import HighlightSpotlight from './components/HighlightSpotlight';
import { ResourceProvider } from './context/ResourceContext';

export default function App() {
  return (
    <ResourceProvider>
      <Navbar />
      <Hero />
      <PopularCategories />
      <ResourceDirectory />
      <EventsStrip />
      <HighlightSpotlight />
    </ResourceProvider>
  );
}
