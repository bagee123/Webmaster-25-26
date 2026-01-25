import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export const ResourceContext = createContext();

export function ResourceProvider({ children }) {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [savedItems, setSavedItems] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'resources'));
        const resourcesData = [];
        querySnapshot.forEach((doc) => {
          resourcesData.push(doc.data());
        });
        setResources(resourcesData);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchResources();
  }, []);

  const loadUserData = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setSavedItems(userData.savedItems || []);
        setUserEvents(userData.userEvents || []);
      } else {
        await setDoc(userDocRef, {
          email: user?.email || '',
          savedItems: [],
          userEvents: [],
          createdAt: new Date(),
        }, { merge: true });
        setSavedItems([]);
        setUserEvents([]);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      loadUserData(user.uid);
    } else {
      setSavedItems([]);
      setUserEvents([]);
    }
  }, [user?.uid]);

  const toggleSavedItem = async (resourceId) => {
    try {
      if (!user?.uid) {
        return;
      }

      const id = Number(resourceId);
      const isSaved = savedItems.includes(id);
      const newSavedItems = isSaved 
        ? savedItems.filter(itemId => itemId !== id)
        : [...savedItems, id];
      
      setSavedItems(newSavedItems);
      
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { savedItems: newSavedItems }, { merge: true });
      
    } catch (error) {
      console.error('Error toggling saved item:', error);
      if (user?.uid) {
        loadUserData(user.uid);
      }
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
        await setDoc(userDocRef, { userEvents: newUserEvents }, { merge: true });
      }
    } catch (error) {
      console.error('Error toggling user event:', error);
    }
  };

  const getSavedResources = () => {
    return resources.filter(resource => savedItems.includes(Number(resource.id)));
  };

  return (
    <ResourceContext.Provider value={{
      resources,
      allResources: resources,
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