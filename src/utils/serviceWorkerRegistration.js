/**
 * Service Worker Registration Utility
 * Handles registration and updates for service worker with offline support
 */

export async function registerServiceWorker() {
  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers are not supported in this browser');
    return;
  }

  try {
    // Register the service worker
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
      updateViaCache: 'none', // Always fetch fresh service worker
    });

    console.log('Service Worker registered successfully:', registration.scope);

    // Check for updates periodically
    setInterval(() => {
      registration.update();
    }, 60000); // Check every minute

    // Listen for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New service worker is ready
          console.log('Service Worker update available');
          
          // Optionally notify user about update
          // You can emit a custom event or show a notification
          window.dispatchEvent(new CustomEvent('service-worker-update', {
            detail: { registration }
          }));
        }
      });
    });

    // Handle controller change
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker controller changed');
    });

  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
}

/**
 * Unregister all service workers (useful for cleanup)
 */
export async function unregisterServiceWorkers() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
      console.log('Service Worker unregistered');
    }
  } catch (error) {
    console.error('Service Worker unregistration failed:', error);
  }
}
