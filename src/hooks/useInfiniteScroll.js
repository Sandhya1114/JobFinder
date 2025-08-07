// // src/hooks/useInfiniteScroll.js
// import { useState, useEffect, useCallback, useRef } from 'react';

// export const useInfiniteScroll = (callback, hasMore, isLoading) => {
//   const [isFetching, setIsFetching] = useState(false);
//   const observerRef = useRef(null);
//   const sentinelRef = useRef(null);

//   // Intersection Observer callback
//   const handleIntersection = useCallback((entries) => {
//     const target = entries[0];
//     if (target.isIntersecting && hasMore && !isLoading && !isFetching) {
//       setIsFetching(true);
//     }
//   }, [hasMore, isLoading, isFetching]);

//   // Set up Intersection Observer
//   useEffect(() => {
//     const options = {
//       root: null,
//       rootMargin: '100px', // Load more jobs when user is 100px from the bottom
//       threshold: 0.1
//     };

//     observerRef.current = new IntersectionObserver(handleIntersection, options);

//     if (sentinelRef.current) {
//       observerRef.current.observe(sentinelRef.current);
//     }

//     return () => {
//       if (observerRef.current) {
//         observerRef.current.disconnect();
//       }
//     };
//   }, [handleIntersection]);

//   // Execute callback when fetching is triggered
//   useEffect(() => {
//     if (!isFetching) return;

//     const fetchMoreData = async () => {
//       try {
//         await callback();
//       } catch (error) {
//         console.error('Error fetching more data:', error);
//       } finally {
//         setIsFetching(false);
//       }
//     };

//     fetchMoreData();
//   }, [isFetching, callback]);

//   return {
//     isFetching,
//     sentinelRef
//   };
// };

// // Alternative scroll-based approach (backup)
// export const useScrollInfinite = (callback, hasMore, isLoading) => {
//   const [isFetching, setIsFetching] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (
//         window.innerHeight + document.documentElement.scrollTop >= 
//         document.documentElement.offsetHeight - 1000 && // 1000px before bottom
//         hasMore && 
//         !isLoading && 
//         !isFetching
//       ) {
//         setIsFetching(true);
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [hasMore, isLoading, isFetching]);

//   useEffect(() => {
//     if (!isFetching) return;

//     const fetchMoreData = async () => {
//       try {
//         await callback();
//       } catch (error) {
//         console.error('Error fetching more data:', error);
//       } finally {
//         setIsFetching(false);
//       }
//     };

//     fetchMoreData();
//   }, [isFetching, callback]);

//   return { isFetching };
// };
// import { useState, useEffect, useCallback, useRef } from 'react';

// export const useInfiniteScroll = (callback, hasMore, isLoading) => {
//   const [isFetching, setIsFetching] = useState(false);
//   const observerRef = useRef(null);
//   const sentinelRef = useRef(null);

//   // Intersection Observer callback
//   const handleIntersection = useCallback((entries) => {
//     const target = entries[0];
//     console.log('👀 isIntersecting:', target.isIntersecting);

//     if (target.isIntersecting && hasMore && !isLoading && !isFetching) {
//       console.log('🔁 Fetch triggered');
//       setIsFetching(true);
//     }
//   }, [hasMore, isLoading, isFetching]);

//   // Initialize IntersectionObserver only once
//   useEffect(() => {
//     if (!observerRef.current) {
//       observerRef.current = new IntersectionObserver(handleIntersection, {
//         root: null,
//         rootMargin: '100px',
//         threshold: 0.1
//       });
//     }
//   }, [handleIntersection]);

//   // Observe when sentinel becomes available
//   useEffect(() => {
//     const el = sentinelRef.current;
//     if (!el || !observerRef.current) return;

//     observerRef.current.observe(el);
//     return () => {
//       if (observerRef.current && el) {
//         observerRef.current.unobserve(el);
//       }
//     };
//   }, [sentinelRef.current]);

//   // Call the callback
//   useEffect(() => {
//     if (!isFetching) return;

//     const fetchMoreData = async () => {
//       try {
//         await callback();
//       } catch (error) {
//         console.error('🚨 Error fetching more data:', error);
//       } finally {
//         setIsFetching(false);
//       }
//     };

//     fetchMoreData();
//   }, [isFetching, callback]);

//   return {
//     isFetching,
//     sentinelRef
//   };
// };
import { useState, useEffect, useCallback, useRef } from 'react';

export const useInfiniteScroll = (callback, hasMore, isLoading) => {
  const [isFetching, setIsFetching] = useState(false);
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);
  const callbackRef = useRef(callback);
  const lastCallRef = useRef(0);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Intersection Observer callback
  const handleIntersection = useCallback((entries) => {
    const target = entries[0];
    const now = Date.now();
    
    console.log('👀 Intersection Observer:', {
      isIntersecting: target.isIntersecting,
      hasMore,
      isLoading,
      isFetching,
      intersectionRatio: target.intersectionRatio,
      timeSinceLastCall: now - lastCallRef.current
    });

    // Prevent rapid calls (minimum 1 second between calls)
    if (now - lastCallRef.current < 1000) {
      console.log('⏭️ Skipping - too soon since last call');
      return;
    }

    // Only trigger if:
    // 1. Element is intersecting with good ratio
    // 2. We have more data to load
    // 3. We're not currently loading
    // 4. We're not already fetching
    if (target.isIntersecting && 
        target.intersectionRatio > 0.1 && 
        hasMore && 
        !isLoading && 
        !isFetching) {
      console.log('🔁 Triggering infinite scroll callback');
      lastCallRef.current = now;
      setIsFetching(true);
    }
  }, [hasMore, isLoading, isFetching]);

  // Initialize IntersectionObserver
  useEffect(() => {
    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer with more conservative settings
    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '100px', // Reduced from 200px to be less aggressive
      threshold: [0, 0.1, 0.5] // Multiple thresholds for better detection
    });

    console.log('🔧 IntersectionObserver created');

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        console.log('🗑️ IntersectionObserver disconnected');
      }
    };
  }, [handleIntersection]);

  // Observe/unobserve sentinel element
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const observer = observerRef.current;

    if (!sentinel || !observer) {
      console.log('⚠️ Missing sentinel or observer:', { 
        hasSentinel: !!sentinel,
        hasObserver: !!observer 
      });
      return;
    }

    console.log('👁️ Starting to observe sentinel');
    observer.observe(sentinel);

    return () => {
      if (observer && sentinel) {
        observer.unobserve(sentinel);
        console.log('👁️‍🗨️ Stopped observing sentinel');
      }
    };
  }, [hasMore]); // Added hasMore as dependency

  // Execute callback when fetching is triggered
  useEffect(() => {
    if (!isFetching) return;

    const fetchMoreData = async () => {
      console.log('📡 Executing callback for more data...');
      try {
        await callbackRef.current();
        console.log('✅ Callback executed successfully');
      } catch (error) {
        console.error('❌ Error in infinite scroll callback:', error);
      } finally {
        // Reset fetching state after a delay to prevent rapid calls
        setTimeout(() => {
          setIsFetching(false);
          console.log('🔄 Reset isFetching to false');
        }, 500); // Increased delay
      }
    };

    fetchMoreData();
  }, [isFetching]);

  // Reset fetching state when loading changes to false
  useEffect(() => {
    if (!isLoading && isFetching) {
      setTimeout(() => {
        setIsFetching(false);
        console.log('🔄 Reset isFetching due to loading state change');
      }, 100);
    }
  }, [isLoading, isFetching]);

  return {
    isFetching,
    sentinelRef
  };
};