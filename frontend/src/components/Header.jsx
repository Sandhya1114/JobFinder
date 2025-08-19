
// import { useState, useEffect } from "react";
// import "../styles/Header.css";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import { supabase } from "../SupabaseClient";

// export default function Header({ user }) {
//   const [showMenu, setShowMenu] = useState(false);
//   const [isShrunk, setIsShrunk] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Determine if sticky should be disabled
//   const isJobsPage = location.pathname === "/jobs";

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollTop = window.scrollY || document.documentElement.scrollTop;
//       setIsShrunk(scrollTop > 0);
//     };

//     window.addEventListener("scroll", handleScroll);
//     handleScroll();

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <header className={`${!isJobsPage ? "sticky" : "non-sticky"} ${isShrunk ? "shrink" : ""}`}>
//       <div className="header-container">
//         <div className="logo">
//           <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
//             <h3>
//               JOBS<span>FINDER</span>
//             </h3>
//           </Link>
//         </div>

//         <div className="header-options">
//           <a href="/">Home</a>
//           <a href="/jobs">Jobs</a>
//           <a href="/about">About</a>
//           <a href="/contact">Contact Us</a>
//         </div>

//         <div className="accounts-btn">
//           {user ? (
//             <div className="user-info">
//               <div className="user-avatar" onClick={() => setShowMenu(!showMenu)}>
//                 {user.email.charAt(0).toUpperCase()}
//               </div>
//               {showMenu && (
//                 <div className="user-menu">
//                   <button onClick={() => navigate("/dashboard")}>Dashboard</button>
//                   <button
//                     onClick={async () => {
//                       await supabase.auth.signOut();
//                       setShowMenu(false);
//                     }}
//                   >
//                     Sign Out
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <button onClick={() => navigate("/auth")}>Sign In / Sign Up</button>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }
// import { useState, useEffect } from "react";
// import "../styles/Header.css";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import { supabase } from "../supabaseClient";


// export default function Header({ user }) {
//   const [showMenu, setShowMenu] = useState(false);
//   const [isShrunk, setIsShrunk] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Determine if sticky should be disabled
//   const isJobsPage = location.pathname === "/jobs";

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
//     const link = document.createElement('link');
//     link.rel = 'stylesheet';
//     link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
//     document.head.appendChild(link);

//     return () => {
//       document.head.removeChild(link);
//     };
//   }, []);

//   // Close mobile menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (isMobileMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.hamburger')) {
//         setIsMobileMenuOpen(false);
//       }
//     };

//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, [isMobileMenuOpen]);

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
//     <header className={`${!isJobsPage ? "sticky" : "non-sticky"} ${isShrunk ? "shrink" : ""}`}>
//       <div className="header-container">
//         <div className="logo">
//           <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
//             <h3>
//               JOBS<span>FINDER</span>
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
//         <div className="accounts-btn desktop-account">
//           {user ? (
//             <div className="user-info">
//               <div className="user-avatar" onClick={() => setShowMenu(!showMenu)}>
//                 {user.email.charAt(0).toUpperCase()}
//               </div>
//               {showMenu && (
//                 <div className="user-menu">
//                   <button onClick={() => navigate("/dashboard")}>Dashboard</button>
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
//           className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
//           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//         >
//           <span></span>
//           <span></span>
//           <span></span>
//         </div>
//       </div>

//       {/* Mobile Menu Overlay */}
//       <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
//         <div className="mobile-menu">
//           <div className="mobile-menu-header">
//             <div className="mobile-logo">
//               <h3>JOBS<span>FINDER</span></h3>
//             </div>
//             <div 
//               className="close-btn"
//               onClick={() => setIsMobileMenuOpen(false)}
//             >
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
//               <button className="auth-btn" onClick={() => handleNavigation("/auth")}>
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
import { supabase } from "../supabaseClient";

export default function Header({ user }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userMenuRef = useRef(null); // ref for desktop user menu

  // Determine if sticky should be disabled
  const isJobsPage = location.pathname === "/jobs";

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
      }`}
    >
      <div className="header-container">
        <div className="logo">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <h3>
              JOBS<span>FINDER</span>
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
                JOBS<span>FINDER</span>
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
