import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PopularCategories from './components/PopularCategories';
import ResourceDirectory from './components/ResourceDirectory';
import EventsStrip from './components/EventsStrip';
import HighlightSpotlight from './components/HighlightSpotlight';
import Footer from './components/Footer';
import { ResourceProvider } from './context/ResourceContext';
import ResourceForm from './components/ResourceForm';
export default function App() {
  return (
    <ResourceProvider>
      <Navbar />
      <Hero />
      <PopularCategories />
      <ResourceDirectory />
      <EventsStrip />
      <section id="submit-resource">
        <ResourceForm />
      </section>
      <HighlightSpotlight />
      <Footer />
    </ResourceProvider>
  );
}
