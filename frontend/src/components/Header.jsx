
// import { useState, useEffect, useRef } from "react";
// import "../styles/Header.css";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import { supabase } from "../supabaseClient";

// export default function Header({ user }) {
//   const [showMenu, setShowMenu] = useState(false);
//   const [isShrunk, setIsShrunk] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const userMenuRef = useRef(null); // ref for desktop user menu

//   // Determine if sticky should be disabled
//   const isJobsPage = location.pathname === "/jobs";

//   // Shrink header on scroll
//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollTop = window.scrollY || document.documentElement.scrollTop;
//       setIsShrunk(scrollTop > 0);
//     };

//     window.addEventListener("scroll", handleScroll);
//     handleScroll();

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Load Font Awesome
//   useEffect(() => {
//     const link = document.createElement("link");
//     link.rel = "stylesheet";
//     link.href =
//       "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
//     document.head.appendChild(link);

//     return () => {
//       document.head.removeChild(link);
//     };
//   }, []);

//   // Close mobile menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         isMobileMenuOpen &&
//         !event.target.closest(".mobile-menu") &&
//         !event.target.closest(".hamburger")
//       ) {
//         setIsMobileMenuOpen(false);
//       }
//     };

//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, [isMobileMenuOpen]);

//   // Close desktop user menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         showMenu &&
//         userMenuRef.current &&
//         !userMenuRef.current.contains(event.target)
//       ) {
//         setShowMenu(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [showMenu]);

//   const handleSignOut = async () => {
//     await supabase.auth.signOut();
//     setShowMenu(false);
//     setIsMobileMenuOpen(false);
//   };

//   const handleNavigation = (path) => {
//     navigate(path);
//     setIsMobileMenuOpen(false);
//   };

//   return (
//     <header
//       className={`${!isJobsPage ? "sticky" : "non-sticky"} ${
//         isShrunk ? "shrink" : ""
//       }`}
//     >
//       <div className="header-container">
//         <div className="logo">
//           <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
//             <h3>
//               HIRE<span>PATH</span>
//             </h3>
//           </Link>
//         </div>

//         {/* Desktop Navigation */}
//         <div className="header-options desktop-nav">
//           <a href="/">Home</a>
//           <a href="/jobs">Jobs</a>
//           <a href="/about">About</a>
//           <a href="/contact">Contact Us</a>
//         </div>

//         {/* Desktop User Account */}
//         <div className="accounts-btn desktop-account" ref={userMenuRef}>
//           {user ? (
//             <div className="user-info">
//               <div
//                 className="user-avatar"
//                 onClick={() => setShowMenu(!showMenu)}
//               >
//                 {user.email.charAt(0).toUpperCase()}
//               </div>
//               {showMenu && (
//                 <div className="user-menu">
//                   <button onClick={() => navigate("/dashboard")}>
//                     Dashboard
//                   </button>
//                   <button onClick={handleSignOut}>Sign Out</button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <button onClick={() => navigate("/auth")}>Sign In / Sign Up</button>
//           )}
//         </div>

//         {/* Hamburger Menu Button */}
//         <div
//           className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}
//           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//         >
//           <span></span>
//           <span></span>
//           <span></span>
//         </div>
//       </div>

//       {/* Mobile Menu Overlay */}
//       <div
//         className={`mobile-menu-overlay ${isMobileMenuOpen ? "active" : ""}`}
//       >
//         <div className="mobile-menu">
//           <div className="mobile-menu-header">
//             <div className="mobile-logo">
//               <h3>
//                 JOBS<span>FINDER</span>
//               </h3>
//             </div>
//             <div className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>
//               <i className="fas fa-times"></i>
//             </div>
//           </div>

//           <div className="mobile-nav-links">
//             <a href="/" onClick={() => setIsMobileMenuOpen(false)}>
//               <span className="nav-icon">
//                 <i className="fas fa-home"></i>
//               </span>
//               <span className="nav-text">Home</span>
//             </a>
//             <a href="/jobs" onClick={() => setIsMobileMenuOpen(false)}>
//               <span className="nav-icon">
//                 <i className="fas fa-briefcase"></i>
//               </span>
//               <span className="nav-text">Jobs</span>
//             </a>
//             <a href="/about" onClick={() => setIsMobileMenuOpen(false)}>
//               <span className="nav-icon">
//                 <i className="fas fa-info-circle"></i>
//               </span>
//               <span className="nav-text">About</span>
//             </a>
//             <a href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
//               <span className="nav-icon">
//                 <i className="fas fa-envelope"></i>
//               </span>
//               <span className="nav-text">Contact Us</span>
//             </a>
//           </div>

