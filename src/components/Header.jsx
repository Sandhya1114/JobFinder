// // import React from "react";
// // import "../styles/Header.css";

// // function Header() {
// //   return (
// //     <header className="header">
// //       <div className="header-container">
// //         <div className="logo">JobFinder</div>
// //         {/* <input type="text" placeholder="Search jobs" className="search-box" /> */}
// //         <div className="search-login">
// //           <input type="text" placeholder="Search jobs" className="search-box" />
// //           <button className="btn login">Login</button>
// //           <button className="btn register">Register</button>
// //         </div>
// //       </div>
// //     </header>
// //   );
// // }

// // export default Header;
//  import "../styles/Header.css"

// export default function Header(){
//     return (
//         <header>
//             <div className="header-container">
//                 <div className="logo"><h3>JOBS FINDER</h3></div>
//                 <div className="header-options">
//                     <a href="">Home</a>
//                     <a href="">About</a>
//                     <a href="">Jobs</a>
//                     <a href="">Candidates</a>
//                     <a href="">Contact Us</a>
//                 </div>
//                 <div className="accounts-btn">
//                     <button>Sign Up</button>
//                     <button>Sign In</button>
//                 </div>
//             </div>
//         </header>
//     )
// }
// src/components/Header.jsx
// import { useState } from "react";
// import "../styles/Header.css";
// import { supabase } from "../supabaseClient";
// import AuthForm from "./AuthForm";
// import { useNavigate } from "react-router-dom";

// export default function Header({ user }) {
//   const [showAuthForm, setShowAuthForm] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);
//   const navigate = useNavigate();

//   const handleSignOut = async () => {
//     await supabase.auth.signOut();
//     setShowMenu(false);
//   };

//   const handleDashboard = () => {
//     navigate("/dashboard");
//     setShowMenu(false);
//   };

//   const toggleMenu = () => {
//     setShowMenu((prev) => !prev);
//   };

//   return (
//     <header>
//       <div className="header-container">
//         <div className="logo">
//           <h3>JOBS FINDER</h3>
//         </div>

//         <div className="header-options">
//           <a href="/">Home</a>
//           <a href="/about">About</a>
//           <a href="/jobs">Jobs</a>
//           <a href="/candidates">Candidates</a>
//           <a href="/contact">Contact Us</a>
//         </div>

//         <div className="accounts-btn">
//           {user ? (
//             <div className="user-info">
//               <div className="user-avatar" onClick={toggleMenu}>
//                 {user.email.charAt(0).toUpperCase()}
//               </div>
//               {showMenu && (
//                 <div className="user-menu">
//                   <button onClick={handleDashboard}>Dashboard</button>
//                   <button onClick={handleSignOut}>Sign Out</button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <button onClick={() => setShowAuthForm(true)}>Sign In / Sign Up</button>
//           )}
//         </div>
//       </div>

//       {showAuthForm && !user && (
//         <div className="auth-form-container">
//           <AuthForm onAuthSuccess={() => setShowAuthForm(false)} />
//         </div>
//       )}
//     </header>
//   );
// }
import { useState } from "react";
import "../styles/Header.css";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Header({ user }) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowMenu(false);
  };

  const handleDashboard = () => {
    navigate("/dashboard");
    setShowMenu(false);
  };

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  return (
    <header>
      <div className="header-container">
        <div className="logo">
          <h3>JOBS FINDER</h3>
        </div>

        <div className="header-options">
          <a href="/">Home</a>
          <a href="/footer">About</a>
          <a href="/jobs">Jobs</a>
          <a href="/candidates">Candidates</a>
          <a href="/footer">Contact Us</a>
        </div>

        <div className="accounts-btn">
          {user ? (
            <div className="user-info">
              <div className="user-avatar" onClick={toggleMenu}>
                {user.email.charAt(0).toUpperCase()}
              </div>
              {showMenu && (
                <div className="user-menu">
                  <button onClick={handleDashboard}>Dashboard</button>
                  <button onClick={handleSignOut}>Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => navigate("/auth")}>Sign In / Sign Up</button>
          )}
        </div>
      </div>
    </header>
  );
}
