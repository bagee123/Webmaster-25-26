import React from 'react';
import Hero from '../components/Hero';
import PopularCategories from '../components/PopularCategories';
import ResourceDirectory from '../components/ResourceDirectory';
import EventsStrip from '../components/EventsStrip';

export default function Home() {
    return (
        <>
            <Hero />
            <PopularCategories />
            <ResourceDirectory />
            <EventsStrip />
        </>
    );
}