//           <div className="mobile-account">
//             {user ? (
//               <div className="mobile-user-info">
//                 <div className="mobile-user-avatar">
//                   {user.email.charAt(0).toUpperCase()}
//                 </div>
//                 <div className="user-email">{user.email}</div>
//                 <div className="mobile-user-actions">
//                   <button onClick={() => handleNavigation("/dashboard")}>
//                     <i className="fas fa-tachometer-alt"></i>
//                     <span>Dashboard</span>
//                   </button>
//                   <button onClick={handleSignOut}>
//                     <i className="fas fa-sign-out-alt"></i>
//                     <span>Sign Out</span>
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <button
//                 className="auth-btn"
//                 onClick={() => handleNavigation("/auth")}
//               >
//                 <i className="fas fa-user-lock"></i>
//                 <span>Sign In / Sign Up</span>
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }
import { useState, useEffect, useRef } from "react";
import "../styles/Header.css";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { supabase } from "../supabaseClient";
import { 
  setSearchQuery, 
  setSelectedExperience, 
  setSelectedLocation 
} from '../redux/store';

// Add this HeaderSearchBar component inside your Header.jsx file
const HeaderSearchBar = ({ onSearch }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { filters } = useSelector((state) => state.jobs);
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    searchInput: '',
    experienceInput: '',
    locationInput: ''
  });

  const experienceOptions = ['Fresher', 'Mid-level', 'Senior', '1 yr', '2 yrs', '3 yrs', '4 yrs', '5 yrs'];

  // Sync local filters with Redux filters
  useEffect(() => {
    setLocalFilters({
      searchInput: filters.searchQuery || '',
      experienceInput: filters.selectedExperience?.[0] || '',
      locationInput: filters.selectedLocation?.[0] || ''
    });
  }, [filters]);

  useEffect(() => {
    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
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

  const handleSearch = () => {
    // Navigate to jobs page if not already there
    if (location.pathname !== '/jobs') {
      navigate('/jobs');
    }

    // Dispatch the same actions as JobList
    if (localFilters.searchInput.trim()) {
      dispatch(setSearchQuery(localFilters.searchInput.trim()));
    }

    if (localFilters.experienceInput) {
      dispatch(setSelectedExperience([localFilters.experienceInput]));
    }

    if (localFilters.locationInput.trim()) {
      dispatch(setSelectedLocation([localFilters.locationInput.trim()]));
    }

    // Call parent callback if provided
    if (onSearch) {
      onSearch({
        query: localFilters.searchInput,
        experience: localFilters.experienceInput,
        location: localFilters.locationInput
      });
    }

    setIsExpanded(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Get display text for compact search bar
  const getDisplayText = () => {
    if (localFilters.searchInput) {
      return localFilters.searchInput;
    }
    return 'Search jobs, skills, companies...';
  };

  return (
    <>
      {/* Compact search bar in header */}
      <div className="header-search-compact" onClick={() => setIsExpanded(true)}>
        <i className="fa fa-search search-icon"></i>
        <span className="search-placeholder">
          {getDisplayText()}
        </span>
      </div>

      {/* Expanded search overlay */}
      <div className={`search-overlay ${isExpanded ? 'active' : ''}`} onClick={() => setIsExpanded(false)}>
        <div className="search-overlay-content" onClick={(e) => e.stopPropagation()}>
          <button className="search-close-btn" onClick={() => setIsExpanded(false)}>
            <i className="fa fa-times"></i>
          </button>
          
          <div className="search-bar">
            <div className="search-field">
              <span className="icon"><i className="fa fa-search"></i></span>
              <input
                type="text"
                placeholder="Enter skills / designations / companies"
                value={localFilters.searchInput}
                onChange={(e) => setLocalFilters(prev => ({ 
                  ...prev, 
                  searchInput: e.target.value 
                }))}
                onKeyPress={handleKeyPress}
                autoFocus
              />
            </div>
            <div className="divider" />
            <select
              className="experience-dropdown"
              value={localFilters.experienceInput}
              onChange={(e) => setLocalFilters(prev => ({ 
                ...prev, 
                experienceInput: e.target.value 
              }))}
            >
              <option value="">Select experience</option>
              {experienceOptions.map((exp) => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
            <div className="divider" />
            <input
              type="text"
              className="location-input"
              placeholder="Enter location"
              value={localFilters.locationInput}
              onChange={(e) => setLocalFilters(prev => ({ 
                ...prev, 
                locationInput: e.target.value 
              }))}
              onKeyPress={handleKeyPress}
            />
            <button className="search-btn" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default function Header({ user }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userMenuRef = useRef(null);

  // Determine if this is jobs page
  const isJobsPage = location.pathname === "/jobs";

  // Handle search from header - this will be called after Redux actions are dispatched
  const handleHeaderSearch = ({ query, experience, location }) => {
    console.log('Header search completed:', { query, experience, location });
    // Additional logic can go here if needed
  };

  // Shrink header on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsShrunk(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load Font Awesome
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        !event.target.closest(".mobile-menu") &&
        !event.target.closest(".hamburger")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Close desktop user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showMenu &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowMenu(false);
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`${!isJobsPage ? "sticky" : "non-sticky"} ${
        isShrunk ? "shrink" : ""
      } ${isJobsPage ? "jobs-page" : ""}`}
    >
      <div className="header-container">
        <div className="logo">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <h3>
              HIRE<span>PATH</span>
            </h3>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="header-options desktop-nav">
          <a href="/">Home</a>
          <a href="/jobs">Jobs</a>
          <a href="/about">About</a>
          <a href="/contact">Contact Us</a>
        </div>

        {/* Header Search Bar - only show on jobs page */}
        {isJobsPage && (
          <HeaderSearchBar onSearch={handleHeaderSearch} />
        )}

        {/* Desktop User Account */}
        <div className="accounts-btn desktop-account" ref={userMenuRef}>
          {user ? (
            <div className="user-info">
              <div
                className="user-avatar"
                onClick={() => setShowMenu(!showMenu)}
              >
                {user.email.charAt(0).toUpperCase()}
              </div>
              {showMenu && (
                <div className="user-menu">
                  <button onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </button>
                  <button onClick={handleSignOut}>Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => navigate("/auth")}>Sign In / Sign Up</button>
          )}
        </div>

        {/* Hamburger Menu Button */}
        <div
          className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
     <div
        className={`mobile-menu-overlay ${isMobileMenuOpen ? "active" : ""}`}
      >
        <div className="mobile-menu">
          <div className="mobile-menu-header">
            <div className="mobile-logo">
              <h3>
                HIRE<span>PATH</span>
              </h3>
            </div>
            <div className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>
              <i className="fas fa-times"></i>
            </div>
          </div>

          <div className="mobile-nav-links">
            <a href="/" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="nav-icon">
                <i className="fas fa-home"></i>
              </span>
              <span className="nav-text">Home</span>
            </a>
            <a href="/jobs" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="nav-icon">
                <i className="fas fa-briefcase"></i>
              </span>
              <span className="nav-text">Jobs</span>
            </a>
            <a href="/about" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="nav-icon">
                <i className="fas fa-info-circle"></i>
              </span>
              <span className="nav-text">About</span>
            </a>
            <a href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="nav-icon">
                <i className="fas fa-envelope"></i>
              </span>
              <span className="nav-text">Contact Us</span>
            </a>
          </div>

          <div className="mobile-account">
            {user ? (
              <div className="mobile-user-info">
                <div className="mobile-user-avatar">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div className="user-email">{user.email}</div>
                <div className="mobile-user-actions">
                  <button onClick={() => handleNavigation("/dashboard")}>
                    <i className="fas fa-tachometer-alt"></i>
                    <span>Dashboard</span>
                  </button>
                  <button onClick={handleSignOut}>
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="auth-btn"
                onClick={() => handleNavigation("/auth")}
              >
                <i className="fas fa-user-lock"></i>
                <span>Sign In / Sign Up</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
