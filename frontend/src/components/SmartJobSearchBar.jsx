// // 
// import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { setSearchQuery, setSelectedExperience, setSelectedLocation, setSelectedCompany, setSelectedCategory } from '../redux/store';
// import { api } from '../services/api';

// const SmartSearchBar = ({ onSearch }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const { jobs, categories, companies } = useSelector((state) => state.jobs);
  
//   const [query, setQuery] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedIndex, setSelectedIndex] = useState(-1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchHistory, setSearchHistory] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem('searchHistory') || '[]');
//     } catch {
//       return [];
//     }
//   });
  
//   const searchInputRef = useRef(null);
//   const suggestionRefs = useRef([]);
//   const debounceRef = useRef(null);
//   const containerRef = useRef(null);

//   // Experience levels from your JobList component
//   const experienceOptions = ['Fresher', 'Mid-level', 'Senior', '1 yr', '2 yrs', '3 yrs', '4 yrs', '5 yrs'];

//   // Extract unique data from jobs
//   const jobData = useMemo(() => {
//     const locations = new Set();
//     const jobTitles = new Set();
//     const skills = new Set();
//     const companyNames = new Set();
//     const categoryNames = new Set();

//     // Extract from jobs array
//     jobs.forEach(job => {
//       // Locations
//       if (job.location) {
//         const locationParts = job.location.split(',').map(l => l.trim());
//         locationParts.forEach(part => {
//           if (part && part.length > 2) {
//             locations.add(part);
//           }
//         });
//       }

//       // Job titles
//       if (job.title) {
//         jobTitles.add(job.title);
        
//         // Extract common job keywords
//         const titleWords = job.title.toLowerCase().split(/[\s\-_]+/);
//         titleWords.forEach(word => {
//           if (word.length > 3 && !['the', 'and', 'for', 'with'].includes(word)) {
//             skills.add(word.charAt(0).toUpperCase() + word.slice(1));
//           }
//         });
//       }

//       // Extract skills from description
//       if (job.description) {
//         const commonSkills = [
//           'React', 'JavaScript', 'Python', 'Node.js', 'TypeScript', 'AWS', 'Docker',
//           'Kubernetes', 'MongoDB', 'PostgreSQL', 'Java', 'C++', 'Angular', 'Vue',
//           'React Native', 'Flutter', 'Swift', 'Kotlin', 'Go', 'Rust', 'PHP',
//           'Ruby', 'Django', 'Flask', 'Express', 'Spring', 'Laravel', 'Git',
//           'Jenkins', 'Terraform', 'GraphQL', 'REST API', 'MySQL', 'Redis',
//           'Elasticsearch', 'Kafka', 'RabbitMQ', 'Microservices', 'Machine Learning',
//           'AI', 'Data Science', 'Analytics', 'Tableau', 'Power BI', 'Figma',
//           'Sketch', 'Adobe', 'Photoshop', 'Illustrator'
//         ];
        
//         const descLower = job.description.toLowerCase();
//         commonSkills.forEach(skill => {
//           if (descLower.includes(skill.toLowerCase())) {
//             skills.add(skill);
//           }
//         });
//       }
//     });

//     // Add companies and categories from Redux state
//     companies.forEach(company => {
//       if (company.name) {
//         companyNames.add(company.name);
//       }
//     });

//     categories.forEach(category => {
//       if (category.name) {
//         categoryNames.add(category.name);
//       }
//     });

//     return {
//       locations: Array.from(locations).map(loc => ({ 
//         label: loc, 
//         type: 'location', 
//         category: 'Location',
//         icon: '📍'
//       })),
//       jobTitles: Array.from(jobTitles).map(title => ({ 
//         label: title, 
//         type: 'job', 
//         category: 'Job Title',
//         icon: '💼'
//       })),
//       skills: Array.from(skills).map(skill => ({ 
//         label: skill, 
//         type: 'skill', 
//         category: 'Skill',
//         icon: '🔧'
//       })),
//       companies: Array.from(companyNames).map(company => ({ 
//         label: company, 
//         type: 'company', 
//         category: 'Company',
//         icon: '🏢'
//       })),
//       categories: Array.from(categoryNames).map(category => ({ 
//         label: category, 
//         type: 'category', 
//         category: 'Industry',
//         icon: '🏭'
//       })),
//       experience: experienceOptions.map(exp => ({
//         label: exp,
//         type: 'experience',
//         category: 'Experience',
//         icon: '📈'
//       }))
//     };
//   }, [jobs, companies, categories]);

//   // Fuzzy matching function with typo tolerance
//   const fuzzyMatch = useCallback((text, query) => {
//     if (!query || !text) return 0;
    
//     const textLower = text.toLowerCase();
//     const queryLower = query.toLowerCase();
    
//     // Exact match
//     if (textLower === queryLower) return 1.0;
    
//     // Starts with match
//     if (textLower.startsWith(queryLower)) return 0.9;
    
//     // Contains match
//     if (textLower.includes(queryLower)) return 0.8;
    
//     // Word boundary match
//     const words = textLower.split(/\s+/);
//     const queryWords = queryLower.split(/\s+/);
    
//     let wordMatchScore = 0;
//     queryWords.forEach(qWord => {
//       words.forEach(tWord => {
//         if (tWord.startsWith(qWord) && qWord.length >= 2) {
//           wordMatchScore += 0.7;
//         }
//       });
//     });
    
//     if (wordMatchScore > 0) return Math.min(wordMatchScore / queryWords.length, 0.85);
    
//     // Character similarity (Levenshtein-like)
//     let matches = 0;
//     let queryIndex = 0;
    
//     for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
//       if (textLower[i] === queryLower[queryIndex]) {
//         matches++;
//         queryIndex++;
//       }
//     }
    
//     const similarity = queryIndex === queryLower.length ? matches / Math.max(textLower.length, queryLower.length) : 0;
//     return similarity > 0.4 ? similarity * 0.6 : 0;
//   }, []);

//   // Generate suggestions
//   const generateSuggestions = useCallback(async (searchQuery) => {
//     if (!searchQuery || searchQuery.length < 1) {
//       // Show recent searches and popular suggestions
//       const recentSuggestions = searchHistory.slice(-3).map(item => ({
//         ...item,
//         isRecent: true,
//         score: 1.0
//       }));
      
//       const popularSuggestions = [
//         ...jobData.jobTitles.slice(0, 3).map(item => ({ ...item, isPopular: true, score: 0.9 })),
//         ...jobData.companies.slice(0, 3).map(item => ({ ...item, isPopular: true, score: 0.9 })),
//         ...jobData.locations.slice(0, 2).map(item => ({ ...item, isPopular: true, score: 0.9 }))
//       ];
      
//       return [...recentSuggestions, ...popularSuggestions].slice(0, 8);
//     }

//     const allSuggestions = [];
//     const query = searchQuery.trim();
    
//     // Search in all categories
//     Object.values(jobData).flat().forEach(item => {
//       const score = fuzzyMatch(item.label, query);
//       if (score > 0.3) {
//         allSuggestions.push({
//           ...item,
//           score
//         });
//       }
//     });
    
//     // If we have few results, try to search through job descriptions
//     if (allSuggestions.length < 5 && query.length >= 3) {
//       jobs.slice(0, 50).forEach(job => {
//         if (job.description) {
//           const descScore = fuzzyMatch(job.description, query);
//           if (descScore > 0.4) {
//             allSuggestions.push({
//               label: job.title,
//               type: 'job',
//               category: 'Related Job',
//               icon: '🔍',
//               score: descScore * 0.7,
//               description: job.description.substring(0, 100) + '...'
//             });
//           }
//         }
//       });
//     }
    
//     // Sort by score and limit results
//     return allSuggestions
//       .sort((a, b) => b.score - a.score)
//       .slice(0, 10)
//       .filter(item => item.score > 0.3);
//   }, [jobData, fuzzyMatch, searchHistory, jobs]);

//   // Debounced suggestion fetching
//   const debouncedFetchSuggestions = useCallback((query) => {
//     if (debounceRef.current) {
//       clearTimeout(debounceRef.current);
//     }
    
//     debounceRef.current = setTimeout(async () => {
//       setIsLoading(true);
//       try {
//         const newSuggestions = await generateSuggestions(query);
//         setSuggestions(newSuggestions);
//       } catch (error) {
//         console.error('Error generating suggestions:', error);
//         setSuggestions([]);
//       } finally {
//         setIsLoading(false);
//       }
//     }, 200);
//   }, [generateSuggestions]);

//   // Handle input change
//   const handleInputChange = useCallback((e) => {
//     const value = e.target.value;
//     setQuery(value);
//     setSelectedIndex(-1);
    
//     if (value.length >= 0) {
//       debouncedFetchSuggestions(value);
//       setIsOpen(true);
//     } else {
//       setIsOpen(false);
//       setSuggestions([]);
//     }
//   }, [debouncedFetchSuggestions]);

//   // Handle suggestion selection
//   const handleSuggestionSelect = useCallback((suggestion) => {
//     const searchItem = {
//       label: suggestion.label,
//       type: suggestion.type,
//       category: suggestion.category,
//       icon: suggestion.icon,
//       timestamp: Date.now()
//     };

//     // Add to search history
//     const newHistory = [
//       searchItem,
//       ...searchHistory.filter(item => item.label !== suggestion.label)
//     ].slice(0, 10);
    
//     setSearchHistory(newHistory);
//     localStorage.setItem('searchHistory', JSON.stringify(newHistory));

//     // Navigate to jobs page if not already there
//     if (location.pathname !== '/jobs') {
//       navigate('/jobs');
//     }

//     // Apply the appropriate filter based on suggestion type
//     switch (suggestion.type) {
//       case 'location':
//         dispatch(setSelectedLocation([suggestion.label]));
//         break;
//       case 'company':
//         const company = companies.find(c => c.name === suggestion.label);
//         if (company) {
//           dispatch(setSelectedCompany([company.id]));
//         }
//         break;
//       case 'category':
//         const category = categories.find(c => c.name === suggestion.label);
//         if (category) {
//           dispatch(setSelectedCategory([category.id]));
//         }
//         break;
//       case 'experience':
//         dispatch(setSelectedExperience([suggestion.label]));
//         break;
//       case 'job':
//       case 'skill':
//       default:
//         dispatch(setSearchQuery(suggestion.label));
//         break;
//     }

//     setQuery(suggestion.label);
//     setIsOpen(false);
    
//     if (onSearch) {
//       onSearch({ query: suggestion.label, type: suggestion.type });
//     }
//   }, [searchHistory, location.pathname, navigate, dispatch, companies, categories, onSearch]);

//   // Keyboard navigation
//   const handleKeyDown = useCallback((e) => {
//     if (!isOpen || suggestions.length === 0) {
//       if (e.key === 'Enter' && query.trim()) {
//         // Direct search
//         dispatch(setSearchQuery(query.trim()));
//         if (location.pathname !== '/jobs') {
//           navigate('/jobs');
//         }
//         setIsOpen(false);
//         if (onSearch) {
//           onSearch({ query: query.trim(), type: 'search' });
//         }
//       }
//       return;
//     }

//     switch (e.key) {
//       case 'ArrowDown':
//         e.preventDefault();
//         setSelectedIndex(prev => 
//           prev < suggestions.length - 1 ? prev + 1 : 0
//         );
//         break;
//       case 'ArrowUp':
//         e.preventDefault();
//         setSelectedIndex(prev => 
//           prev > 0 ? prev - 1 : suggestions.length - 1
//         );
//         break;
//       case 'Enter':
//         e.preventDefault();
//         if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
//           handleSuggestionSelect(suggestions[selectedIndex]);
//         } else if (query.trim()) {
//           dispatch(setSearchQuery(query.trim()));
//           if (location.pathname !== '/jobs') {
//             navigate('/jobs');
//           }
//           setIsOpen(false);
//         }
//         break;
//       case 'Escape':
//         setIsOpen(false);
//         setSelectedIndex(-1);
//         searchInputRef.current?.blur();
//         break;
//     }
//   }, [isOpen, suggestions, selectedIndex, query, handleSuggestionSelect, dispatch, location.pathname, navigate, onSearch]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (containerRef.current && !containerRef.current.contains(event.target)) {
//         setIsOpen(false);
//         setSelectedIndex(-1);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Scroll selected suggestion into view
//   useEffect(() => {
//     if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
//       suggestionRefs.current[selectedIndex].scrollIntoView({
//         block: 'nearest',
//         behavior: 'smooth'
//       });
//     }
//   }, [selectedIndex]);

//   // Initialize suggestions when component mounts
//   useEffect(() => {
//     if (searchInputRef.current === document.activeElement) {
//       debouncedFetchSuggestions('');
//     }
//   }, [debouncedFetchSuggestions]);

//   const formatSuggestionText = (suggestion) => {
//     if (suggestion.isRecent) {
//       return (
//         <div className="suggestion-content recent">
//           <span className="suggestion-icon">🕒</span>
//           <div className="suggestion-text">
//             <div className="suggestion-label">{suggestion.label}</div>
//             <div className="suggestion-meta">Recent search</div>
//           </div>
//         </div>
//       );
//     }

//     if (suggestion.isPopular) {
//       return (
//         <div className="suggestion-content popular">
//           <span className="suggestion-icon">{suggestion.icon}</span>
//           <div className="suggestion-text">
//             <div className="suggestion-label">{suggestion.label}</div>
//             <div className="suggestion-meta">Popular {suggestion.category.toLowerCase()}</div>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className="suggestion-content">
//         <span className="suggestion-icon">{suggestion.icon}</span>
//         <div className="suggestion-text">
//           <div className="suggestion-label">{suggestion.label}</div>
//           <div className="suggestion-meta">{suggestion.category}</div>
//           {suggestion.description && (
//             <div className="suggestion-description">{suggestion.description}</div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div ref={containerRef} className="smart-search-container">
//       <div className="search-input-wrapper">
//         <input
//           ref={searchInputRef}
//           type="text"
//           value={query}
//           onChange={handleInputChange}
//           onKeyDown={handleKeyDown}
//           onFocus={() => {
//             debouncedFetchSuggestions(query);
//             setIsOpen(true);
//           }}
//           placeholder="Search jobs, companies, skills, locations..."
//           className="search-input"
//         />
//         <div className="search-icon">
//           {isLoading ? (
//             <div className="search-spinner"></div>
//           ) : (
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <circle cx="11" cy="11" r="8"/>
//               <path d="m21 21-4.35-4.35"/>
//             </svg>
//           )}
//         </div>
//       </div>

