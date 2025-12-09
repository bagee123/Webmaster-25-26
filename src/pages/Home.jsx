import React from 'react';
import Hero from '../components/Hero';
import PopularCategories from '../components/PopularCategories';
import EventsStrip from '../components/EventsStrip';
import HighlightSpotlight from '../components/HighlightSpotlight';
import ResourceForm from '../components/ResourceForm';

export default function Home() {
  return (
    <>
      <Hero />
      <PopularCategories />
      <EventsStrip />
      <HighlightSpotlight />
      <section id="submit-resource">
        <ResourceForm />
      </section>
    </>
  );
}
