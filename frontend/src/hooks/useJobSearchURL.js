// src/hooks/useJobSearchURL.js
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';

/**
 * Custom hook for managing job search URL parameters
 * Provides utilities to sync URL with search state
 */
export const useJobSearchURL = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Parse current URL parameters into a structured object
  const parseCurrentParams = useCallback(() => {
    return {
      search: searchParams.get('search') || '',
      categories: searchParams.get('categories')?.split(',').filter(Boolean) || [],
      companies: searchParams.get('companies')?.split(',').filter(Boolean) || [],
      experience: searchParams.get('experience')?.split(',').filter(Boolean) || [],
      location: searchParams.get('location')?.split(',').filter(Boolean) || [],
      type: searchParams.get('type')?.split(',').filter(Boolean) || [],
      salary: searchParams.get('salary')?.split(',').filter(Boolean) || [],
      page: parseInt(searchParams.get('page')) || 1,
      limit: parseInt(searchParams.get('limit')) || 20
    };
  }, [searchParams]);

  // Update URL with new search parameters
  const updateSearchParams = useCallback((params) => {
    const urlParams = new URLSearchParams();

    // Add non-empty parameters to URL
    if (params.search?.trim()) {
      urlParams.set('search', params.search.trim());
    }
    if (params.categories?.length > 0) {
      urlParams.set('categories', params.categories.join(','));
    }
    if (params.companies?.length > 0) {
      urlParams.set('companies', params.companies.join(','));
    }
    if (params.experience?.length > 0) {
      urlParams.set('experience', params.experience.join(','));
    }
    if (params.location?.length > 0) {
      urlParams.set('location', params.location.join(','));
    }
    if (params.type?.length > 0) {
      urlParams.set('type', params.type.join(','));
    }
    if (params.salary?.length > 0) {
      urlParams.set('salary', params.salary.join(','));
    }
    if (params.page && params.page > 1) {
      urlParams.set('page', params.page.toString());
    }
    if (params.limit && params.limit !== 20) {
      urlParams.set('limit', params.limit.toString());
    }

    // Update URL without triggering navigation
    const newURL = urlParams.toString() 
      ? `${location.pathname}?${urlParams.toString()}` 
      : location.pathname;
      
    navigate(newURL, { replace: true });
  }, [location.pathname, navigate]);

  // Clear all search parameters
  const clearSearchParams = useCallback(() => {
    navigate(location.pathname, { replace: true });
  }, [location.pathname, navigate]);

  // Build shareable URL with current filters
  const getShareableURL = useCallback((baseURL = window.location.origin) => {
    const currentParams = parseCurrentParams();
    const urlParams = new URLSearchParams();

    Object.entries(currentParams).forEach(([key, value]) => {
      if (value && (Array.isArray(value) ? value.length > 0 : value.toString().trim())) {
        if (Array.isArray(value)) {
          urlParams.set(key, value.join(','));
        } else if (key === 'page' && value > 1) {
          urlParams.set(key, value.toString());
        } else if (key === 'limit' && value !== 20) {
          urlParams.set(key, value.toString());
        } else if (key !== 'page' && key !== 'limit') {
          urlParams.set(key, value.toString());
        }
      }
    });

    const queryString = urlParams.toString();
    return queryString 
      ? `${baseURL}${location.pathname}?${queryString}`
      : `${baseURL}${location.pathname}`;
  }, [parseCurrentParams, location.pathname]);

  // Check if URL has any search parameters
  const hasSearchParams = useCallback(() => {
    const params = parseCurrentParams();
    return params.search || 
           params.categories.length > 0 || 
           params.companies.length > 0 || 
           params.experience.length > 0 || 
           params.location.length > 0 || 
           params.type.length > 0 || 
           params.salary.length > 0 ||
           params.page > 1 ||
           params.limit !== 20;
  }, [parseCurrentParams]);

  return {
    searchParams: parseCurrentParams(),
    updateSearchParams,
    clearSearchParams,
    getShareableURL,
    hasSearchParams: hasSearchParams(),
    rawSearchParams: searchParams
  };
};