import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import '../css/scrollToTop.css';

export default function ScrollToTop() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    showButton && (
      <button
        onClick={handleScrollTop}
        className="scroll-to-top-btn"
        type="button"
        title="Scroll to top"
        aria-label="Scroll to top"
      >
        <ArrowUp size={36} />
      </button>
    )
  );
}
