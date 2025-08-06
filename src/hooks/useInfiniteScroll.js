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
import { useState, useEffect, useCallback, useRef } from 'react';

export const useInfiniteScroll = (callback, hasMore, isLoading) => {
  const [isFetching, setIsFetching] = useState(false);
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  // Intersection Observer callback
  const handleIntersection = useCallback((entries) => {
    const target = entries[0];
    console.log('👀 isIntersecting:', target.isIntersecting);

    if (target.isIntersecting && hasMore && !isLoading && !isFetching) {
      console.log('🔁 Fetch triggered');
      setIsFetching(true);
    }
  }, [hasMore, isLoading, isFetching]);

  // Initialize IntersectionObserver only once
  useEffect(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
      });
    }
  }, [handleIntersection]);

  // Observe when sentinel becomes available
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !observerRef.current) return;

    observerRef.current.observe(el);
    return () => {
      if (observerRef.current && el) {
        observerRef.current.unobserve(el);
      }
    };
  }, [sentinelRef.current]);

  // Call the callback
  useEffect(() => {
    if (!isFetching) return;

    const fetchMoreData = async () => {
      try {
        await callback();
      } catch (error) {
        console.error('🚨 Error fetching more data:', error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchMoreData();
  }, [isFetching, callback]);

  return {
    isFetching,
    sentinelRef
  };
};
