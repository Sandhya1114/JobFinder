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