//       {isOpen && (
//         <div className="suggestions-dropdown">
//           {suggestions.length === 0 && !isLoading && query.length > 0 && (
//             <div className="no-suggestions">
//               <span className="no-suggestions-icon">🔍</span>
//               <div className="no-suggestions-text">
//                 <div>No suggestions found</div>
//                 <div className="no-suggestions-tip">Try searching for job titles, skills, or companies</div>
//               </div>
//             </div>
//           )}
          
//           {suggestions.map((suggestion, index) => (
//             <div
//               key={`${suggestion.type}-${suggestion.label}-${index}`}
//               ref={el => suggestionRefs.current[index] = el}
//               className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
//               onClick={() => handleSuggestionSelect(suggestion)}
//               onMouseEnter={() => setSelectedIndex(index)}
//             >
//               {formatSuggestionText(suggestion)}
//             </div>
//           ))}
//         </div>
//       )}

//       <style jsx>{`
//         .smart-search-container {
//           position: relative;
//           width: 100%;
//           max-width: 500px;
//         }

//         .search-input-wrapper {
//           position: relative;
//           width: 100%;
//         }

//         .search-input {
//           width: 100%;
//           padding: 12px 16px 12px 45px;
//           border: 2px solid #e1e5e9;
//           border-radius: 25px;
//           font-size: 16px;
//           background: white;
//           outline: none;
//           transition: all 0.2s ease;
//         }

//         .search-input:focus {
//           border-color: #4f46e5;
//           box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
//         }

//         .search-icon {
//           position: absolute;
//           left: 15px;
//           top: 50%;
//           transform: translateY(-50%);
//           color: #6b7280;
//         }

//         .search-spinner {
//           width: 20px;
//           height: 20px;
//           border: 2px solid #f3f4f6;
//           border-top: 2px solid #4f46e5;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//         }

//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }

//         .suggestions-dropdown {
//           position: absolute;
//           top: 100%;
//           left: 0;
//           right: 0;
//           background: white;
//           border: 1px solid #e1e5e9;
//           border-radius: 12px;
//           box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
//           max-height: 400px;
//           overflow-y: auto;
//           z-index: 1000;
//           margin-top: 4px;
//         }

//         .suggestion-item {
//           padding: 12px 16px;
//           cursor: pointer;
//           border-bottom: 1px solid #f3f4f6;
//           transition: background-color 0.15s ease;
//         }

//         .suggestion-item:last-child {
//           border-bottom: none;
//         }

//         .suggestion-item:hover,
//         .suggestion-item.selected {
//           background-color: #f8fafc;
//         }

//         .suggestion-content {
//           display: flex;
//           align-items: flex-start;
//           gap: 12px;
//         }

//         .suggestion-content.recent {
//           opacity: 0.8;
//         }

//         .suggestion-content.popular .suggestion-label {
//           color: #059669;
//           font-weight: 500;
//         }

//         .suggestion-icon {
//           font-size: 18px;
//           line-height: 1;
//           margin-top: 2px;
//           min-width: 18px;
//         }

//         .suggestion-text {
//           flex: 1;
//           min-width: 0;
//         }

//         .suggestion-label {
//           font-weight: 500;
//           color: #1f2937;
//           margin-bottom: 2px;
//           line-height: 1.3;
//         }

//         .suggestion-meta {
//           font-size: 12px;
//           color: #6b7280;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .suggestion-description {
//           font-size: 13px;
//           color: #6b7280;
//           margin-top: 4px;
//           line-height: 1.4;
//         }

//         .no-suggestions {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           padding: 20px 16px;
//           color: #6b7280;
//         }

//         .no-suggestions-icon {
//           font-size: 24px;
//           opacity: 0.5;
//         }

//         .no-suggestions-text div:first-child {
//           font-weight: 500;
//           color: #374151;
//           margin-bottom: 2px;
//         }

//         .no-suggestions-tip {
//           font-size: 13px;
//         }

//         /* Mobile responsive */
//         @media (max-width: 768px) {
//           .search-input {
//             font-size: 16px; /* Prevent zoom on iOS */
//             padding: 10px 14px 10px 40px;
//           }
          
//           .suggestions-dropdown {
//             max-height: 300px;
//           }
          
//           .suggestion-item {
//             padding: 10px 14px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SmartSearchBar;
// // 
// import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { setSearchQuery, setSelectedExperience, setSelectedLocation, setSelectedCompany, setSelectedCategory } from '../redux/store';
// import { api } from '../services/api';

// const SmartSearchBar = ({ onSearch }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const { jobs, categories, companies } = useSelector((state) => state.jobs);
  
//   const [query, setQuery] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedIndex, setSelectedIndex] = useState(-1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchHistory, setSearchHistory] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem('searchHistory') || '[]');
//     } catch {
//       return [];
//     }
//   });
  
//   const searchInputRef = useRef(null);
//   const suggestionRefs = useRef([]);
//   const debounceRef = useRef(null);
//   const containerRef = useRef(null);

//   // Experience levels from your JobList component
//   const experienceOptions = ['Fresher', 'Mid-level', 'Senior', '1 yr', '2 yrs', '3 yrs', '4 yrs', '5 yrs'];

//   // Extract unique data from jobs
//   const jobData = useMemo(() => {
//     const locations = new Set();
//     const jobTitles = new Set();
//     const skills = new Set();
//     const companyNames = new Set();
//     const categoryNames = new Set();

//     // Extract from jobs array
//     jobs.forEach(job => {
//       // Locations
//       if (job.location) {
//         const locationParts = job.location.split(',').map(l => l.trim());
//         locationParts.forEach(part => {
//           if (part && part.length > 2) {
//             locations.add(part);
//           }
//         });
//       }

//       // Job titles
//       if (job.title) {
//         jobTitles.add(job.title);
        
//         // Extract common job keywords
//         const titleWords = job.title.toLowerCase().split(/[\s\-_]+/);
//         titleWords.forEach(word => {
//           if (word.length > 3 && !['the', 'and', 'for', 'with'].includes(word)) {
//             skills.add(word.charAt(0).toUpperCase() + word.slice(1));
//           }
//         });
//       }

//       // Extract skills from description
//       if (job.description) {
//         const commonSkills = [
//           'React', 'JavaScript', 'Python', 'Node.js', 'TypeScript', 'AWS', 'Docker',
//           'Kubernetes', 'MongoDB', 'PostgreSQL', 'Java', 'C++', 'Angular', 'Vue',
//           'React Native', 'Flutter', 'Swift', 'Kotlin', 'Go', 'Rust', 'PHP',
//           'Ruby', 'Django', 'Flask', 'Express', 'Spring', 'Laravel', 'Git',
//           'Jenkins', 'Terraform', 'GraphQL', 'REST API', 'MySQL', 'Redis',
//           'Elasticsearch', 'Kafka', 'RabbitMQ', 'Microservices', 'Machine Learning',
//           'AI', 'Data Science', 'Analytics', 'Tableau', 'Power BI', 'Figma',
//           'Sketch', 'Adobe', 'Photoshop', 'Illustrator'
//         ];
        
//         const descLower = job.description.toLowerCase();
//         commonSkills.forEach(skill => {
//           if (descLower.includes(skill.toLowerCase())) {
//             skills.add(skill);
//           }
//         });
//       }
//     });

//     // Add companies and categories from Redux state
//     companies.forEach(company => {
//       if (company.name) {
//         companyNames.add(company.name);
//       }
//     });

//     categories.forEach(category => {
//       if (category.name) {
//         categoryNames.add(category.name);
//       }
//     });

//     return {
//       locations: Array.from(locations).map(loc => ({ 
//         label: loc, 
//         type: 'location', 
//         category: 'Location',
//         icon: '📍'
//       })),
//       jobTitles: Array.from(jobTitles).map(title => ({ 
//         label: title, 
//         type: 'job', 
//         category: 'Job Title',
//         icon: '💼'
//       })),
//       skills: Array.from(skills).map(skill => ({ 
//         label: skill, 
//         type: 'skill', 
//         category: 'Skill',
//         icon: '🔧'
//       })),
//       companies: Array.from(companyNames).map(company => ({ 
//         label: company, 
//         type: 'company', 
//         category: 'Company',
//         icon: '🏢'
//       })),
//       categories: Array.from(categoryNames).map(category => ({ 
//         label: category, 
//         type: 'category', 
//         category: 'Industry',
//         icon: '🏭'
//       })),
//       experience: experienceOptions.map(exp => ({
//         label: exp,
//         type: 'experience',
//         category: 'Experience',
//         icon: '📈'
//       }))
//     };
//   }, [jobs, companies, categories]);

//   // Fuzzy matching function with typo tolerance
//   const fuzzyMatch = useCallback((text, query) => {
//     if (!query || !text) return 0;
    
//     const textLower = text.toLowerCase();
//     const queryLower = query.toLowerCase();
    
//     // Exact match
//     if (textLower === queryLower) return 1.0;
    
//     // Starts with match
//     if (textLower.startsWith(queryLower)) return 0.9;
    
//     // Contains match
//     if (textLower.includes(queryLower)) return 0.8;
    
//     // Word boundary match
//     const words = textLower.split(/\s+/);
//     const queryWords = queryLower.split(/\s+/);
    
//     let wordMatchScore = 0;
//     queryWords.forEach(qWord => {
//       words.forEach(tWord => {
//         if (tWord.startsWith(qWord) && qWord.length >= 2) {
//           wordMatchScore += 0.7;
//         }
//       });
//     });
    
//     if (wordMatchScore > 0) return Math.min(wordMatchScore / queryWords.length, 0.85);
    
//     // Character similarity (Levenshtein-like)
//     let matches = 0;
//     let queryIndex = 0;
    
//     for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
//       if (textLower[i] === queryLower[queryIndex]) {
//         matches++;
//         queryIndex++;
//       }
//     }
    
//     const similarity = queryIndex === queryLower.length ? matches / Math.max(textLower.length, queryLower.length) : 0;
//     return similarity > 0.4 ? similarity * 0.6 : 0;
//   }, []);

//   // Generate suggestions
//   const generateSuggestions = useCallback(async (searchQuery) => {
//     if (!searchQuery || searchQuery.length < 1) {
//       // Show recent searches and popular suggestions
//       const recentSuggestions = searchHistory.slice(-3).map(item => ({
//         ...item,
//         isRecent: true,
//         score: 1.0
//       }));
      
//       const popularSuggestions = [
//         ...jobData.jobTitles.slice(0, 3).map(item => ({ ...item, isPopular: true, score: 0.9 })),
//         ...jobData.companies.slice(0, 3).map(item => ({ ...item, isPopular: true, score: 0.9 })),
//         ...jobData.locations.slice(0, 2).map(item => ({ ...item, isPopular: true, score: 0.9 }))
//       ];
      
//       return [...recentSuggestions, ...popularSuggestions].slice(0, 8);
//     }

//     const allSuggestions = [];
//     const query = searchQuery.trim();
    
//     // Search in all categories
//     Object.values(jobData).flat().forEach(item => {
//       const score = fuzzyMatch(item.label, query);
//       if (score > 0.3) {
//         allSuggestions.push({
//           ...item,
//           score
//         });
//       }
//     });
    
//     // If we have few results, try to search through job descriptions
//     if (allSuggestions.length < 5 && query.length >= 3) {
//       jobs.slice(0, 50).forEach(job => {
//         if (job.description) {
//           const descScore = fuzzyMatch(job.description, query);
//           if (descScore > 0.4) {
//             allSuggestions.push({
//               label: job.title,
//               type: 'job',
//               category: 'Related Job',
//               icon: '🔍',
//               score: descScore * 0.7,
//               description: job.description.substring(0, 100) + '...'
//             });
//           }
//         }
//       });
//     }
    
//     // Sort by score and limit results
//     return allSuggestions
//       .sort((a, b) => b.score - a.score)
//       .slice(0, 10)
//       .filter(item => item.score > 0.3);
//   }, [jobData, fuzzyMatch, searchHistory, jobs]);

//   // Debounced suggestion fetching
//   const debouncedFetchSuggestions = useCallback((query) => {
//     if (debounceRef.current) {
//       clearTimeout(debounceRef.current);
//     }
    
//     debounceRef.current = setTimeout(async () => {
//       setIsLoading(true);
//       try {
//         const newSuggestions = await generateSuggestions(query);
//         setSuggestions(newSuggestions);
//       } catch (error) {
//         console.error('Error generating suggestions:', error);
//         setSuggestions([]);
//       } finally {
//         setIsLoading(false);
//       }
//     }, 200);
//   }, [generateSuggestions]);

//   // Handle input change
//   const handleInputChange = useCallback((e) => {
//     const value = e.target.value;
//     setQuery(value);
//     setSelectedIndex(-1);
    
//     if (value.length >= 0) {
//       debouncedFetchSuggestions(value);
//       setIsOpen(true);
//     } else {
//       setIsOpen(false);
//       setSuggestions([]);
//     }
//   }, [debouncedFetchSuggestions]);

//   // Handle suggestion selection
//   const handleSuggestionSelect = useCallback((suggestion) => {
//     const searchItem = {
//       label: suggestion.label,
//       type: suggestion.type,
//       category: suggestion.category,
//       icon: suggestion.icon,
//       timestamp: Date.now()
//     };

//     // Add to search history
//     const newHistory = [
//       searchItem,
//       ...searchHistory.filter(item => item.label !== suggestion.label)
//     ].slice(0, 10);
    
//     setSearchHistory(newHistory);
//     localStorage.setItem('searchHistory', JSON.stringify(newHistory));

//     // Navigate to jobs page if not already there
//     if (location.pathname !== '/jobs') {
//       navigate('/jobs');
//     }

//     // Apply the appropriate filter based on suggestion type
//     switch (suggestion.type) {
//       case 'location':
//         dispatch(setSelectedLocation([suggestion.label]));
//         break;
//       case 'company':
//         const company = companies.find(c => c.name === suggestion.label);
//         if (company) {
//           dispatch(setSelectedCompany([company.id]));
//         }
//         break;
//       case 'category':
//         const category = categories.find(c => c.name === suggestion.label);
//         if (category) {
//           dispatch(setSelectedCategory([category.id]));
//         }
//         break;
//       case 'experience':
//         dispatch(setSelectedExperience([suggestion.label]));
//         break;
//       case 'job':
//       case 'skill':
//       default:
//         dispatch(setSearchQuery(suggestion.label));
//         break;
//     }

//     setQuery(suggestion.label);
//     setIsOpen(false);
    
//     if (onSearch) {
//       onSearch({ query: suggestion.label, type: suggestion.type });
//     }
//   }, [searchHistory, location.pathname, navigate, dispatch, companies, categories, onSearch]);

