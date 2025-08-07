// src/hooks/useInfiniteScroll.js
import { useState, useEffect, useCallback } from 'react';

export const useInfiniteScroll = (loadMore, hasNextPage, loadingMore) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    fetchMoreData();
  }, [isFetching]);

  const handleScroll = () => {
    // Don't trigger if already loading, no more pages, or not near bottom
    if (loadingMore || !hasNextPage || isFetching) return;

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;
    
    // Trigger when user scrolls to within 100px of bottom
    const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight - 100;
    
    if (scrolledToBottom) {
      console.log('Triggering infinite scroll load more'); // Debug log
      setIsFetching(true);
    }
  };

  const fetchMoreData = useCallback(async () => {
    try {
      await loadMore();
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      setIsFetching(false);
    }
  }, [loadMore]);

  return [isFetching, setIsFetching];
};