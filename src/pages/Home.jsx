import React from 'react';
import Hero from '../components/Hero';
import ResourceDirectory from '../components/ResourceDirectory';
import EventsStrip from '../components/EventsStrip';

export default function Home() {
    return (
        <>
            <Hero />
            <ResourceDirectory />
            <EventsStrip />
        </>
    );
}
