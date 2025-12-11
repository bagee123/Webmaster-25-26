import { useEffect } from 'react';

export function useScrollAnimation() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all animatable elements
    const animatableElements = document.querySelectorAll(
      '.hero-section, .hero-overlay, .hero-content h1, .hero-content p, .hero-buttons, .stat-card, ' +
      '.popular-categories-section, .categories-header, .category-button, ' +
      '.events-section, .event-card, ' +
      '.highlights-section, .highlights-header, ' +
      '.testimonial-section, .testimonial-header, ' +
      '.resource-form-container, .resource-form, .resource-form__field'
    );

    animatableElements.forEach((el) => observer.observe(el));

    return () => {
      animatableElements.forEach((el) => observer.unobserve(el));
    };
  }, []);
}
