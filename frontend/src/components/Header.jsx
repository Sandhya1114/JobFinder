// import { useState, useEffect, useRef } from "react";
// import "../styles/Header.css";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import { useSelector } from 'react-redux';
// import { supabase } from "../supabaseClient";
// import SmartSearchBar from './SmartJobSearchBar'; // Import the SmartSearchBar

// export default function Header({ user }) {
//   const [showMenu, setShowMenu] = useState(false);
//   const [isShrunk, setIsShrunk] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const userMenuRef = useRef(null);

//   // Determine if this is jobs page
//   const isJobsPage = location.pathname === "/jobs";

//   // Function to check if a path is active
//   const isActiveLink = (path) => {
//     if (path === "/" && location.pathname === "/") return true;
//     if (path !== "/" && location.pathname.startsWith(path)) return true;
//     return false;
//   };

//   // Handle search from SmartSearchBar
//   const handleSmartSearch = ({ query, type }) => {
//     console.log('Smart search completed:', { query, type });
//     // The SmartSearchBar already handles navigation and Redux updates
//   };

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
//       } ${isJobsPage ? "jobs-page" : ""}`}
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
//           <div className="nav-links">
//             <Link 
//               to="/" 
//               className={isActiveLink("/") ? "active" : ""}
//             >
//               Home
//             </Link>
//             <Link 
//               to="/jobs" 
//               className={isActiveLink("/jobs") ? "active" : ""}
//             >
//               Jobs
//             </Link>
//             <Link 
//               to="/about" 
//               className={isActiveLink("/about") ? "active" : ""}
//             >
//               About
//             </Link>
//             <Link 
//               to="/contact" 
//               className={isActiveLink("/contact") ? "active" : ""}
//             >
//               Contact Us
//             </Link>
//           </div>
          
//           {/* Smart Search Bar - only show on jobs page */}
//           {isJobsPage && (
//             <div className="header-smart-search">
//               <SmartSearchBar onSearch={handleSmartSearch} />
//             </div>
//           )}
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
//                 HIRE<span>PATH</span>
//               </h3>
//             </div>
//             <div className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>
//               <i className="fas fa-times"></i>
//             </div>
//           </div>

//           {/* Mobile Smart Search - show on jobs page */}
//           {isJobsPage && (
//             <div className="mobile-smart-search">
//               <SmartSearchBar onSearch={handleSmartSearch} />
//             </div>
//           )}

//           <div className="mobile-nav-links">
//             <Link 
//               to="/" 
//               onClick={() => setIsMobileMenuOpen(false)}
//               className={isActiveLink("/") ? "active" : ""}
//             >
//               <span className="nav-icon">
//                 <i className="fas fa-home"></i>
//               </span>
//               <span className="nav-text">Home</span>
//             </Link>
//             <Link 
//               to="/jobs" 
//               onClick={() => setIsMobileMenuOpen(false)}
//               className={isActiveLink("/jobs") ? "active" : ""}
//             >
//               <span className="nav-icon">
//                 <i className="fas fa-briefcase"></i>
//               </span>
//               <span className="nav-text">Jobs</span>
//             </Link>
//             <Link 
//               to="/about" 
//               onClick={() => setIsMobileMenuOpen(false)}
//               className={isActiveLink("/about") ? "active" : ""}
//             >
//               <span className="nav-icon">
//                 <i className="fas fa-info-circle"></i>
//               </span>
//               <span className="nav-text">About</span>
//             </Link>
//             <Link 
//               to="/contact" 
//               onClick={() => setIsMobileMenuOpen(false)}
//               className={isActiveLink("/contact") ? "active" : ""}
//             >
//               <span className="nav-icon">
//                 <i className="fas fa-envelope"></i>
//               </span>
//               <span className="nav-text">Contact Us</span>
//             </Link>
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
// import { useState, useEffect, useRef } from "react";
// import "../styles/Header.css";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import { useSelector } from 'react-redux';
// import { supabase } from "../supabaseClient";
// import SmartSearchBar from './SmartJobSearchBar'; // Import the SmartSearchBar

// export default function Header({ user }) {
//   const [showMenu, setShowMenu] = useState(false);
//   const [isShrunk, setIsShrunk] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const userMenuRef = useRef(null);

//   // Determine if this is jobs page
//   const isJobsPage = location.pathname === "/jobs";

//   // Function to check if a path is active
//   const isActiveLink = (path) => {
//     if (path === "/" && location.pathname === "/") return true;
//     if (path !== "/" && location.pathname.startsWith(path)) return true;
//     return false;
//   };

//   // Handle search from SmartSearchBar
//   const handleSmartSearch = ({ query, type }) => {
//     console.log('Smart search completed:', { query, type });
//     // The SmartSearchBar already handles navigation and Redux updates
//   };

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
//       } ${isJobsPage ? "jobs-page" : ""}`}
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
//           <div className="nav-links">
//             <Link 
//               to="/" 
//               className={isActiveLink("/") ? "active" : ""}
//             >
//               Home
//             </Link>
//             <Link 
//               to="/jobs" 
//               className={isActiveLink("/jobs") ? "active" : ""}
//             >
//               Jobs
//             </Link>
//             <Link 
//               to="/about" 
//               className={isActiveLink("/about") ? "active" : ""}
//             >
//               About
//             </Link>
//             <Link 
//               to="/contact" 
//               className={isActiveLink("/contact") ? "active" : ""}
//             >
//               Contact Us
//             </Link>
//           </div>
          