//   // Keyboard navigation
//   const handleKeyDown = useCallback((e) => {
//     if (!isOpen || suggestions.length === 0) {
//       if (e.key === 'Enter' && query.trim()) {
//         // Direct search
//         dispatch(setSearchQuery(query.trim()));
//         if (location.pathname !== '/jobs') {
//           navigate('/jobs');
//         }
//         setIsOpen(false);
//         if (onSearch) {
//           onSearch({ query: query.trim(), type: 'search' });
//         }
//       }
//       return;
//     }

//     switch (e.key) {
//       case 'ArrowDown':
//         e.preventDefault();
//         setSelectedIndex(prev => 
//           prev < suggestions.length - 1 ? prev + 1 : 0
//         );
//         break;
//       case 'ArrowUp':
//         e.preventDefault();
//         setSelectedIndex(prev => 
//           prev > 0 ? prev - 1 : suggestions.length - 1
//         );
//         break;
//       case 'Enter':
//         e.preventDefault();
//         if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
//           handleSuggestionSelect(suggestions[selectedIndex]);
//         } else if (query.trim()) {
//           dispatch(setSearchQuery(query.trim()));
//           if (location.pathname !== '/jobs') {
//             navigate('/jobs');
//           }
//           setIsOpen(false);
//         }
//         break;
//       case 'Escape':
//         setIsOpen(false);
//         setSelectedIndex(-1);
//         searchInputRef.current?.blur();
//         break;
//     }
//   }, [isOpen, suggestions, selectedIndex, query, handleSuggestionSelect, dispatch, location.pathname, navigate, onSearch]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (containerRef.current && !containerRef.current.contains(event.target)) {
//         setIsOpen(false);
//         setSelectedIndex(-1);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Scroll selected suggestion into view
//   useEffect(() => {
//     if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
//       suggestionRefs.current[selectedIndex].scrollIntoView({
//         block: 'nearest',
//         behavior: 'smooth'
//       });
//     }
//   }, [selectedIndex]);

//   // Initialize suggestions when component mounts
//   useEffect(() => {
//     if (searchInputRef.current === document.activeElement) {
//       debouncedFetchSuggestions('');
//     }
//   }, [debouncedFetchSuggestions]);

//   const formatSuggestionText = (suggestion) => {
//     if (suggestion.isRecent) {
//       return (
//         <div className="suggestion-content recent">
//           <span className="suggestion-icon">🕒</span>
//           <div className="suggestion-text">
//             <div className="suggestion-label">{suggestion.label}</div>
//             <div className="suggestion-meta">Recent search</div>
//           </div>
//         </div>
//       );
//     }

//     if (suggestion.isPopular) {
//       return (
//         <div className="suggestion-content popular">
//           <span className="suggestion-icon">{suggestion.icon}</span>
//           <div className="suggestion-text">
//             <div className="suggestion-label">{suggestion.label}</div>
//             <div className="suggestion-meta">Popular {suggestion.category.toLowerCase()}</div>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className="suggestion-content">
//         <span className="suggestion-icon">{suggestion.icon}</span>
//         <div className="suggestion-text">
//           <div className="suggestion-label">{suggestion.label}</div>
//           <div className="suggestion-meta">{suggestion.category}</div>
//           {suggestion.description && (
//             <div className="suggestion-description">{suggestion.description}</div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div ref={containerRef} className="smart-search-container">
//       <div className="search-input-wrapper">
//         <input
//           ref={searchInputRef}
//           type="text"
//           value={query}
//           onChange={handleInputChange}
//           onKeyDown={handleKeyDown}
//           onFocus={() => {
//             debouncedFetchSuggestions(query);
//             setIsOpen(true);
//           }}
//           placeholder="Search jobs, companies, skills, locations..."
//           className="search-input"
//         />
//         <div className="search-icon">
//           {isLoading ? (
//             <div className="search-spinner"></div>
//           ) : (
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <circle cx="11" cy="11" r="8"/>
//               <path d="m21 21-4.35-4.35"/>
//             </svg>
//           )}
//         </div>
//       </div>

//       {isOpen && (
//         <div className="suggestions-dropdown">
//           {suggestions.length === 0 && !isLoading && query.length > 0 && (
//             <div className="no-suggestions">
//               <span className="no-suggestions-icon">🔍</span>
//               <div className="no-suggestions-text">
//                 <div>No suggestions found</div>
//                 <div className="no-suggestions-tip">Try searching for job titles, skills, or companies</div>
//               </div>
//             </div>
//           )}
          
//           {suggestions.map((suggestion, index) => (
//             <div
//               key={`${suggestion.type}-${suggestion.label}-${index}`}
//               ref={el => suggestionRefs.current[index] = el}
//               className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
//               onClick={() => handleSuggestionSelect(suggestion)}
//               onMouseEnter={() => setSelectedIndex(index)}
//             >
//               {formatSuggestionText(suggestion)}
//             </div>
//           ))}
//         </div>
//       )}

//       <style jsx>{`
//         .smart-search-container {
//           position: relative;
//           width: 100%;
//           max-width: 500px;
//         }

//         .search-input-wrapper {
//           position: relative;
//           width: 100%;
//         }

//         .search-input {
//           width: 100%;
//           padding: 12px 16px 12px 45px;
//           border: 2px solid #e1e5e9;
//           border-radius: 25px;
//           font-size: 16px;
//           background: white;
//           outline: none;
//           transition: all 0.2s ease;
//         }

//         .search-input:focus {
//           border-color: #4f46e5;
//           box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
//         }

//         .search-icon {
//           position: absolute;
//           left: 15px;
//           top: 50%;
//           transform: translateY(-50%);
//           color: #6b7280;
//         }

//         .search-spinner {
//           width: 20px;
//           height: 20px;
//           border: 2px solid #f3f4f6;
//           border-top: 2px solid #4f46e5;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//         }

//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }

//         .suggestions-dropdown {
//           position: absolute;
//           top: 100%;
//           left: 0;
//           right: 0;
//           background: white;
//           border: 1px solid #e1e5e9;
//           border-radius: 12px;
//           box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
//           max-height: 400px;
//           overflow-y: auto;
//           z-index: 1000;
//           margin-top: 4px;
//         }

//         .suggestion-item {
//           padding: 12px 16px;
//           cursor: pointer;
//           border-bottom: 1px solid #f3f4f6;
//           transition: background-color 0.15s ease;
//         }

//         .suggestion-item:last-child {
//           border-bottom: none;
//         }

//         .suggestion-item:hover,
//         .suggestion-item.selected {
//           background-color: #f8fafc;
//         }

//         .suggestion-content {
//           display: flex;
//           align-items: flex-start;
//           gap: 12px;
//         }

//         .suggestion-content.recent {
//           opacity: 0.8;
//         }

//         .suggestion-content.popular .suggestion-label {
//           color: #059669;
//           font-weight: 500;
//         }

//         .suggestion-icon {
//           font-size: 18px;
//           line-height: 1;
//           margin-top: 2px;
//           min-width: 18px;
//         }

//         .suggestion-text {
//           flex: 1;
//           min-width: 0;
//         }

//         .suggestion-label {
//           font-weight: 500;
//           color: #1f2937;
//           margin-bottom: 2px;
//           line-height: 1.3;
//         }

//         .suggestion-meta {
//           font-size: 12px;
//           color: #6b7280;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .suggestion-description {
//           font-size: 13px;
//           color: #6b7280;
//           margin-top: 4px;
//           line-height: 1.4;
//         }

//         .no-suggestions {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           padding: 20px 16px;
//           color: #6b7280;
//         }

//         .no-suggestions-icon {
//           font-size: 24px;
//           opacity: 0.5;
//         }

//         .no-suggestions-text div:first-child {
//           font-weight: 500;
//           color: #374151;
//           margin-bottom: 2px;
//         }

//         .no-suggestions-tip {
//           font-size: 13px;
//         }

//         /* Mobile responsive */
//         @media (max-width: 768px) {
//           .search-input {
//             font-size: 16px; /* Prevent zoom on iOS */
//             padding: 10px 14px 10px 40px;
//           }
          
//           .suggestions-dropdown {
//             max-height: 300px;
//           }
          
//           .suggestion-item {
//             padding: 10px 14px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SmartSearchBar;
// import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { setSearchQuery, setSelectedExperience, setSelectedLocation, setSelectedCompany, setSelectedCategory } from '../redux/store';

