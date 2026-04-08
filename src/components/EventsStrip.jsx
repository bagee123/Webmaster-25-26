import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import localEvents from '../data/events';
import '../css/events.css';

const MAX_UPCOMING_EVENTS = 8;
const AUTO_SCROLL_MS = 2600;

const toDate = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value?.toDate === 'function') {
    return value.toDate();
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'number') {
    return new Date(value);
  }

  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return null;
};

const getDateBadge = (value) => {
  const parsedDate = toDate(value);
  if (!parsedDate) {
    return { month: 'UP', day: '!' };
  }

  return {
    month: parsedDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: String(parsedDate.getDate())
  };
};

const normalizeEvent = (event, fallbackId) => {
  const dateValue = event.eventDate || event.date;
  const parsedDate = toDate(dateValue);

  return {
    id: event.id ?? fallbackId,
    name: event.name || 'Community Event',
    date: event.date || (parsedDate ? parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date TBD'),
    time: event.time || 'Time TBD',
    location: event.location || event.address || 'Coppell',
    eventDate: parsedDate
  };
};

const sortByUpcomingDate = (a, b) => {
  if (a.eventDate && b.eventDate) {
    return a.eventDate - b.eventDate;
  }

  if (a.eventDate) {
    return -1;
  }

  if (b.eventDate) {
    return 1;
  }

  return 0;
};

const getCardsPerView = () => {
  if (typeof window === 'undefined') {
    return 3;
  }

  if (window.innerWidth <= 640) {
    return 1;
  }

  if (window.innerWidth <= 1024) {
    return 2;
  }

  return 3;
};

export default function EventsStrip() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [cardsPerView, setCardsPerView] = useState(getCardsPerView);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [disableCardTransitions, setDisableCardTransitions] = useState(false);

  const scrollWrapperRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const interactionTimeoutRef = useRef(null);
  const programmaticScrollTimeoutRef = useRef(null);
  const activeIndexRef = useRef(0);
  const isJumpingRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);

  const previousBodyOverflowRef = useRef('');
  const previousHtmlOverflowRef = useRef('');

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(getCardsPerView());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'events'));
        const firebaseEvents = snapshot.docs
          .map((doc, index) => normalizeEvent({ id: doc.id, ...doc.data() }, index + 1))
          .sort(sortByUpcomingDate)
          .slice(0, MAX_UPCOMING_EVENTS);

        if (firebaseEvents.length > 0) {
          setEvents(firebaseEvents);
          return;
        }
      } catch (error) {
        console.error('Error fetching events from Firestore:', error);
      }

      const fallbackEvents = localEvents
        .map((event, index) => normalizeEvent(event, index + 1))
        .sort(sortByUpcomingDate)
        .slice(0, MAX_UPCOMING_EVENTS);

      setEvents(fallbackEvents);
    };

    fetchUpcomingEvents();
  }, []);

  const mappedEvents = useMemo(() => {
    return events.map((event) => {
      const badge = getDateBadge(event.eventDate || event.date);
      return {
        ...event,
        badgeMonth: badge.month,
        badgeDay: badge.day
      };
    });
  }, [events]);

  const cloneCount = useMemo(() => {
    if (mappedEvents.length === 0) {
      return 0;
    }

    return Math.min(cardsPerView, mappedEvents.length);
  }, [cardsPerView, mappedEvents.length]);

  const loopedEvents = useMemo(() => {
    if (mappedEvents.length === 0) {
      return [];
    }

    if (mappedEvents.length === 1) {
      return mappedEvents;
    }

    const head = mappedEvents.slice(0, cloneCount);
    const tail = mappedEvents.slice(-cloneCount);

    return [...tail, ...mappedEvents, ...head];
  }, [cloneCount, mappedEvents]);

  const realActiveIndex = useMemo(() => {
    if (mappedEvents.length === 0) {
      return 0;
    }

    if (mappedEvents.length === 1) {
      return 0;
    }

    const normalized = (activeIndex - cloneCount) % mappedEvents.length;
    return (normalized + mappedEvents.length) % mappedEvents.length;
  }, [activeIndex, cloneCount, mappedEvents.length]);

  const getCardOffsets = () => {
    const container = scrollContainerRef.current;
    if (!container) {
      return [];
    }

    return Array.from(container.children).map((card) => card.offsetLeft);
  };

  const getCenteredScrollLeft = (index) => {
    const container = scrollContainerRef.current;
    if (!container) {
      return 0;
    }

    const card = container.children[index];
    if (!card) {
      return 0;
    }

    const cardLeft = card.offsetLeft;
    const cardWidth = card.clientWidth;
    const viewportWidth = container.clientWidth;
    const maxScrollLeft = Math.max(0, container.scrollWidth - viewportWidth);
    const centeredLeft = cardLeft - ((viewportWidth - cardWidth) / 2);

    return Math.min(Math.max(centeredLeft, 0), maxScrollLeft);
  };

  const getNearestLoopedIndex = (targetRealIndex) => {
    if (mappedEvents.length <= 1 || cloneCount === 0) {
      return targetRealIndex;
    }

    const baseTarget = cloneCount + targetRealIndex;
    const active = activeIndexRef.current;
    const candidates = [
      baseTarget,
      baseTarget - mappedEvents.length,
      baseTarget + mappedEvents.length,
    ].filter((candidate) => candidate >= 0 && candidate < loopedEvents.length);

    if (candidates.length === 0) {
      return baseTarget;
    }

    return candidates.reduce((best, current) => {
      return Math.abs(current - active) < Math.abs(best - active) ? current : best;
    });
  };

  const getCardPositionClass = (index) => {
    const distance = Math.abs(index - activeIndex);
    const wrappedDistance = Math.min(distance, Math.max(loopedEvents.length - distance, 0));

    if (wrappedDistance === 0) {
      return 'event-card-center';
    }

    if (wrappedDistance === 1) {
      return 'event-card-side';
    }

    return 'event-card-far';
  };

  const scrollToIndex = (index, behavior = 'smooth') => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const offsets = getCardOffsets();
    if (offsets.length === 0) {
      return;
    }

    const maxIndex = offsets.length - 1;
    const boundedIndex = Math.min(Math.max(index, 0), maxIndex);

    const normalizeLoopIndex = (candidateIndex) => {
      if (mappedEvents.length <= 1 || cloneCount === 0) {
        return candidateIndex;
      }

      const startBoundary = cloneCount;
      const endBoundary = cloneCount + mappedEvents.length - 1;

      if (candidateIndex < startBoundary) {
        return candidateIndex + mappedEvents.length;
      }

      if (candidateIndex > endBoundary) {
        return candidateIndex - mappedEvents.length;
      }

      return candidateIndex;
    };

    if (behavior === 'smooth') {
      isProgrammaticScrollRef.current = true;
      if (programmaticScrollTimeoutRef.current) {
        window.clearTimeout(programmaticScrollTimeoutRef.current);
      }
      programmaticScrollTimeoutRef.current = window.setTimeout(() => {
        isProgrammaticScrollRef.current = false;

        const correctedIndex = normalizeLoopIndex(activeIndexRef.current);
        if (correctedIndex !== activeIndexRef.current) {
          isJumpingRef.current = true;
          jumpToIndex(correctedIndex);
          requestAnimationFrame(() => {
            isJumpingRef.current = false;
          });
        }
      }, 520);
    } else {
      isProgrammaticScrollRef.current = false;
    }

    container.scrollTo({
      left: getCenteredScrollLeft(boundedIndex),
      behavior
    });
    setActiveIndex(boundedIndex);
  };

  const jumpToIndex = (index) => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const previousScrollBehavior = container.style.scrollBehavior;
    const previousSnapType = container.style.scrollSnapType;

    setDisableCardTransitions(true);
    container.style.scrollBehavior = 'auto';
    container.style.scrollSnapType = 'none';
    container.scrollLeft = getCenteredScrollLeft(index);
    setActiveIndex(index);

    requestAnimationFrame(() => {
      container.style.scrollBehavior = previousScrollBehavior;
      container.style.scrollSnapType = previousSnapType;
      requestAnimationFrame(() => {
        setDisableCardTransitions(false);
      });
    });
  };

  useEffect(() => {
    if (mappedEvents.length === 0) {
      return;
    }

    const initialIndex = mappedEvents.length > 1 ? cloneCount : 0;
    setActiveIndex(initialIndex);

    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const setInitialPosition = () => {
      const offsets = getCardOffsets();
      if (offsets.length === 0) {
        return;
      }

      jumpToIndex(initialIndex);
    };

    setInitialPosition();
    requestAnimationFrame(setInitialPosition);
  }, [cloneCount, mappedEvents.length]);

  const startInteractionCooldown = () => {
    setIsUserInteracting(true);

    if (interactionTimeoutRef.current) {
      window.clearTimeout(interactionTimeoutRef.current);
    }

    interactionTimeoutRef.current = window.setTimeout(() => {
      setIsUserInteracting(false);
    }, 1300);
  };

  useEffect(() => {
    const wrapper = scrollWrapperRef.current;
    const container = scrollContainerRef.current;

    if (!wrapper || !container) {
      return undefined;
    }

    const wheelInterceptor = (event) => {
      const canScrollHorizontally = container.scrollWidth > container.clientWidth;
      if (!canScrollHorizontally || mappedEvents.length <= 1) {
        return;
      }

      const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (delta === 0) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      startInteractionCooldown();
      const direction = delta > 0 ? 1 : -1;
      scrollToIndex(activeIndexRef.current + direction);
    };

    wrapper.addEventListener('wheel', wheelInterceptor, { passive: false });

    return () => {
      wrapper.removeEventListener('wheel', wheelInterceptor);
      if (interactionTimeoutRef.current) {
        window.clearTimeout(interactionTimeoutRef.current);
      }
      if (programmaticScrollTimeoutRef.current) {
        window.clearTimeout(programmaticScrollTimeoutRef.current);
      }
      document.body.style.overflowY = previousBodyOverflowRef.current;
      document.documentElement.style.overflowY = previousHtmlOverflowRef.current;
    };
  }, [mappedEvents.length]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || loopedEvents.length === 0) {
      return undefined;
    }

    const handleScroll = () => {
      if (isJumpingRef.current) {
        return;
      }

      if (isProgrammaticScrollRef.current && !isUserInteracting) {
        return;
      }

      const offsets = getCardOffsets();
      if (offsets.length === 0) {
        return;
      }

      const currentCenter = container.scrollLeft + (container.clientWidth / 2);
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      Array.from(container.children).forEach((card, index) => {
        const cardCenter = card.offsetLeft + (card.clientWidth / 2);
        const distance = Math.abs(cardCenter - currentCenter);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      setActiveIndex(nearestIndex);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [isUserInteracting, loopedEvents.length]);

  useEffect(() => {
    if (mappedEvents.length <= 1 || cloneCount === 0) {
      return;
    }

    if (isProgrammaticScrollRef.current) {
      return;
    }

    const startBoundary = cloneCount;
    const endBoundary = cloneCount + mappedEvents.length - 1;

    if (activeIndex < startBoundary || activeIndex > endBoundary) {
      const correctedIndex = activeIndex < startBoundary
        ? activeIndex + mappedEvents.length
        : activeIndex - mappedEvents.length;

      const container = scrollContainerRef.current;
      if (!container) {
        return;
      }

      const offsets = getCardOffsets();
      if (offsets.length === 0) {
        return;
      }

      isJumpingRef.current = true;
      jumpToIndex(correctedIndex);

      const resetJumpFlag = () => {
        isJumpingRef.current = false;
      };

      requestAnimationFrame(resetJumpFlag);
    }
  }, [activeIndex, cloneCount, mappedEvents.length]);

  useEffect(() => {
    if (mappedEvents.length <= 1 || isAutoScrollPaused || isUserInteracting) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      scrollToIndex(activeIndexRef.current + 1);
    }, AUTO_SCROLL_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [activeIndex, isAutoScrollPaused, isUserInteracting, mappedEvents.length]);

  const handleViewAll = () => {
    navigate('/events');
  };

  const handleScrollAreaEnter = () => {
    setIsUserInteracting(true);

    if (!window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    if (previousBodyOverflowRef.current === '') {
      previousBodyOverflowRef.current = document.body.style.overflowY;
      previousHtmlOverflowRef.current = document.documentElement.style.overflowY;
    }

    document.body.style.overflowY = 'hidden';
    document.documentElement.style.overflowY = 'hidden';
  };

  const handleScrollAreaLeave = () => {
    setIsUserInteracting(false);
    document.body.style.overflowY = previousBodyOverflowRef.current;
    document.documentElement.style.overflowY = previousHtmlOverflowRef.current;
  };

  const handleDotClick = (index) => {
    startInteractionCooldown();
    const destination = mappedEvents.length > 1 ? getNearestLoopedIndex(index) : index;
    scrollToIndex(destination);
  };

  const toggleAutoScroll = () => {
    setIsAutoScrollPaused((prev) => !prev);
  };

  return (
    <section id="events" className="events-section">
      <div className="events-container">
        <div className="events-header">
          <div>
            <h3>Upcoming Events</h3>
            <p>Stay connected with community activities and gatherings</p>
          </div>
          <button className="view-all-btn" onClick={handleViewAll}>View All</button>
        </div>

        <div
          ref={scrollWrapperRef}
          className="events-scroll-wrapper"
          onMouseEnter={handleScrollAreaEnter}
          onMouseLeave={handleScrollAreaLeave}
        >
          <div
            ref={scrollContainerRef}
            className={`events-scroll-container ${disableCardTransitions ? 'events-no-card-anim' : ''}`}
            onPointerDown={startInteractionCooldown}
            onTouchStart={startInteractionCooldown}
          >
            {loopedEvents.map((event, index) => (
              <div
                key={`${event.id}-${index}`}
                className={`event-card ${getCardPositionClass(index)}`}
              >
                <div className="event-content">
                  <div className="event-date-badge">
                    <span className="date-month">{event.badgeMonth}</span>
                    <span className="date-day">{event.badgeDay}</span>
                  </div>
                  <div className="event-details">
                    <h4>{event.name}</h4>
                    <div className="event-info">
                      <div className="info-item">
                        <Calendar size={14} />
                        <span>{event.date}</span>
                      </div>
                      <div className="info-item">
                        <Clock size={14} />
                        <span>{event.time}</span>
                      </div>
                      <div className="info-item">
                        <MapPin size={14} />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="events-fade-gradient"></div>
        </div>

        {mappedEvents.length > 0 && (
          <div className="events-carousel-controls">
            <div className="events-dots" aria-label="Event slide navigation">
              {mappedEvents.map((event, index) => (
                <button
                  key={`dot-${event.id}`}
                  type="button"
                  className={`events-dot ${index === realActiveIndex ? 'active' : ''}`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to event ${index + 1}`}
                  aria-pressed={index === realActiveIndex}
                />
              ))}
            </div>

            <button
              type="button"
              className="events-autoplay-toggle"
              onClick={toggleAutoScroll}
              aria-pressed={isAutoScrollPaused}
            >
              {isAutoScrollPaused ? 'Resume Auto Scroll' : 'Pause Auto Scroll'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
