import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import resourcesData from '../data/resources';
import { useAuth } from './AuthContext';
import { auth } from '../../build/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../build/auth';

export const ResourceContext = createContext();

export function ResourceProvider({ children }) {
  const [resources] = useState(resourcesData);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [savedItems, setSavedItems] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load saved items and user events from Firestore
  useEffect(() => {
    if (user?.uid) {
      loadUserData();
    } else {
      setSavedItems([]);
      setUserEvents([]);
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        setSavedItems(userDoc.data().savedItems || []);
        setUserEvents(userDoc.data().userEvents || []);
      } else {
        // Create user doc if it doesn't exist
        await setDoc(userDocRef, {
          email: user.email,
          savedItems: [],
          userEvents: [],
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSavedItem = async (resourceId) => {
    try {
      const isSaved = savedItems.includes(resourceId);
      const newSavedItems = isSaved 
        ? savedItems.filter(id => id !== resourceId)
        : [...savedItems, resourceId];
      
      setSavedItems(newSavedItems);
      
      if (user?.uid) {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { savedItems: newSavedItems });
      }
    } catch (error) {
      console.error('Error toggling saved item:', error);
    }
  };

  const toggleUserEvent = async (eventId) => {
    try {
      const isSignedUp = userEvents.includes(eventId);
      const newUserEvents = isSignedUp
        ? userEvents.filter(id => id !== eventId)
        : [...userEvents, eventId];
      
      setUserEvents(newUserEvents);
      
      if (user?.uid) {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { userEvents: newUserEvents });
      }
    } catch (error) {
      console.error('Error toggling user event:', error);
    }
  };

  const getSavedResources = () => {
    return resources.filter(resource => savedItems.includes(resource.id));
  };

  const filteredResources = resources
    .filter(resource => resource.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'category') return a.category.localeCompare(b.category);
      if (sort === 'newest') return b.id - a.id;
      return a.name.localeCompare(b.name);
    });

  return (
    <ResourceContext.Provider value={{
      resources: filteredResources,
      search,
      setSearch,
      sort,
      setSort,
      savedItems,
      toggleSavedItem,
      getSavedResources,
      userEvents,
      toggleUserEvent,
      loading,
    }}>
      {children}
    </ResourceContext.Provider>
  );
}

ResourceProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useResources = () => {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error('useResources must be used within a ResourceProvider');
  }
  return context;
};
