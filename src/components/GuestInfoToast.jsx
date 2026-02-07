import { useEffect, useRef } from 'react';
import { useToast } from '../context/ToastContext';

/**
 * Guest Info Toast Component
 * Displays guest login credentials as a non-intrusive toast
 * Shows once per page load (clears on browser refresh)
 * Doesn't pile up when navigating between pages
 */
export default function GuestInfoToast() {
  const { showInfo } = useToast();
  const hasShownToast = useRef(false);

  useEffect(() => {
    // Show guest credentials info only once per component mount cycle
    // useRef persists during navigation, sessionStorage would survive refreshes
    // This approach shows toast on page refresh, but not on repeated nav visits in same session
    if (!hasShownToast.current) {
      showInfo('Guest Credentials - Email: testemail@gmail.com | Password: Test123# - Use this to test all features of the website comprehensively.', 0);
      hasShownToast.current = true;
    }
  }, [showInfo]);

  return null;
}