// const SmartSearchBar = ({ onSearch }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const { jobs, categories, companies } = useSelector((state) => state.jobs);
  
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [searchValues, setSearchValues] = useState({
//     jobSearch: '',
//     experience: '',
//     location: ''
//   });
//   const [suggestions, setSuggestions] = useState({
//     jobSearch: [], // Changed from 'jobs' to 'jobSearch'
//     experience: [],
//     location: []
//   });
//   const [isLoading, setIsLoading] = useState(false);
  
//   const searchRefs = {
//     jobSearch: useRef(null),
//     experience: useRef(null),
//     location: useRef(null),
//     overlay: useRef(null)
//   };
  
//   const debounceRef = useRef(null);

//   // Experience options
//   const experienceOptions = [
//     { label: 'Fresher (less than 1 year)', value: 'Fresher' },
//     { label: '1 year', value: '1 yr' },
//     { label: '2 years', value: '2 yrs' },
//     { label: '3 years', value: '3 yrs' },
//     { label: '4 years', value: '4 yrs' },
//     { label: '5 years', value: '5 yrs' },
//     { label: 'Mid-level', value: 'Mid-level' },
//     { label: 'Senior', value: 'Senior' }
//   ];

//   // Extract search data from jobs
//   const searchData = useMemo(() => {
//     const jobTitles = new Set();
//     const locations = new Set();
//     const companyNames = new Set();
//     const skills = new Set();

//     // Add some default popular job roles and skills
//     const defaultJobRoles = [
//       'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
//       'Software Engineer', 'Web Developer', 'Mobile Developer',
//       'Data Scientist', 'Machine Learning Engineer', 'DevOps Engineer',
//       'Product Manager', 'UI/UX Designer', 'Business Analyst',
//       'Quality Assurance Engineer', 'Database Administrator',
//       'Cloud Architect', 'Cybersecurity Specialist'
//     ];

//     const defaultSkills = [
//       'React', 'JavaScript', 'Python', 'Node.js', 'TypeScript', 'AWS', 'Docker',
//       'Java', 'Angular', 'Vue', 'PHP', 'Ruby', 'Go', 'MongoDB', 'PostgreSQL',
//       'MySQL', 'Git', 'Jenkins', 'Kubernetes', 'Machine Learning', 'AI',
//       'Data Science', 'Frontend', 'Backend', 'Full Stack', 'Mobile', 'iOS', 'Android',
//       'HTML', 'CSS', 'SQL', 'REST API', 'GraphQL', 'Firebase', 'Redis'
//     ];

//     // Add default job roles
//     defaultJobRoles.forEach(role => jobTitles.add(role));
//     defaultSkills.forEach(skill => skills.add(skill));

//     jobs.forEach(job => {
//       // Extract job titles
//       if (job.title) {
//         jobTitles.add(job.title);
//         // Also add variations of the job title
//         const titleWords = job.title.split(' ');
//         titleWords.forEach(word => {
//           if (word.length > 2) {
//             jobTitles.add(word);
//           }
//         });
//       }

//       // Extract locations
//       if (job.location) {
//         const locationParts = job.location.split(',').map(l => l.trim());
//         locationParts.forEach(part => {
//           if (part && part.length > 2) {
//             locations.add(part);
//           }
//         });
        
//         // Add "Remote" if mentioned
//         if (job.location.toLowerCase().includes('remote')) {
//           locations.add('Remote');
//         }
//       }

//       // Extract company names
//       if (job.company) {
//         companyNames.add(job.company);
//       }

//       // Extract skills from description
//       if (job.description) {
//         const descLower = job.description.toLowerCase();
//         defaultSkills.forEach(skill => {
//           if (descLower.includes(skill.toLowerCase())) {
//             skills.add(skill);
//           }
//         });
        
//         // Extract common tech terms from description
//         const techTerms = job.description.match(/\b[A-Z][a-z]*(?:\.[a-z]+|\+\+|#|\s+[A-Z][a-z]*)*\b/g) || [];
//         techTerms.forEach(term => {
//           if (term.length > 2 && term.length < 20) {
//             skills.add(term);
//           }
//         });
//       }
//     });

//     // Add companies from companies array
//     companies.forEach(company => {
//       if (company.name) {
//         companyNames.add(company.name);
//       }
//     });

//     // Add some default popular locations
//     const defaultLocations = [
//       'Remote', 'New York', 'San Francisco', 'Los Angeles', 'Chicago',
//       'Boston', 'Seattle', 'Austin', 'Denver', 'Atlanta',
//       'London', 'Berlin', 'Amsterdam', 'Toronto', 'Mumbai',
//       'Bangalore', 'Delhi', 'Hyderabad', 'Pune', 'Chennai'
//     ];
//     defaultLocations.forEach(loc => locations.add(loc));

//     return {
//       jobTitles: Array.from(jobTitles).sort(),
//       locations: Array.from(locations).sort(),
//       companies: Array.from(companyNames).sort(),
//       skills: Array.from(skills).sort()
//     };
//   }, [jobs, companies]);

//   // Improved fuzzy search function
//   const fuzzySearch = useCallback((items, query, limit = 8) => {
//     if (!query || query.length < 1) return items.slice(0, limit);
    
//     const queryLower = query.toLowerCase().trim();
    
//     return items
//       .map(item => {
//         const itemLower = item.toLowerCase();
//         let score = 0;
        
//         // Exact match
//         if (itemLower === queryLower) score = 100;
//         // Starts with query
//         else if (itemLower.startsWith(queryLower)) score = 90;
//         // Contains query at word boundary
//         else if (new RegExp(`\\b${queryLower}`, 'i').test(item)) score = 80;
//         // Contains query anywhere
//         else if (itemLower.includes(queryLower)) score = 70;
//         // Fuzzy matching - check if all characters of query exist in order
//         else {
//           let queryIndex = 0;
//           for (let i = 0; i < itemLower.length && queryIndex < queryLower.length; i++) {
//             if (itemLower[i] === queryLower[queryIndex]) {
//               queryIndex++;
//             }
//           }
//           if (queryIndex === queryLower.length) score = 50;
//         }
        
//         return score > 0 ? { item, score } : null;
//       })
//       .filter(Boolean)
//       .sort((a, b) => b.score - a.score)
//       .slice(0, limit)
//       .map(({ item }) => item);
//   }, []);

//   // Generate suggestions with improved logic
//   const generateSuggestions = useCallback((type, query) => {
//     switch (type) {
//       case 'jobSearch': {
//         const jobSuggestions = [];
//         const queryLower = query.toLowerCase().trim();
        
//         if (queryLower.length === 0) {
//           // Show popular job roles when no query
//           jobSuggestions.push(
//             ...searchData.jobTitles.slice(0, 5),
//             ...searchData.skills.slice(0, 3)
//           );
//         } else {
//           // Search in job titles first (higher priority)
//           const titleMatches = fuzzySearch(searchData.jobTitles, query, 4);
//           const skillMatches = fuzzySearch(searchData.skills, query, 2);
//           const companyMatches = fuzzySearch(searchData.companies, query, 2);
          
//           jobSuggestions.push(...titleMatches, ...skillMatches, ...companyMatches);
//         }
        
//         // Remove duplicates and limit results
//         return [...new Set(jobSuggestions)].slice(0, 8);
//       }
      
//       case 'location': {
//         if (!query || query.length === 0) {
//           return searchData.locations.slice(0, 8);
//         }
//         return fuzzySearch(searchData.locations, query, 8);
//       }
      
//       case 'experience': {
//         if (!query || query.length === 0) {
//           return experienceOptions;
//         }
//         return experienceOptions.filter(exp => 
//           exp.label.toLowerCase().includes(query.toLowerCase())
//         ).slice(0, 8);
//       }
      
//       default:
//         return [];
//     }
//   }, [searchData, fuzzySearch]);

//   // Debounced suggestion update
//   const updateSuggestions = useCallback((type, query) => {
//     if (debounceRef.current) {
//       clearTimeout(debounceRef.current);
//     }
    
//     debounceRef.current = setTimeout(() => {
//       const newSuggestions = generateSuggestions(type, query);
//       setSuggestions(prev => ({
//         ...prev,
//         [type]: newSuggestions
//       }));
//     }, 150); // Reduced debounce time for better responsiveness
//   }, [generateSuggestions]);

//   // Handle input change
//   const handleInputChange = useCallback((type, value) => {
//     setSearchValues(prev => ({
//       ...prev,
//       [type]: value
//     }));
    
//     // Always update suggestions for all types
//     updateSuggestions(type, value);
//   }, [updateSuggestions]);

//   // Handle dropdown focus
//   const handleDropdownFocus = useCallback((type) => {
//     setActiveDropdown(type);
//     // Generate initial suggestions when focused
//     updateSuggestions(type, searchValues[type]);
//   }, [searchValues, updateSuggestions]);

//   // Handle suggestion click
//   const handleSuggestionClick = useCallback((type, value) => {
//     if (type === 'experience') {
//       const exp = experienceOptions.find(e => e.label === value || e.value === value);
//       setSearchValues(prev => ({
//         ...prev,
//         experience: exp ? exp.label : value
//       }));
//     } else {
//       setSearchValues(prev => ({
//         ...prev,
//         [type]: value
//       }));
//     }
//     setActiveDropdown(null);
//   }, []);

//   // Handle search
//   const handleSearch = useCallback(() => {
//     const { jobSearch, experience, location } = searchValues;
    
//     // Navigate to jobs page if not already there
//     if (location.pathname !== '/jobs') {
//       navigate('/jobs');
//     }

//     // Apply filters
//     if (jobSearch.trim()) {
//       dispatch(setSearchQuery(jobSearch.trim()));
//     }
    
//     if (experience) {
//       const exp = experienceOptions.find(e => e.label === experience);
//       dispatch(setSelectedExperience([exp ? exp.value : experience]));
//     }
    
//     if (location.trim()) {
//       dispatch(setSelectedLocation([location.trim()]));
//     }

//     // Close overlay
//     setIsExpanded(false);
//     setActiveDropdown(null);
    
//     if (onSearch) {
//       onSearch({ jobSearch, experience, location });
//     }
//   }, [searchValues, dispatch, navigate, location.pathname, onSearch]);

//   // Handle escape key
//   useEffect(() => {
//     const handleEscape = (e) => {
//       if (e.key === 'Escape') {
//         setIsExpanded(false);
//         setActiveDropdown(null);
//       }
//     };

//     if (isExpanded) {
//       document.addEventListener('keydown', handleEscape);
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = '';
//     }

//     return () => {
//       document.removeEventListener('keydown', handleEscape);
//       document.body.style.overflow = '';
//     };
//   }, [isExpanded]);

//   // Handle click outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (searchRefs.overlay.current && !searchRefs.overlay.current.contains(event.target)) {
//         setActiveDropdown(null);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Handle enter key in search
//   const handleKeyDown = useCallback((e, type) => {
//     if (e.key === 'Enter') {
//       if (type === 'jobSearch' || (type === 'location' && !activeDropdown)) {
//         handleSearch();
//       }
//     }
//   }, [handleSearch, activeDropdown]);

//   return (
//     <>
//       {/* Compact Search Button */}
//       <div className="search-compact-btn" onClick={() => setIsExpanded(true)}>
//         <i className="fas fa-search"></i>
//       </div>

//       {/* Search Overlay Modal */}
//       {isExpanded && (
//         <div className="search-overlay-modal">
//           <div className="search-overlay-backdrop" onClick={() => setIsExpanded(false)} />
          
//           <div ref={searchRefs.overlay} className="search-overlay-content">
//             <div className="search-modal-header">
//               <h3>Find your dream job</h3>
//               <button 
//                 className="search-close-btn"
//                 onClick={() => setIsExpanded(false)}
//               >
//                 <i className="fas fa-times"></i>
//               </button>
//             </div>

//             <div className="search-form-container">
//               {/* Job Search Input */}
//               <div className="search-field-group">
//                 <div className="search-input-wrapper">
//                   <i className="fas fa-search search-input-icon"></i>
//                   <input
//                     ref={searchRefs.jobSearch}
//                     type="text"
//                     placeholder="Enter skills / designations / companies"
//                     value={searchValues.jobSearch}
//                     onChange={(e) => handleInputChange('jobSearch', e.target.value)}
//                     onFocus={() => handleDropdownFocus('jobSearch')}
//                     onKeyDown={(e) => handleKeyDown(e, 'jobSearch')}
//                     className="search-input"
//                   />
//                 </div>
                
//                 {/* Job Search Suggestions */}
//                 {activeDropdown === 'jobSearch' && suggestions.jobSearch && suggestions.jobSearch.length > 0 && (
//                   <div className="suggestions-dropdown">
//                     {suggestions.jobSearch.map((suggestion, index) => (
//                       <div
//                         key={index}
//                         className="suggestion-item"
//                         onClick={() => handleSuggestionClick('jobSearch', suggestion)}
//                       >
//                         <i className="fas fa-briefcase suggestion-icon"></i>
//                         <span>{suggestion}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div className="search-separator"></div>

//               {/* Experience Dropdown */}
//               <div className="search-field-group">
//                 <div className="search-input-wrapper">
//                   <i className="fas fa-user-tie search-input-icon"></i>
//                   <input
//                     ref={searchRefs.experience}
//                     type="text"
//                     placeholder="Select experience"
//                     value={searchValues.experience}
//                     onChange={(e) => handleInputChange('experience', e.target.value)}
//                     onFocus={() => handleDropdownFocus('experience')}
//                     className="search-input"
//                     readOnly
//                   />
//                   <i className="fas fa-chevron-down dropdown-arrow"></i>
//                 </div>
                
//                 {/* Experience Suggestions */}
//                 {activeDropdown === 'experience' && (
//                   <div className="suggestions-dropdown">
//                     {suggestions.experience.map((exp, index) => (
//                       <div
//                         key={index}
//                         className="suggestion-item"
//                         onClick={() => handleSuggestionClick('experience', exp.label || exp)}
//                       >
//                         <i className="fas fa-chart-line suggestion-icon"></i>
//                         <span>{exp.label || exp}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div className="search-separator"></div>

//               {/* Location Input */}
//               <div className="search-field-group">
//                 <div className="search-input-wrapper">
//                   <i className="fas fa-map-marker-alt search-input-icon"></i>
//                   <input
//                     ref={searchRefs.location}
//                     type="text"
//                     placeholder="Enter location"
//                     value={searchValues.location}
//                     onChange={(e) => handleInputChange('location', e.target.value)}
//                     onFocus={() => handleDropdownFocus('location')}
//                     onKeyDown={(e) => handleKeyDown(e, 'location')}
//                     className="search-input"
//                   />
//                 </div>
                
//                 {/* Location Suggestions */}
//                 {activeDropdown === 'location' && suggestions.location.length > 0 && (
//                   <div className="suggestions-dropdown">
//                     {suggestions.location.map((suggestion, index) => (
//                       <div
//                         key={index}
//                         className="suggestion-item"
//                         onClick={() => handleSuggestionClick('location', suggestion)}
//                       >
//                         <i className="fas fa-map-marker-alt suggestion-icon"></i>
//                         <span>{suggestion}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Search Button */}
//               <button 
//                 className="search-submit-btn"
//                 onClick={handleSearch}
//               >
//                 <i className="fas fa-search"></i>
//                 Search
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         .search-compact-btn {
//           width: 40px;
//           height: 40px;
//           background: rgba(255, 255, 255, 0.9);
//           border: 2px solid rgba(255, 255, 255, 0.5);
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           color: #000000ff;
//           font-size: 16px;
//           backdrop-filter: blur(10px);
//           box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//         }

//         .search-compact-btn:hover {
//           background: #000000ff;
//           color: white;
//           transform: scale(1.1);
//           box-shadow: 0 4px 20px rgba(74, 144, 226, 0.3);
//         }

//         .search-overlay-modal {
//           position: fixed;
//           top: 0;
//           left: 0;
//           width: 100vw;
//           height: 100vh;
//           z-index: 10000;
//           display: flex;
//           align-items: flex-start;
//           justify-content: center;
//           padding-top: 60px;
//         }

//         .search-overlay-backdrop {
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           background: rgba(0, 0, 0, 0.5);
//           backdrop-filter: blur(5px);
//         }

//         .search-overlay-content {
//           position: relative;
//           width: 100%;
//           max-width: 900px;
//           margin: 0 20px;
//           background: white;
//           border-radius: 16px;
//           box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
//           animation: slideDown 0.3s ease-out;
//         }

//         @keyframes slideDown {
//           from {
//             opacity: 0;
//             transform: translateY(-50px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .search-modal-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 24px 32px;
//           border-bottom: 1px solid #e5e7eb;
//         }

//         .search-modal-header h3 {
//           margin: 0;
//           font-size: 24px;
//           font-weight: 600;
//           color: #1f2937;
//         }

//         .search-close-btn {
//           background: none;
//           border: none;
//           width: 32px;
//           height: 32px;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           color: #6b7280;
//           transition: all 0.2s ease;
//         }

//         .search-close-btn:hover {
//           background: #f3f4f6;
//           color: #374151;
//         }

//         .search-form-container {
//           display: flex;
//           align-items: stretch;
//           padding: 32px;
//           gap: 0;
//         }

//         .search-field-group {
//           position: relative;
//           flex: 1;
//           min-width: 0;
//         }

//         .search-field-group:first-child {
//           flex: 2;
//         }

//         .search-input-wrapper {
//           position: relative;
//           display: flex;
//           align-items: center;
//           height: 56px;
//         }

//         .search-input {
//           width: 100%;
//           height: 100%;
//           border: none;
//           outline: none;
//           font-size: 16px;
//           padding: 0 48px 0 48px;
//           color: #374151;
//           background: transparent;
//         }

//         .search-input::placeholder {
//           color: #9ca3af;
//           font-weight: 400;
//         }

//         .search-input:focus::placeholder {
//           opacity: 0.7;
//         }

//         .search-input-icon {
//           position: absolute;
//           left: 16px;
//           color: #6b7280;
//           font-size: 16px;
//           z-index: 1;
//         }

//         .dropdown-arrow {
//           position: absolute;
//           right: 16px;
//           color: #6b7280;
//           font-size: 12px;
//           pointer-events: none;
//         }

//         .search-separator {
//           width: 1px;
//           background: #e5e7eb;
//           margin: 8px 0;
//           flex-shrink: 0;
//         }

//         .search-submit-btn {
//           background: #000000ff;
//           color: white;
//           border: none;
//           border-radius: 8px;
//           padding: 0 32px;
//           font-size: 16px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           margin-left: 16px;
//           flex-shrink: 0;
//           min-width: 120px;
//           justify-content: center;
//         }

//         .search-submit-btn:hover {
//           background: #131313ff;
//           transform: translateY(-1px);
//           box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
//         }

//         .suggestions-dropdown {
//           position: absolute;
//           top: 100%;
//           left: 0;
//           right: 0;
//           background: white;
//           border: 1px solid #e5e7eb;
//           border-radius: 8px;
//           box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
//           max-height: 320px;
//           overflow-y: auto;
//           z-index: 10001;
//           margin-top: 4px;
//         }

//         .suggestion-item {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           padding: 12px 16px;
//           cursor: pointer;
//           transition: background-color 0.15s ease;
//           border-bottom: 1px solid #f3f4f6;
//         }

//         .suggestion-item:last-child {
//           border-bottom: none;
//         }

//         .suggestion-item:hover {
//           background: #f8fafc;
//         }

//         .suggestion-icon {
//           color: #6b7280;
//           font-size: 14px;
//           width: 16px;
//           flex-shrink: 0;
//         }

//         .suggestion-item span {
//           font-size: 14px;
//           color: #374151;
//         }

//         /* Mobile Responsive */
//         @media (max-width: 768px) {
//           .search-overlay-content {
//             margin: 0 10px;
//             border-radius: 12px;
//           }

//           .search-modal-header {
//             padding: 20px 24px;
//           }

//           .search-modal-header h3 {
//             font-size: 20px;
//           }

//           .search-form-container {
//             flex-direction: column;
//             padding: 24px;
//             gap: 16px;
//           }

//           .search-field-group {
//             flex: none;
//           }

//           .search-field-group:first-child {
//             flex: none;
//           }

//           .search-separator {
//             height: 1px;
//             width: 100%;
//             margin: 0;
//           }

//           .search-input {
//             font-size: 16px;
//             height: 48px;
//           }

//           .search-submit-btn {
//             margin-left: 0;
//             min-width: 100%;
//             height: 48px;
//           }

//           .suggestions-dropdown {
//             max-height: 240px;
//           }
//         }

//         /* Focus styles */
//         .search-input-wrapper:focus-within {
//           background: rgba(74, 144, 226, 0.05);
//         }

//         .search-input-wrapper:focus-within .search-input-icon {
//           color: #000000ff;
//         }

//         /* Scrollbar styles */
//         .suggestions-dropdown::-webkit-scrollbar {
//           width: 6px;
//         }

//         .suggestions-dropdown::-webkit-scrollbar-track {
//           background: #f1f5f9;
//         }

//         .suggestions-dropdown::-webkit-scrollbar-thumb {
//           background: #cbd5e1;
//           border-radius: 3px;
//         }

//         .suggestions-dropdown::-webkit-scrollbar-thumb:hover {
//           background: #94a3b8;
//         }
//       `}</style>
//     </>
//   );
// };

// export default SmartSearchBar;
// import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { setSearchQuery, setSelectedExperience, setSelectedLocation, setSelectedCompany, setSelectedCategory } from '../redux/store';

// const SmartSearchBar = ({ onSearch }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const { jobs, categories, companies, filters } = useSelector((state) => state.jobs);
  
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [searchValues, setSearchValues] = useState({
//     jobSearch: '',
//     experience: '',
//     location: ''
//   });
//   const [suggestions, setSuggestions] = useState({
//     jobSearch: [],
//     experience: [],
//     location: []
//   });
//   const [isLoading, setIsLoading] = useState(false);
  
//   const searchRefs = {
//     jobSearch: useRef(null),
//     experience: useRef(null),
//     location: useRef(null),
//     overlay: useRef(null)
//   };
  
//   const debounceRef = useRef(null);

//   // Experience options
//   const experienceOptions = [
//     { label: 'Fresher (less than 1 year)', value: 'Fresher' },
//     { label: '1 year', value: '1 yr' },
//     { label: '2 years', value: '2 yrs' },
//     { label: '3 years', value: '3 yrs' },
//     { label: '4 years', value: '4 yrs' },
//     { label: '5 years', value: '5 yrs' },
//     { label: 'Mid-level', value: 'Mid-level' },
//     { label: 'Senior', value: 'Senior' }
//   ];

//   // FIXED: Sync local search values with Redux filters when they change
//   useEffect(() => {
//     setSearchValues(prev => ({
//       ...prev,
//       jobSearch: filters.searchQuery || '',
//       location: filters.selectedLocation?.length > 0 ? filters.selectedLocation[0] : '',
//       experience: filters.selectedExperience?.length > 0 ? 
//         experienceOptions.find(exp => exp.value === filters.selectedExperience[0])?.label || filters.selectedExperience[0] : ''
//     }));
//   }, [filters.searchQuery, filters.selectedLocation, filters.selectedExperience]);

//   // Extract search data from jobs
//   const searchData = useMemo(() => {
//     const jobTitles = new Set();
//     const locations = new Set();
//     const companyNames = new Set();
//     const skills = new Set();

//     // Add some default popular job roles and skills
//     const defaultJobRoles = [
//       'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
//       'Software Engineer', 'Web Developer', 'Mobile Developer',
//       'Data Scientist', 'Machine Learning Engineer', 'DevOps Engineer',
//       'Product Manager', 'UI/UX Designer', 'Business Analyst',
//       'Quality Assurance Engineer', 'Database Administrator',
//       'Cloud Architect', 'Cybersecurity Specialist'
//     ];

//     const defaultSkills = [
//       'React', 'JavaScript', 'Python', 'Node.js', 'TypeScript', 'AWS', 'Docker',
//       'Java', 'Angular', 'Vue', 'PHP', 'Ruby', 'Go', 'MongoDB', 'PostgreSQL',
//       'MySQL', 'Git', 'Jenkins', 'Kubernetes', 'Machine Learning', 'AI',
//       'Data Science', 'Frontend', 'Backend', 'Full Stack', 'Mobile', 'iOS', 'Android',
//       'HTML', 'CSS', 'SQL', 'REST API', 'GraphQL', 'Firebase', 'Redis'
//     ];

//     // Add default job roles
//     defaultJobRoles.forEach(role => jobTitles.add(role));
//     defaultSkills.forEach(skill => skills.add(skill));

//     jobs.forEach(job => {
//       // Extract job titles
//       if (job.title) {
//         jobTitles.add(job.title);
//         // Also add variations of the job title
//         const titleWords = job.title.split(' ');
//         titleWords.forEach(word => {
//           if (word.length > 2) {
//             jobTitles.add(word);
//           }
//         });
//       }

//       // Extract locations
//       if (job.location) {
//         const locationParts = job.location.split(',').map(l => l.trim());
//         locationParts.forEach(part => {
//           if (part && part.length > 2) {
//             locations.add(part);
//           }
//         });
        
//         // Add "Remote" if mentioned
//         if (job.location.toLowerCase().includes('remote')) {
//           locations.add('Remote');
//         }
//       }

//       // Extract company names
//       if (job.companies?.name) {
//         companyNames.add(job.companies.name);
//       } else if (job.company?.name) {
//         companyNames.add(job.company.name);
//       }

//       // Extract skills from description
//       if (job.description) {
//         const descLower = job.description.toLowerCase();
//         defaultSkills.forEach(skill => {
//           if (descLower.includes(skill.toLowerCase())) {
//             skills.add(skill);
//           }
//         });
        
//         // Extract common tech terms from description
//         const techTerms = job.description.match(/\b[A-Z][a-z]*(?:\.[a-z]+|\+\+|#|\s+[A-Z][a-z]*)*\b/g) || [];
//         techTerms.forEach(term => {
//           if (term.length > 2 && term.length < 20) {
//             skills.add(term);
//           }
//         });
//       }
//     });

//     // Add companies from companies array
//     companies.forEach(company => {
//       if (company.name) {
//         companyNames.add(company.name);
//       }
//     });

//     // Add some default popular locations
//     const defaultLocations = [
//       'Remote', 'New York', 'San Francisco', 'Los Angeles', 'Chicago',
//       'Boston', 'Seattle', 'Austin', 'Denver', 'Atlanta',
//       'London', 'Berlin', 'Amsterdam', 'Toronto', 'Mumbai',
//       'Bangalore', 'Delhi', 'Hyderabad', 'Pune', 'Chennai'
//     ];
//     defaultLocations.forEach(loc => locations.add(loc));

//     return {
//       jobTitles: Array.from(jobTitles).sort(),
//       locations: Array.from(locations).sort(),
//       companies: Array.from(companyNames).sort(),
//       skills: Array.from(skills).sort()
//     };
//   }, [jobs, companies]);

//   // Improved fuzzy search function
//   const fuzzySearch = useCallback((items, query, limit = 8) => {
//     if (!query || query.length < 1) return items.slice(0, limit);
    
//     const queryLower = query.toLowerCase().trim();
    
//     return items
//       .map(item => {
//         const itemLower = item.toLowerCase();
//         let score = 0;
        
//         // Exact match
//         if (itemLower === queryLower) score = 100;
//         // Starts with query
//         else if (itemLower.startsWith(queryLower)) score = 90;
//         // Contains query at word boundary
//         else if (new RegExp(`\\b${queryLower}`, 'i').test(item)) score = 80;
//         // Contains query anywhere
//         else if (itemLower.includes(queryLower)) score = 70;
//         // Fuzzy matching - check if all characters of query exist in order
//         else {
//           let queryIndex = 0;
//           for (let i = 0; i < itemLower.length && queryIndex < queryLower.length; i++) {
//             if (itemLower[i] === queryLower[queryIndex]) {
//               queryIndex++;
//             }
//           }
//           if (queryIndex === queryLower.length) score = 50;
//         }
        
//         return score > 0 ? { item, score } : null;
//       })
//       .filter(Boolean)
//       .sort((a, b) => b.score - a.score)
//       .slice(0, limit)
//       .map(({ item }) => item);
//   }, []);

//   // Generate suggestions with improved logic
//   const generateSuggestions = useCallback((type, query) => {
//     switch (type) {
//       case 'jobSearch': {
//         const jobSuggestions = [];
//         const queryLower = query.toLowerCase().trim();
        
//         if (queryLower.length === 0) {
//           // Show popular job roles when no query
//           jobSuggestions.push(
//             ...searchData.jobTitles.slice(0, 5),
//             ...searchData.skills.slice(0, 3)
//           );
//         } else {
//           // Search in job titles first (higher priority)
//           const titleMatches = fuzzySearch(searchData.jobTitles, query, 4);
//           const skillMatches = fuzzySearch(searchData.skills, query, 2);
//           const companyMatches = fuzzySearch(searchData.companies, query, 2);
          
//           jobSuggestions.push(...titleMatches, ...skillMatches, ...companyMatches);
//         }
        
//         // Remove duplicates and limit results
//         return [...new Set(jobSuggestions)].slice(0, 8);
//       }
      
//       case 'location': {
//         if (!query || query.length === 0) {
//           return searchData.locations.slice(0, 8);
//         }
//         return fuzzySearch(searchData.locations, query, 8);
//       }
      
//       case 'experience': {
//         if (!query || query.length === 0) {
//           return experienceOptions;
//         }
//         return experienceOptions.filter(exp => 
//           exp.label.toLowerCase().includes(query.toLowerCase())
//         ).slice(0, 8);
//       }
      
//       default:
//         return [];
//     }
//   }, [searchData, fuzzySearch]);

//   // Debounced suggestion update
//   const updateSuggestions = useCallback((type, query) => {
//     if (debounceRef.current) {
//       clearTimeout(debounceRef.current);
//     }
    
//     debounceRef.current = setTimeout(() => {
//       const newSuggestions = generateSuggestions(type, query);
//       setSuggestions(prev => ({
//         ...prev,
//         [type]: newSuggestions
//       }));
//     }, 150); // Reduced debounce time for better responsiveness
//   }, [generateSuggestions]);

//   // Handle input change
//   const handleInputChange = useCallback((type, value) => {
//     setSearchValues(prev => ({
//       ...prev,
//       [type]: value
//     }));
    
//     // Always update suggestions for all types
//     updateSuggestions(type, value);
//   }, [updateSuggestions]);

//   // Handle dropdown focus
//   const handleDropdownFocus = useCallback((type) => {
//     setActiveDropdown(type);
//     // Generate initial suggestions when focused
//     updateSuggestions(type, searchValues[type]);
//   }, [searchValues, updateSuggestions]);

//   // Handle suggestion click
//   const handleSuggestionClick = useCallback((type, value) => {
//     if (type === 'experience') {
//       const exp = experienceOptions.find(e => e.label === value || e.value === value);
//       setSearchValues(prev => ({
//         ...prev,
//         experience: exp ? exp.label : value
//       }));
//     } else {
//       setSearchValues(prev => ({
//         ...prev,
//         [type]: value
//       }));
//     }
//     setActiveDropdown(null);
//   }, []);

//   // FIXED: Handle search - preserve existing filters while applying search
//   // const handleSearch = useCallback(() => {
//   //   const { jobSearch, experience, location } = searchValues;
    
//   //   // Navigate to jobs page if not already there
//   //   if (location.pathname !== '/jobs') {
//   //     navigate('/jobs');
//   //   }

//   //   // FIXED: Apply search filters without overriding existing filters
//   //   if (jobSearch.trim()) {
//   //     dispatch(setSearchQuery(jobSearch.trim()));
//   //   }
    
//   //   if (experience) {
//   //     const exp = experienceOptions.find(e => e.label === experience);
//   //     // Add to existing experience filters instead of replacing
//   //     const currentExperience = filters.selectedExperience || [];
//   //     const newExperience = exp ? exp.value : experience;
//   //     if (!currentExperience.includes(newExperience)) {
//   //       dispatch(setSelectedExperience([...currentExperience, newExperience]));
//   //     }
//   //   }
    
//   //   if (location.trim()) {
//   //     // Add to existing location filters instead of replacing
//   //     const currentLocations = filters.selectedLocation || [];
//   //     if (!currentLocations.includes(location.trim())) {
//   //       dispatch(setSelectedLocation([...currentLocations, location.trim()]));
//   //     }
//   //   }

//   //   // Close overlay
//   //   setIsExpanded(false);
//   //   setActiveDropdown(null);
    
//   //   if (onSearch) {
//   //     onSearch({ jobSearch, experience, location });
//   //   }
//   // }, [searchValues, dispatch, navigate, location.pathname, onSearch, filters.selectedExperience, filters.selectedLocation]);
// //   const handleSearch = useCallback(() => {
// //   const { jobSearch, experience, location } = searchValues;

// //   // Navigate to jobs page if not already there
// //   if (location.pathname !== '/jobs') {
// //     navigate('/jobs');
// //   }

// //   // If all inputs are blank, clear all search filters
// //   if (!jobSearch.trim() && !experience && !location.trim()) {
// //     dispatch(setSearchQuery(''));
// //     dispatch(setSelectedExperience([]));
// //     dispatch(setSelectedLocation([]));
// //     dispatch(setSelectedCompany([]));
// //     dispatch(setSelectedCategory([]));
// //   } else {
// //     // Apply search filters without overriding existing filters
// //     if (jobSearch.trim()) {
// //       dispatch(setSearchQuery(jobSearch.trim()));
// //     } else {
// //       dispatch(setSearchQuery(''));
// //     }

// //     if (experience) {
// //       const exp = experienceOptions.find(e => e.label === experience);
// //       const currentExperience = filters.selectedExperience || [];
// //       const newExperience = exp ? exp.value : experience;
// //       if (!currentExperience.includes(newExperience)) {
// //         dispatch(setSelectedExperience([...currentExperience, newExperience]));
// //       }
// //     } else {
// //       dispatch(setSelectedExperience([]));
// //     }

// //     if (location.trim()) {
// //       const currentLocations = filters.selectedLocation || [];
// //       if (!currentLocations.includes(location.trim())) {
// //         dispatch(setSelectedLocation([...currentLocations, location.trim()]));
// //       }
// //     } else {
// //       dispatch(setSelectedLocation([]));
// //     }
// //   }

// //   // Close overlay
// //   setIsExpanded(false);
// //   setActiveDropdown(null);

// //   if (onSearch) {
// //     onSearch({ jobSearch, experience, location });
// //   }
// // }, [searchValues, dispatch, navigate, location.pathname, onSearch, filters.selectedExperience, filters.selectedLocation]);
//   // FIXED: SmartSearchBar handleSearch function to work with multiple filters

// const handleSearch = useCallback(() => {
//   const { jobSearch, experience, location } = searchValues;

//   // Navigate to jobs page if not already there
//   if (location.pathname !== '/jobs') {
//     navigate('/jobs');
//   }

//   // If all inputs are blank, clear all search filters
//   if (!jobSearch.trim() && !experience && !location.trim()) {
//     dispatch(setSearchQuery(''));
//     dispatch(setSelectedExperience([]));
//     dispatch(setSelectedLocation([]));
//     // Don't clear company and category filters when clearing search
//     // dispatch(setSelectedCompany([]));
//     // dispatch(setSelectedCategory([]));
//   } else {
//     // Apply search filters - ADD to existing filters instead of replacing
    
//     // Handle job search query - this replaces the search term
//     if (jobSearch.trim()) {
//       dispatch(setSearchQuery(jobSearch.trim()));
//     } else {
//       dispatch(setSearchQuery(''));
//     }

//     // Handle experience - ADD to existing experience filters
//     if (experience) {
//       const exp = experienceOptions.find(e => e.label === experience);
//       const currentExperience = filters.selectedExperience || [];
//       const newExperience = exp ? exp.value : experience;
      
//       // Only add if not already present
//       if (!currentExperience.includes(newExperience)) {
//         dispatch(setSelectedExperience([...currentExperience, newExperience]));
//       }
//     }

//     // Handle location - ADD to existing location filters  
//     if (location.trim()) {
//       const currentLocations = filters.selectedLocation || [];
//       const newLocation = location.trim();
      
//       // Only add if not already present
//       if (!currentLocations.includes(newLocation)) {
//         dispatch(setSelectedLocation([...currentLocations, newLocation]));
//       }
//     }
//   }

//   // Reset to first page when searching
//   dispatch(setCurrentPage(1));

//   // Close overlay
//   setIsExpanded(false);
//   setActiveDropdown(null);

//   if (onSearch) {
//     onSearch({ jobSearch, experience, location });
//   }
// }, [searchValues, dispatch, navigate, location.pathname, onSearch, filters.selectedExperience, filters.selectedLocation, experienceOptions]);

//   // Handle escape key
//   useEffect(() => {
//     const handleEscape = (e) => {
//       if (e.key === 'Escape') {
//         setIsExpanded(false);
//         setActiveDropdown(null);
//       }
//     };

//     if (isExpanded) {
//       document.addEventListener('keydown', handleEscape);
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = '';
//     }

//     return () => {
//       document.removeEventListener('keydown', handleEscape);
//       document.body.style.overflow = '';
//     };
//   }, [isExpanded]);

//   // Handle click outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (searchRefs.overlay.current && !searchRefs.overlay.current.contains(event.target)) {
//         setActiveDropdown(null);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Handle enter key in search
//   const handleKeyDown = useCallback((e, type) => {
//     if (e.key === 'Enter') {
//       if (type === 'jobSearch' || (type === 'location' && !activeDropdown)) {
//         handleSearch();
//       }
//     }
//   }, [handleSearch, activeDropdown]);

//   return (
//     <>
//       {/* Compact Search Button */}
//       <div className="search-compact-btn" onClick={() => setIsExpanded(true)}>
//         <i className="fas fa-search"></i>
//       </div>

//       {/* Search Overlay Modal */}
//       {isExpanded && (
//         <div className="search-overlay-modal">
//           <div className="search-overlay-backdrop" onClick={() => setIsExpanded(false)} />
          
//           <div ref={searchRefs.overlay} className="search-overlay-content">
//             <div className="search-modal-header">
//               <h3>Find your dream job</h3>
//               <button 
//                 className="search-close-btn"
//                 onClick={() => setIsExpanded(false)}
//               >
//                 <i className="fas fa-times"></i>
//               </button>
//             </div>

//             <div className="search-form-container">
//               {/* Job Search Input */}
//               <div className="search-field-group">
//                 <div className="search-input-wrapper">
//                   <i className="fas fa-search search-input-icon"></i>
//                   <input
//                     ref={searchRefs.jobSearch}
//                     type="text"
//                     placeholder="Enter skills / designations / companies"
//                     value={searchValues.jobSearch}
//                     onChange={(e) => handleInputChange('jobSearch', e.target.value)}
//                     onFocus={() => handleDropdownFocus('jobSearch')}
//                     onKeyDown={(e) => handleKeyDown(e, 'jobSearch')}
//                     className="search-input"
//                   />
//                 </div>
                
//                 {/* Job Search Suggestions */}
//                 {activeDropdown === 'jobSearch' && suggestions.jobSearch && suggestions.jobSearch.length > 0 && (
//                   <div className="suggestions-dropdown">
//                     {suggestions.jobSearch.map((suggestion, index) => (
//                       <div
//                         key={index}
//                         className="suggestion-item"
//                         onClick={() => handleSuggestionClick('jobSearch', suggestion)}
//                       >
//                         <i className="fas fa-briefcase suggestion-icon"></i>
//                         <span>{suggestion}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div className="search-separator"></div>

//               {/* Experience Dropdown */}
//               <div className="search-field-group">
//                 <div className="search-input-wrapper">
//                   <i className="fas fa-user-tie search-input-icon"></i>
//                   <input
//                     ref={searchRefs.experience}
//                     type="text"
//                     placeholder="Select experience"
//                     value={searchValues.experience}
//                     onChange={(e) => handleInputChange('experience', e.target.value)}
//                     onFocus={() => handleDropdownFocus('experience')}
//                     className="search-input"
//                     readOnly
//                   />
//                   <i className="fas fa-chevron-down dropdown-arrow"></i>
//                 </div>
                
//                 {/* Experience Suggestions */}
//                 {activeDropdown === 'experience' && (
//                   <div className="suggestions-dropdown">
//                     {suggestions.experience.map((exp, index) => (
//                       <div
//                         key={index}
//                         className="suggestion-item"
//                         onClick={() => handleSuggestionClick('experience', exp.label || exp)}
//                       >
//                         <i className="fas fa-chart-line suggestion-icon"></i>
//                         <span>{exp.label || exp}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div className="search-separator"></div>

//               {/* Location Input */}
//               <div className="search-field-group">
//                 <div className="search-input-wrapper">
//                   <i className="fas fa-map-marker-alt search-input-icon"></i>
//                   <input
//                     ref={searchRefs.location}
//                     type="text"
//                     placeholder="Enter location"
//                     value={searchValues.location}
//                     onChange={(e) => handleInputChange('location', e.target.value)}
//                     onFocus={() => handleDropdownFocus('location')}
//                     onKeyDown={(e) => handleKeyDown(e, 'location')}
//                     className="search-input"
//                   />
//                 </div>
                
//                 {/* Location Suggestions */}
//                 {activeDropdown === 'location' && suggestions.location.length > 0 && (
//                   <div className="suggestions-dropdown">
//                     {suggestions.location.map((suggestion, index) => (
//                       <div
//                         key={index}
//                         className="suggestion-item"
//                         onClick={() => handleSuggestionClick('location', suggestion)}
//                       >
//                         <i className="fas fa-map-marker-alt suggestion-icon"></i>
//                         <span>{suggestion}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Search Button */}
//               <button 
//                 className="search-submit-btn"
//                 onClick={handleSearch}
//               >
//                 <i className="fas fa-search"></i>
//                 Search
//               </button>
//             </div>

//             {/* ADDED: Current filters display */}
//             {(filters.searchQuery || (filters.selectedCategory && filters.selectedCategory.length > 0) || 
//               (filters.selectedExperience && filters.selectedExperience.length > 0) || 
//               (filters.selectedLocation && filters.selectedLocation.length > 0) ||
//               (filters.selectedCompany && filters.selectedCompany.length > 0)) && (
//               <div className="current-filters-display">
//                 <div className="current-filters-header">
//                   <h4>Current Active Filters:</h4>
//                 </div>
//                 <div className="active-filters-list">
//                   {filters.searchQuery && (
//                     <span className="filter-tag search-tag">
//                       <i className="fas fa-search"></i>
//                       {filters.searchQuery}
//                     </span>
//                   )}
//                   {filters.selectedCategory?.map(catId => {
//                     const category = categories.find(c => c.id === catId);
//                     return category ? (
//                       <span key={catId} className="filter-tag category-tag">
//                         <i className="fas fa-industry"></i>
//                         {category.name}
//                       </span>
//                     ) : null;
//                   })}
//                   {filters.selectedExperience?.map(exp => (
//                     <span key={exp} className="filter-tag experience-tag">
//                       <i className="fas fa-user-tie"></i>
//                       {exp}
//                     </span>
//                   ))}
//                   {filters.selectedLocation?.map(loc => (
//                     <span key={loc} className="filter-tag location-tag">
//                       <i className="fas fa-map-marker-alt"></i>
//                       {loc}
//                     </span>
//                   ))}
//                   {filters.selectedCompany?.map(compId => {
//                     const company = companies.find(c => c.id === compId);
//                     return company ? (
//                       <span key={compId} className="filter-tag company-tag">
//                         <i className="fas fa-building"></i>
//                         {company.name}
//                       </span>
//                     ) : null;
//                   })}
//                 </div>
//                 <p className="filters-note">
//                   <i className="fas fa-info-circle"></i>
//                   New search terms will be added to your existing filters
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         .search-compact-btn {
//           width: 40px;
//           height: 40px;
//           background: rgba(255, 255, 255, 0.9);
//           border: 2px solid rgba(255, 255, 255, 0.5);
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           color: #000000ff;
//           font-size: 16px;
//           backdrop-filter: blur(10px);
//           box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//         }

//         .search-compact-btn:hover {
//           background: #000000ff;
//           color: white;
//           transform: scale(1.1);
//           box-shadow: 0 4px 20px rgba(74, 144, 226, 0.3);
//         }

//         .search-overlay-modal {
//           position: fixed;
//           top: 0;
//           left: 0;
//           width: 100vw;
//           height: 100vh;
//           z-index: 10000;
//           display: flex;
//           align-items: flex-start;
//           justify-content: center;
//           padding-top: 60px;
//         }

//         .search-overlay-backdrop {
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           background: rgba(0, 0, 0, 0.5);
//           backdrop-filter: blur(5px);
//         }

//         .search-overlay-content {
//           position: relative;
//           width: 100%;
//           max-width: 900px;
//           margin: 0 20px;
//           background: white;
//           border-radius: 16px;
//           box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
//           animation: slideDown 0.3s ease-out;
//           max-height: 90vh;
//           // overflow-y: auto;
//         }

//         @keyframes slideDown {
//           from {
//             opacity: 0;
//             transform: translateY(-50px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .search-modal-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 24px 32px;
//           border-bottom: 1px solid #e5e7eb;
//         }

//         .search-modal-header h3 {
//           margin: 0;
//           font-size: 24px;
//           font-weight: 600;
//           color: #1f2937;
//         }

//         .search-close-btn {
//           background: none;
//           border: none;
//           width: 32px;
//           height: 32px;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           color: #6b7280;
//           transition: all 0.2s ease;
//         }

//         .search-close-btn:hover {
//           background: #f3f4f6;
//           color: #374151;
//         }

//         .search-form-container {
//           display: flex;
//           align-items: stretch;
//           padding: 32px;
//           gap: 0;
//         }

//         .search-field-group {
//           position: relative;
//           flex: 1;
//           min-width: 0;
//         }

//         .search-field-group:first-child {
//           flex: 2;
//         }

//         .search-input-wrapper {
//           position: relative;
//           display: flex;
//           align-items: center;
//           height: 56px;
//         }

//         .search-input {
//           width: 100%;
//           height: 100%;
//           border: none;
//           outline: none;
//           font-size: 16px;
//           padding: 0 48px 0 48px;
//           color: #374151;
//           background: transparent;
//         }

//         .search-input::placeholder {
//           color: #9ca3af;
//           font-weight: 400;
//         }

//         .search-input:focus::placeholder {
//           opacity: 0.7;
//         }

//         .search-input-icon {
//           position: absolute;
//           left: 16px;
//           color: #6b7280;
//           font-size: 16px;
//           z-index: 1;
//         }

//         .dropdown-arrow {
//           position: absolute;
//           right: 16px;
//           color: #6b7280;
//           font-size: 12px;
//           pointer-events: none;
//         }

//         .search-separator {
//           width: 1px;
//           background: #e5e7eb;
//           margin: 8px 0;
//           flex-shrink: 0;
//         }

//         .search-submit-btn {
//           background: #000000ff;
//           color: white;
//           border: none;
//           border-radius: 8px;
//           padding: 0 32px;
//           font-size: 16px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           margin-left: 16px;
//           flex-shrink: 0;
//           min-width: 120px;
//           justify-content: center;
//         }

//         .search-submit-btn:hover {
//           background: #131313ff;
//           transform: translateY(-1px);
//           box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
//         }

//         .suggestions-dropdown {
//           position: absolute;
//           top: 100%;
//           left: 0;
//           right: 0;
//           background: white;
//           border: 1px solid #e5e7eb;
//           border-radius: 8px;
//           box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
//           max-height: 320px;
//           overflow-y: auto;
//           z-index: 10001;
//           margin-top: 4px;
//         }

//         .suggestion-item {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           padding: 12px 16px;
//           cursor: pointer;
//           transition: background-color 0.15s ease;
//           border-bottom: 1px solid #f3f4f6;
//         }

//         .suggestion-item:last-child {
//           border-bottom: none;
//         }

//         .suggestion-item:hover {
//           background: #f8fafc;
//         }

//         .suggestion-icon {
//           color: #6b7280;
//           font-size: 14px;
//           width: 16px;
//           flex-shrink: 0;
//         }

//         .suggestion-item span {
//           font-size: 14px;
//           color: #374151;
//         }

//         /* Current Filters Display */
//         .current-filters-display {
//           padding: 20px 32px 32px 32px;
//           border-top: 1px solid #e5e7eb;
//           background: #f8f9fa;
//         }

//         .current-filters-header h4 {
//           margin: 0 0 15px 0;
//           font-size: 16px;
//           font-weight: 600;
//           color: #374151;
//         }

//         .active-filters-list {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 8px;
//           margin-bottom: 12px;
//         }

//         .filter-tag {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           padding: 6px 12px;
//           background: #e5e7eb;
//           color: #374151;
//           border-radius: 16px;
//           font-size: 13px;
//           font-weight: 500;
//         }

//         .filter-tag i {
//           font-size: 11px;
//         }

//         .search-tag {
//           background: #dbeafe;
//           color: #1e40af;
//         }

//         .category-tag {
//           background: #fef3c7;
//           color: #92400e;
//         }

//         .experience-tag {
//           background: #d1fae5;
//           color: #065f46;
//         }

//         .location-tag {
//           background: #fecaca;
//           color: #991b1b;
//         }

//         .company-tag {
//           background: #e0e7ff;
//           color: #3730a3;
//         }

//         .filters-note {
//           margin: 0;
//           font-size: 12px;
//           color: #6b7280;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }

//         .filters-note i {
//           font-size: 11px;
//         }

//         /* Mobile Responsive */
//         @media (max-width: 768px) {
//           .search-overlay-content {
//             margin: 0 10px;
//             border-radius: 12px;
//             max-height: 95vh;
//           }

//           .search-modal-header {
//             padding: 20px 24px;
//           }

//           .search-modal-header h3 {
//             font-size: 20px;
//           }

//           .search-form-container {
//             flex-direction: column;
//             padding: 24px;
//             gap: 16px;
//           }

//           .search-field-group {
//             flex: none;
//           }

//           .search-field-group:first-child {
//             flex: none;
//           }

//           .search-separator {
//             height: 1px;
//             width: 100%;
//             margin: 0;
//           }

//           .search-input {
//             font-size: 16px;
//             height: 48px;
//           }

//           .search-submit-btn {
//             margin-left: 0;
//             min-width: 100%;
//             height: 48px;
//           }

//           .suggestions-dropdown {
//             max-height: 240px;
//           }

//           .current-filters-display {
//             padding: 16px 24px 24px 24px;
//           }

//           .active-filters-list {
//             gap: 6px;
//           }

//           .filter-tag {
//             font-size: 12px;
//             padding: 4px 8px;
//           }
//         }

//         /* Focus styles */
//         .search-input-wrapper:focus-within {
//           background: rgba(74, 144, 226, 0.05);
//         }

//         .search-input-wrapper:focus-within .search-input-icon {
//           color: #000000ff;
//         }

//         /* Scrollbar styles */
//         .suggestions-dropdown::-webkit-scrollbar,
//         .search-overlay-content::-webkit-scrollbar {
//           width: 6px;
//         }

//         .suggestions-dropdown::-webkit-scrollbar-track,
//         .search-overlay-content::-webkit-scrollbar-track {
//           background: #f1f5f9;
//         }

//         .suggestions-dropdown::-webkit-scrollbar-thumb,
//         .search-overlay-content::-webkit-scrollbar-thumb {
//           background: #cbd5e1;
//           border-radius: 3px;
//         }

//         .suggestions-dropdown::-webkit-scrollbar-thumb:hover,
//         .search-overlay-content::-webkit-scrollbar-thumb:hover {
//           background: #94a3b8;
//         }
//       `}</style>
//     </>
//   );
// };

// export default SmartSearchBar;
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setSearchQuery, setSelectedExperience, setSelectedLocation, setSelectedCompany, setSelectedCategory, setCurrentPage } from '../redux/store';

const SmartSearchBar = ({ onSearch }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { jobs, categories, companies, filters } = useSelector((state) => state.jobs);
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchValues, setSearchValues] = useState({
    jobSearch: '',
    experience: '',
    location: ''
  });
  const [suggestions, setSuggestions] = useState({
    jobSearch: [],
    experience: [],
    location: []
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const searchRefs = {
    jobSearch: useRef(null),
    experience: useRef(null),
    location: useRef(null),
    overlay: useRef(null)
  };
  
  const debounceRef = useRef(null);

  // Experience options
  const experienceOptions = [
    { label: 'Fresher (less than 1 year)', value: 'Fresher' },
    { label: '1 year', value: '1 yr' },
    { label: '2 years', value: '2 yrs' },
    { label: '3 years', value: '3 yrs' },
    { label: '4 years', value: '4 yrs' },
    { label: '5 years', value: '5 yrs' },
    { label: 'Mid-level', value: 'Mid-level' },
    { label: 'Senior', value: 'Senior' }
  ];

  // FIXED: More precise search-to-filter mapping function
  const getRelatedFiltersFromSearch = useCallback((searchTerm) => {
    if (!searchTerm || !searchTerm.trim()) return { categories: [], companies: [] };
    
    const term = searchTerm.toLowerCase().trim();
    const relatedCategories = [];
    const relatedCompanies = [];
    
    console.log('SmartSearchBar: Analyzing search term:', term);
    
    // More precise category matching - only select the BEST match, not all matches
    const categoryMatches = [];
    
    categories.forEach(category => {
      const categoryName = category.name.toLowerCase();
      let score = 0;
      let matchType = '';
      
      // Exact match gets highest priority
      if (categoryName === term) {
        score = 100;
        matchType = 'exact';
      }
      // Exact phrase match (e.g., "software engineer" matches "Software Engineering")
      else if (term.includes('software') && term.includes('engineer') && categoryName.includes('software') && categoryName.includes('engineering')) {
        score = 90;
        matchType = 'phrase';
      }
      // Direct contains match
      else if (categoryName.includes(term)) {
        score = 80;
        matchType = 'contains';
      }
      // Term contains category (but only for longer category names to avoid too broad matches)
      else if (term.includes(categoryName) && categoryName.length > 5) {
        score = 70;
        matchType = 'reverse_contains';
      }
      // Specific keyword mappings - only very specific matches
      else if (
        (term === 'software engineer' && categoryName === 'software engineering') ||
        (term === 'data scientist' && categoryName === 'data science') ||
        (term === 'web developer' && categoryName === 'web development') ||
        (term === 'mobile developer' && categoryName === 'mobile development') ||
        (term === 'frontend developer' && categoryName === 'frontend development') ||
        (term === 'backend developer' && categoryName === 'backend development') ||
        (term === 'devops engineer' && categoryName === 'devops') ||
        (term === 'ui designer' && categoryName === 'ui/ux design') ||
        (term === 'ux designer' && categoryName === 'ui/ux design')
      ) {
        score = 85;
        matchType = 'specific';
      }
      
      if (score > 0) {
        categoryMatches.push({ 
          id: category.id, 
          name: category.name, 
          score, 
          matchType 
        });
      }
    });
    
    // Sort by score and only take the TOP 1-2 matches to avoid selecting too many
    const topCategoryMatches = categoryMatches
      .sort((a, b) => b.score - a.score)
      .slice(0, 2) // Maximum 2 categories
      .filter(match => match.score >= 70); // Only high-confidence matches
    
    topCategoryMatches.forEach(match => {
      console.log(`SmartSearchBar: Selected category: ${match.name} (score: ${match.score}, type: ${match.matchType})`);
      relatedCategories.push(match.id);
    });
    
    // Company matching - more precise
    const companyMatches = [];
    
    companies.forEach(company => {
      const companyName = company.name.toLowerCase();
      let score = 0;
      let matchType = '';
      
      // Exact match
      if (companyName === term) {
        score = 100;
        matchType = 'exact';
      }
      // Contains search term
      else if (companyName.includes(term) && term.length > 2) {
        score = 90;
        matchType = 'contains';
      }
      // Search term contains company name (for well-known companies)
      else if (term.includes(companyName) && companyName.length > 3) {
        score = 85;
        matchType = 'reverse_contains';
      }
      
      if (score > 0) {
        companyMatches.push({ 
          id: company.id, 
          name: company.name, 
          score, 
          matchType 
        });
      }
    });
    
    // Only take the TOP 1 company match
    const topCompanyMatches = companyMatches
      .sort((a, b) => b.score - a.score)
      .slice(0, 1) // Maximum 1 company
      .filter(match => match.score >= 85); // Only very high-confidence matches
    
    topCompanyMatches.forEach(match => {
      console.log(`SmartSearchBar: Selected company: ${match.name} (score: ${match.score}, type: ${match.matchType})`);
      relatedCompanies.push(match.id);
    });
    
    console.log('SmartSearchBar: Final selection - Categories:', relatedCategories.length, 'Companies:', relatedCompanies.length);
    
    return { categories: relatedCategories, companies: relatedCompanies };
  }, [categories, companies]);

  // FIXED: Sync local search values with Redux filters when they change
  useEffect(() => {
    setSearchValues(prev => ({
      ...prev,
      jobSearch: filters.searchQuery || '',
      location: filters.selectedLocation?.length > 0 ? filters.selectedLocation[0] : '',
      experience: filters.selectedExperience?.length > 0 ? 
        experienceOptions.find(exp => exp.value === filters.selectedExperience[0])?.label || filters.selectedExperience[0] : ''
    }));
  }, [filters.searchQuery, filters.selectedLocation, filters.selectedExperience]);

  // Extract search data from jobs
  const searchData = useMemo(() => {
    const jobTitles = new Set();
    const locations = new Set();
    const companyNames = new Set();
    const skills = new Set();

    // Add some default popular job roles and skills
    const defaultJobRoles = [
      'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
      'Software Engineer', 'Web Developer', 'Mobile Developer',
      'Data Scientist', 'Machine Learning Engineer', 'DevOps Engineer',
      'Product Manager', 'UI/UX Designer', 'Business Analyst',
      'Quality Assurance Engineer', 'Database Administrator',
      'Cloud Architect', 'Cybersecurity Specialist'
    ];

    const defaultSkills = [
      'React', 'JavaScript', 'Python', 'Node.js', 'TypeScript', 'AWS', 'Docker',
      'Java', 'Angular', 'Vue', 'PHP', 'Ruby', 'Go', 'MongoDB', 'PostgreSQL',
      'MySQL', 'Git', 'Jenkins', 'Kubernetes', 'Machine Learning', 'AI',
      'Data Science', 'Frontend', 'Backend', 'Full Stack', 'Mobile', 'iOS', 'Android',
      'HTML', 'CSS', 'SQL', 'REST API', 'GraphQL', 'Firebase', 'Redis'
    ];

    // Add default job roles
    defaultJobRoles.forEach(role => jobTitles.add(role));
    defaultSkills.forEach(skill => skills.add(skill));

    jobs.forEach(job => {
      // Extract job titles
      if (job.title) {
        jobTitles.add(job.title);
        // Also add variations of the job title
        const titleWords = job.title.split(' ');
        titleWords.forEach(word => {
          if (word.length > 2) {
            jobTitles.add(word);
          }
        });
      }

      // Extract locations
      if (job.location) {
        const locationParts = job.location.split(',').map(l => l.trim());
        locationParts.forEach(part => {
          if (part && part.length > 2) {
            locations.add(part);
          }
        });
        
        // Add "Remote" if mentioned
        if (job.location.toLowerCase().includes('remote')) {
          locations.add('Remote');
        }
      }

      // Extract company names
      if (job.companies?.name) {
        companyNames.add(job.companies.name);
      } else if (job.company?.name) {
        companyNames.add(job.company.name);
      }

      // Extract skills from description
      if (job.description) {
        const descLower = job.description.toLowerCase();
        defaultSkills.forEach(skill => {
          if (descLower.includes(skill.toLowerCase())) {
            skills.add(skill);
          }
        });
        
        // Extract common tech terms from description
        const techTerms = job.description.match(/\b[A-Z][a-z]*(?:\.[a-z]+|\+\+|#|\s+[A-Z][a-z]*)*\b/g) || [];
        techTerms.forEach(term => {
          if (term.length > 2 && term.length < 20) {
            skills.add(term);
          }
        });
      }
    });

    // Add companies from companies array
    companies.forEach(company => {
      if (company.name) {
        companyNames.add(company.name);
      }
    });

    // Add some default popular locations
    const defaultLocations = [
      'Remote', 'New York', 'San Francisco', 'Los Angeles', 'Chicago',
      'Boston', 'Seattle', 'Austin', 'Denver', 'Atlanta',
      'London', 'Berlin', 'Amsterdam', 'Toronto', 'Mumbai',
      'Bangalore', 'Delhi', 'Hyderabad', 'Pune', 'Chennai'
    ];
    defaultLocations.forEach(loc => locations.add(loc));

    return {
      jobTitles: Array.from(jobTitles).sort(),
      locations: Array.from(locations).sort(),
      companies: Array.from(companyNames).sort(),
      skills: Array.from(skills).sort()
    };
  }, [jobs, companies]);

  // Improved fuzzy search function
  const fuzzySearch = useCallback((items, query, limit = 8) => {
    if (!query || query.length < 1) return items.slice(0, limit);
    
    const queryLower = query.toLowerCase().trim();
    
    return items
      .map(item => {
        const itemLower = item.toLowerCase();
        let score = 0;
        
        // Exact match
        if (itemLower === queryLower) score = 100;
        // Starts with query
        else if (itemLower.startsWith(queryLower)) score = 90;
        // Contains query at word boundary
        else if (new RegExp(`\\b${queryLower}`, 'i').test(item)) score = 80;
        // Contains query anywhere
        else if (itemLower.includes(queryLower)) score = 70;
        // Fuzzy matching - check if all characters of query exist in order
        else {
          let queryIndex = 0;
          for (let i = 0; i < itemLower.length && queryIndex < queryLower.length; i++) {
            if (itemLower[i] === queryLower[queryIndex]) {
              queryIndex++;
            }
          }
          if (queryIndex === queryLower.length) score = 50;
        }
        
        return score > 0 ? { item, score } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ item }) => item);
  }, []);

  // Generate suggestions with improved logic
  const generateSuggestions = useCallback((type, query) => {
    switch (type) {
      case 'jobSearch': {
        const jobSuggestions = [];
        const queryLower = query.toLowerCase().trim();
        
        if (queryLower.length === 0) {
          // Show popular job roles when no query
          jobSuggestions.push(
            ...searchData.jobTitles.slice(0, 5),
            ...searchData.skills.slice(0, 3)
          );
        } else {
          // Search in job titles first (higher priority)
          const titleMatches = fuzzySearch(searchData.jobTitles, query, 4);
          const skillMatches = fuzzySearch(searchData.skills, query, 2);
          const companyMatches = fuzzySearch(searchData.companies, query, 2);
          
          jobSuggestions.push(...titleMatches, ...skillMatches, ...companyMatches);
        }
        
        // Remove duplicates and limit results
        return [...new Set(jobSuggestions)].slice(0, 8);
      }
      
      case 'location': {
        if (!query || query.length === 0) {
          return searchData.locations.slice(0, 8);
        }
        return fuzzySearch(searchData.locations, query, 8);
      }
      
      case 'experience': {
        if (!query || query.length === 0) {
          return experienceOptions;
        }
        return experienceOptions.filter(exp => 
          exp.label.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8);
      }
      
      default:
        return [];
    }
  }, [searchData, fuzzySearch]);

  // Debounced suggestion update
  const updateSuggestions = useCallback((type, query) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      const newSuggestions = generateSuggestions(type, query);
      setSuggestions(prev => ({
        ...prev,
        [type]: newSuggestions
      }));
    }, 150); // Reduced debounce time for better responsiveness
  }, [generateSuggestions]);

  // Handle input change
  const handleInputChange = useCallback((type, value) => {
    setSearchValues(prev => ({
      ...prev,
      [type]: value
    }));
    
    // Always update suggestions for all types
    updateSuggestions(type, value);
  }, [updateSuggestions]);

  // Handle dropdown focus
  const handleDropdownFocus = useCallback((type) => {
    setActiveDropdown(type);
    // Generate initial suggestions when focused
    updateSuggestions(type, searchValues[type]);
  }, [searchValues, updateSuggestions]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((type, value) => {
    if (type === 'experience') {
      const exp = experienceOptions.find(e => e.label === value || e.value === value);
      setSearchValues(prev => ({
        ...prev,
        experience: exp ? exp.label : value
      }));
    } else {
      setSearchValues(prev => ({
        ...prev,
        [type]: value
      }));
    }
    setActiveDropdown(null);
  }, []);

  // FIXED: Enhanced handleSearch with search-to-filter mapping and modal closing
  const handleSearch = useCallback(() => {
    const { jobSearch, experience, location } = searchValues;

    // Navigate to jobs page if not already there
    if (location.pathname !== '/jobs') {
      navigate('/jobs');
    }

    // If all inputs are blank, clear all search filters
    if (!jobSearch.trim() && !experience && !location.trim()) {
      dispatch(setSearchQuery(''));
      dispatch(setSelectedExperience([]));
      dispatch(setSelectedLocation([]));
    } else {
      // Apply search query
      if (jobSearch.trim()) {
        dispatch(setSearchQuery(jobSearch.trim()));
        
        // ENHANCED: Apply smart filter mapping when searching
        console.log('SmartSearchBar: Applying search-to-filter mapping for:', jobSearch.trim());
        const relatedFilters = getRelatedFiltersFromSearch(jobSearch.trim());
        
        // Auto-apply related category filters
        if (relatedFilters.categories.length > 0) {
          console.log('SmartSearchBar: Auto-applying category filters:', relatedFilters.categories.map(id => 
            categories.find(cat => cat.id === id)?.name || id
          ));
          
          const currentCategories = filters.selectedCategory || [];
          const newCategories = [...new Set([...currentCategories, ...relatedFilters.categories])];
          dispatch(setSelectedCategory(newCategories));
        }
        
        // Auto-apply related company filters
        if (relatedFilters.companies.length > 0) {
          console.log('SmartSearchBar: Auto-applying company filters:', relatedFilters.companies.map(id => 
            companies.find(comp => comp.id === id)?.name || id
          ));
          
          const currentCompanies = filters.selectedCompany || [];
          const newCompanies = [...new Set([...currentCompanies, ...relatedFilters.companies])];
          dispatch(setSelectedCompany(newCompanies));
        }
      } else {
        dispatch(setSearchQuery(''));
      }

      // Handle experience filter
      if (experience) {
        const exp = experienceOptions.find(e => e.label === experience);
        const currentExperience = filters.selectedExperience || [];
        const newExperience = exp ? exp.value : experience;
        
        if (!currentExperience.includes(newExperience)) {
          dispatch(setSelectedExperience([...currentExperience, newExperience]));
        }
      }

      // Handle location filter  
      if (location.trim()) {
        const currentLocations = filters.selectedLocation || [];
        const newLocation = location.trim();
        
        if (!currentLocations.includes(newLocation)) {
          dispatch(setSelectedLocation([...currentLocations, newLocation]));
        }
      }
    }

    // Reset to first page when searching
    dispatch(setCurrentPage(1));

    // FIXED: Close the search modal/overlay
    setIsExpanded(false);
    setActiveDropdown(null);

    if (onSearch) {
      onSearch({ jobSearch, experience, location });
    }
  }, [
    searchValues, 
    dispatch, 
    navigate, 
    location.pathname, 
    onSearch, 
    filters.selectedExperience, 
    filters.selectedLocation, 
    filters.selectedCategory, 
    filters.selectedCompany,
    getRelatedFiltersFromSearch,
    categories,
    companies
  ]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
        setActiveDropdown(null);
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isExpanded]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRefs.overlay.current && !searchRefs.overlay.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle enter key in search
  const handleKeyDown = useCallback((e, type) => {
    if (e.key === 'Enter') {
      if (type === 'jobSearch' || (type === 'location' && !activeDropdown)) {
        handleSearch();
      }
    }
  }, [handleSearch, activeDropdown]);

  return (
    <>
      {/* Compact Search Button */}
      <div className="search-compact-btn" onClick={() => setIsExpanded(true)}>
        <i className="fas fa-search"></i>
      </div>

      {/* Search Overlay Modal */}
      {isExpanded && (
        <div className="search-overlay-modal">
          <div className="search-overlay-backdrop" onClick={() => setIsExpanded(false)} />
          
          <div ref={searchRefs.overlay} className="search-overlay-content">
            <div className="search-modal-header">
              <h3>Find your dream job</h3>
              <button 
                className="search-close-btn"
                onClick={() => setIsExpanded(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="search-form-container">
              {/* Job Search Input */}
              <div className="search-field-group">
                <div className="search-input-wrapper">
                  <i className="fas fa-search search-input-icon"></i>
                  <input
                    ref={searchRefs.jobSearch}
                    type="text"
                    placeholder="Enter skills / designations / companies"
                    value={searchValues.jobSearch}
                    onChange={(e) => handleInputChange('jobSearch', e.target.value)}
                    onFocus={() => handleDropdownFocus('jobSearch')}
                    onKeyDown={(e) => handleKeyDown(e, 'jobSearch')}
                    className="search-input"
                  />
                </div>
                
                {/* Job Search Suggestions */}
                {activeDropdown === 'jobSearch' && suggestions.jobSearch && suggestions.jobSearch.length > 0 && (
                  <div className="suggestions-dropdown">
                    {suggestions.jobSearch.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick('jobSearch', suggestion)}
                      >
                        <i className="fas fa-briefcase suggestion-icon"></i>
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="search-separator"></div>

              {/* Experience Dropdown */}
              <div className="search-field-group">
                <div className="search-input-wrapper">
                  <i className="fas fa-user-tie search-input-icon"></i>
                  <input
                    ref={searchRefs.experience}
                    type="text"
                    placeholder="Select experience"
                    value={searchValues.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    onFocus={() => handleDropdownFocus('experience')}
                    className="search-input"
                    readOnly
                  />
                  <i className="fas fa-chevron-down dropdown-arrow"></i>
                </div>
                
                {/* Experience Suggestions */}
                {activeDropdown === 'experience' && (
                  <div className="suggestions-dropdown">
                    {suggestions.experience.map((exp, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick('experience', exp.label || exp)}
                      >
                        <i className="fas fa-chart-line suggestion-icon"></i>
                        <span>{exp.label || exp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="search-separator"></div>

              {/* Location Input */}
              <div className="search-field-group">
                <div className="search-input-wrapper">
                  <i className="fas fa-map-marker-alt search-input-icon"></i>
                  <input
                    ref={searchRefs.location}
                    type="text"
                    placeholder="Enter location"
                    value={searchValues.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    onFocus={() => handleDropdownFocus('location')}
                    onKeyDown={(e) => handleKeyDown(e, 'location')}
                    className="search-input"
                  />
                </div>
                
                {/* Location Suggestions */}
                {activeDropdown === 'location' && suggestions.location.length > 0 && (
                  <div className="suggestions-dropdown">
                    {suggestions.location.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick('location', suggestion)}
                      >
                        <i className="fas fa-map-marker-alt suggestion-icon"></i>
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Button */}
              <button 
                className="search-submit-btn"
                onClick={handleSearch}
              >
                <i className="fas fa-search"></i>
                Search
              </button>
            </div>

            {/* Current filters display */}
            {(filters.searchQuery || (filters.selectedCategory && filters.selectedCategory.length > 0) || 
              (filters.selectedExperience && filters.selectedExperience.length > 0) || 
              (filters.selectedLocation && filters.selectedLocation.length > 0) ||
              (filters.selectedCompany && filters.selectedCompany.length > 0)) && (
              <div className="current-filters-display">
                <div className="current-filters-header">
                  <h4>Current Active Filters:</h4>
                </div>
                <div className="active-filters-list">
                  {filters.searchQuery && (
                    <span className="filter-tag search-tag">
                      <i className="fas fa-search"></i>
                      {filters.searchQuery}
                    </span>
                  )}
                  {filters.selectedCategory?.map(catId => {
                    const category = categories.find(c => c.id === catId);
                    return category ? (
                      <span key={catId} className="filter-tag category-tag">
                        <i className="fas fa-industry"></i>
                        {category.name}
                      </span>
                    ) : null;
                  })}
                  {filters.selectedExperience?.map(exp => (
                    <span key={exp} className="filter-tag experience-tag">
                      <i className="fas fa-user-tie"></i>
                      {exp}
                    </span>
                  ))}
                  {filters.selectedLocation?.map(loc => (
                    <span key={loc} className="filter-tag location-tag">
                      <i className="fas fa-map-marker-alt"></i>
                      {loc}
                    </span>
                  ))}
                  {filters.selectedCompany?.map(compId => {
                    const company = companies.find(c => c.id === compId);
                    return company ? (
                      <span key={compId} className="filter-tag company-tag">
                        <i className="fas fa-building"></i>
                        {company.name}
                      </span>
                    ) : null;
                  })}
                </div>
                <p className="filters-note">
                  <i className="fas fa-info-circle"></i>
                  Search terms will automatically add matching filters
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .search-compact-btn {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #000000ff;
          font-size: 16px;
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .search-compact-btn:hover {
          background: #000000ff;
          color: white;
          transform: scale(1.1);
          box-shadow: 0 4px 20px rgba(74, 144, 226, 0.3);
        }

        .search-overlay-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 10000;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 60px;
        }

        .search-overlay-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
        }

        .search-overlay-content {
          position: relative;
          width: 100%;
          max-width: 900px;
          margin: 0 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          animation: slideDown 0.3s ease-out;
          max-height: 90vh;
         
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .search-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 32px;
          border-bottom: 1px solid #e5e7eb;
        }

        .search-modal-header h3 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
        }

        .search-close-btn {
          background: none;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s ease;
        }

        .search-close-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .search-form-container {
          display: flex;
          align-items: stretch;
          padding: 32px;
          gap: 0;
        }

        .search-field-group {
          position: relative;
          flex: 1;
          min-width: 0;
        }

        .search-field-group:first-child {
          flex: 2;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          height: 56px;
        }

        .search-input {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          font-size: 16px;
          padding: 0 48px 0 48px;
          color: #374151;
          background: transparent;
        }

        .search-input::placeholder {
          color: #9ca3af;
          font-weight: 400;
        }

        .search-input:focus::placeholder {
          opacity: 0.7;
        }

        .search-input-icon {
          position: absolute;
          left: 16px;
          color: #6b7280;
          font-size: 16px;
          z-index: 1;
        }

        .dropdown-arrow {
          position: absolute;
          right: 16px;
          color: #6b7280;
          font-size: 12px;
          pointer-events: none;
        }

        .search-separator {
          width: 1px;
          background: #e5e7eb;
          margin: 8px 0;
          flex-shrink: 0;
        }

        .search-submit-btn {
          background: #000000ff;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0 32px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: 16px;
          flex-shrink: 0;
          min-width: 120px;
          justify-content: center;
        }

        .search-submit-btn:hover {
          background: #131313ff;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
        }

        .suggestions-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          max-height: 320px;
          
          z-index: 10001;
          margin-top: 4px;
        }

        .suggestion-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          transition: background-color 0.15s ease;
          border-bottom: 1px solid #f3f4f6;
        }

        .suggestion-item:last-child {
          border-bottom: none;
        }

        .suggestion-item:hover {
          background: #f8fafc;
        }

        .suggestion-icon {
          color: #6b7280;
          font-size: 14px;
          width: 16px;
          flex-shrink: 0;
        }

        .suggestion-item span {
          font-size: 14px;
          color: #374151;
        }

        /* Current Filters Display */
        .current-filters-display {
          padding: 20px 32px 32px 32px;
          border-top: 1px solid #e5e7eb;
          background: #f8f9fa;
        }

        .current-filters-header h4 {
          margin: 0 0 15px 0;
          font-size: 16px;
          font-weight: 600;
          color: #374151;
        }

        .active-filters-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 12px;
        }

        .filter-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #e5e7eb;
          color: #374151;
          border-radius: 16px;
          font-size: 13px;
          font-weight: 500;
        }

        .filter-tag i {
          font-size: 11px;
        }

        .search-tag {
          background: #dbeafe;
          color: #1e40af;
        }

        .category-tag {
          background: #fef3c7;
          color: #92400e;
        }

        .experience-tag {
          background: #d1fae5;
          color: #065f46;
        }

        .location-tag {
          background: #fecaca;
          color: #991b1b;
        }

        .company-tag {
          background: #e0e7ff;
          color: #3730a3;
        }

        .filters-note {
          margin: 0;
          font-size: 12px;
          color: #6b7280;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .filters-note i {
          font-size: 11px;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .search-overlay-content {
            margin: 0 10px;
            border-radius: 12px;
            max-height: 95vh;
          }

          .search-modal-header {
            padding: 20px 24px;
          }

          .search-modal-header h3 {
            font-size: 20px;
          }

          .search-form-container {
            flex-direction: column;
            padding: 24px;
            gap: 16px;
          }

          .search-field-group {
            flex: none;
          }

          .search-field-group:first-child {
            flex: none;
          }

          .search-separator {
            height: 1px;
            width: 100%;
            margin: 0;
          }

          .search-input {
            font-size: 16px;
            height: 48px;
          }

          .search-submit-btn {
            margin-left: 0;
            min-width: 100%;
            height: 48px;
          }

          .suggestions-dropdown {
            max-height: 240px;
          }

          .current-filters-display {
            padding: 16px 24px 24px 24px;
          }

          .active-filters-list {
            gap: 6px;
          }

          .filter-tag {
            font-size: 12px;
            padding: 4px 8px;
          }
        }

        /* Focus styles */
        .search-input-wrapper:focus-within {
          background: rgba(74, 144, 226, 0.05);
        }

        .search-input-wrapper:focus-within .search-input-icon {
          color: #000000ff;
        }

        /* Scrollbar styles */
        .suggestions-dropdown::-webkit-scrollbar,
        .search-overlay-content::-webkit-scrollbar {
          width: 6px;
        }

        .suggestions-dropdown::-webkit-scrollbar-track,
        .search-overlay-content::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        .suggestions-dropdown::-webkit-scrollbar-thumb,
        .search-overlay-content::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .suggestions-dropdown::-webkit-scrollbar-thumb:hover,
        .search-overlay-content::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
};

export default SmartSearchBar;