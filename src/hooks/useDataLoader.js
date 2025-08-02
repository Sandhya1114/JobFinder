// src/hooks/useDataLoader.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { api } from '../services/api';
import { 
  setJobs, 
  setCategories, 
  setCompanies, 
  setLoading, 
  setError 
} from '../redux/store';

export const useDataLoader = () => {
  const dispatch = useDispatch();

  const loadJobs = async () => {
    try {
      dispatch(setLoading(true));
      const response = await api.fetchJobs();
      dispatch(setJobs(response.jobs || []));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.fetchCategories();
      dispatch(setCategories(response.categories || []));
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadCompanies = async () => {
    try {
      const response = await api.fetchCompanies();
      dispatch(setCompanies(response.companies || []));
    } catch (error) {
      console.error('Failed to load companies:', error);
    }
  };

  const loadAllData = async () => {
    await Promise.all([
      loadJobs(),
      loadCategories(),
      loadCompanies()
    ]);
  };

  return {
    loadJobs,
    loadCategories,
    loadCompanies,
    loadAllData
  };
};