//           {/* Smart Search Bar - only show on jobs page */}
//           {isJobsPage && (
//             <div className="header-smart-search">
//               <SmartSearchBar onSearch={handleSmartSearch} />
//             </div>
//           )}
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
//                 HIRE<span>PATH</span>
//               </h3>
//             </div>
//             <div className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>
//               <i className="fas fa-times"></i>
//             </div>
//           </div>

//           {/* Mobile Smart Search - show on jobs page */}
//           {isJobsPage && (
//             <div className="mobile-smart-search">
//               <SmartSearchBar onSearch={handleSmartSearch} />
//             </div>
//           )}

//           <div className="mobile-nav-links">
//             <Link 
//               to="/" 
//               onClick={() => setIsMobileMenuOpen(false)}
//               className={isActiveLink("/") ? "active" : ""}
//             >
//               <span className="nav-icon">
//                 <i className="fas fa-home"></i>
//               </span>
//               <span className="nav-text">Home</span>
//             </Link>
//             <Link 
//               to="/jobs" 
//               onClick={() => setIsMobileMenuOpen(false)}
//               className={isActiveLink("/jobs") ? "active" : ""}
//             >
//               <span className="nav-icon">
//                 <i className="fas fa-briefcase"></i>
//               </span>
//               <span className="nav-text">Jobs</span>
//             </Link>
//             <Link 
//               to="/about" 
//               onClick={() => setIsMobileMenuOpen(false)}
//               className={isActiveLink("/about") ? "active" : ""}
//             >
//               <span className="nav-icon">
//                 <i className="fas fa-info-circle"></i>
//               </span>
//               <span className="nav-text">About</span>
//             </Link>
//             <Link 
//               to="/contact" 
//               onClick={() => setIsMobileMenuOpen(false)}
//               className={isActiveLink("/contact") ? "active" : ""}
//             >
//               <span className="nav-icon">
//                 <i className="fas fa-envelope"></i>
//               </span>
//               <span className="nav-text">Contact Us</span>
//             </Link>
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
import SmartSearchBar from './SmartJobSearchBar'; // Import our new smart search bar

export default function Header({ user }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userMenuRef = useRef(null);

  // Determine if this is jobs page
  const isJobsPage = location.pathname === "/jobs";

  // Function to check if a path is active
  const isActiveLink = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Handle search from header
  const handleHeaderSearch = (searchData) => {
    console.log('Header search completed:', searchData);
    // Optional: Add analytics or additional logic here
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
      // Only remove if it exists to avoid errors
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
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
    try {
      await supabase.auth.signOut();
      setShowMenu(false);
      setIsMobileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
          <div className="nav-links">
            <Link 
              to="/" 
              className={isActiveLink("/") ? "active" : ""}
            >
              Home
            </Link>
            <Link 
              to="/jobs" 
              className={isActiveLink("/jobs") ? "active" : ""}
            >
              Jobs
            </Link>
            <Link 
              to="/about" 
              className={isActiveLink("/about") ? "active" : ""}
            >
              About
            </Link>
            <Link 
             to="/score"
             className={isActiveLink("/score") ? "active" : ""}
            >ATS</Link>
            <Link 
              to="/contact" 
              className={isActiveLink("/contact") ? "active" : ""}
            >
              Contact Us
            </Link>
          </div>
          
          {/* Smart Search Bar - only show on jobs page */}
          {isJobsPage && (
            <SmartSearchBar onSearch={handleHeaderSearch} />
          )}
        </div>

        {/* Desktop User Account */}
        <div className="accounts-btn desktop-account" ref={userMenuRef}>
          {user ? (
            <div className="user-info">
              <div
                className="user-avatar"
                onClick={() => setShowMenu(!showMenu)}
                title={user.email}
              >
                {user.email.charAt(0).toUpperCase()}
              </div>
              {showMenu && (
                <div className="user-menu">
                  <div className="user-menu-header">
                    <div className="user-email">{user.email}</div>
                  </div>
                  <button 
                    onClick={() => {
                      navigate("/dashboard");
                      setShowMenu(false);
                    }}
                  >
                    <i className="fas fa-tachometer-alt"></i>
                    Dashboard
                  </button>
                  <button onClick={handleSignOut}>
                    <i className="fas fa-sign-out-alt"></i>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => navigate("/auth")}
              className="auth-button"
            >
              Sign In / Sign Up
            </button>
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

          {/* Mobile Search Bar */}
          {isJobsPage && (
            <div className="mobile-search-section">
              <SmartSearchBar onSearch={handleHeaderSearch} />
            </div>
          )}

          <div className="mobile-nav-links">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={isActiveLink("/") ? "active" : ""}
            >
              <span className="nav-icon">
                <i className="fas fa-home"></i>
              </span>
              <span className="nav-text">Home</span>
            </Link>
            <Link 
              to="/jobs" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={isActiveLink("/jobs") ? "active" : ""}
            >
              <span className="nav-icon">
                <i className="fas fa-briefcase"></i>
              </span>
              <span className="nav-text">Jobs</span>
            </Link>
            <Link 
              to="/about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={isActiveLink("/about") ? "active" : ""}
            >
              <span className="nav-icon">
                <i className="fas fa-info-circle"></i>
              </span>
              <span className="nav-text">About</span>
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={isActiveLink("/contact") ? "active" : ""}
            >
              <span className="nav-icon">
                <i className="fas fa-envelope"></i>
              </span>
              <span className="nav-text">Contact Us</span>
            </Link>
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