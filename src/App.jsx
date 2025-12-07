import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ResourceDirectory from './components/ResourceDirectory';
import { ResourceProvider } from './context/ResourceContext';


export default function App() {
  return (
    <ResourceProvider>
    <Navbar />
    <Hero />
    <ResourceDirectory />
    </ResourceProvider>
  );
}
