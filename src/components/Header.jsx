// import React from "react";
// import "../styles/Header.css";

// function Header() {
//   return (
//     <header className="header">
//       <div className="header-container">
//         <div className="logo">JobFinder</div>
//         {/* <input type="text" placeholder="Search jobs" className="search-box" /> */}
//         <div className="search-login">
//           <input type="text" placeholder="Search jobs" className="search-box" />
//           <button className="btn login">Login</button>
//           <button className="btn register">Register</button>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;
 import "../styles/Header.css"

export default function Header(){
    return (
        <header>
            <div className="header-container">
                <div className="logo"><h3>JOBS FINDER</h3></div>
                <div className="header-options">
                    <a href="">Home</a>
                    <a href="">About</a>
                    <a href="">Jobs</a>
                    <a href="">Candidates</a>
                    <a href="">Contact Us</a>
                </div>
                <div className="accounts-btn">
                    <button>Sign Up</button>
                    <button>Sign In</button>
                </div>
            </div>
        </header>
    )
}