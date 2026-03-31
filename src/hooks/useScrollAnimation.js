import { useEffect } from 'react';

export function useScrollAnimation() {
  useEffect(() => {
    const selector =
      '.popular-categories-section, .categories-header, .category-button, ' +
      '.events-section, .event-card, ' +
      '.highlights-header, ' +
      '.testimonial-header, ' +
      '.resource-form__field';

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.dataset.scrollAnimated === 'true') {
            observer.unobserve(entry.target);
            return;
          }

          entry.target.dataset.scrollAnimated = 'true';
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const observeIfNeeded = (el) => {
      if (el.dataset.scrollAnimated === 'true' || el.classList.contains('animate')) {
        return;
      }

      observer.observe(el);
    };

    // Observe all animatable elements
    const animatableElements = document.querySelectorAll(selector);
    animatableElements.forEach(observeIfNeeded);

    // Observe dynamically inserted elements (e.g. async fetched event cards)
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) {
            return;
          }

          if (node.matches(selector)) {
            observeIfNeeded(node);
          }

          const nestedMatches = node.querySelectorAll?.(selector);
          nestedMatches?.forEach(observeIfNeeded);
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);
}
