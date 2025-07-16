import React from "react";
import "../styles/Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">JobFinder</div>
        <input type="text" placeholder="Search jobs" className="search-box" />
        <div className="search-login">
          {/* <input type="text" placeholder="Search jobs" className="search-box" /> */}
          <button className="btn login">Login</button>
          <button className="btn register">Register</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
