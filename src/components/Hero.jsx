import React from "react";
import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-heading">
        <h1>Find your dream job now</h1>
        <p>5 lakh+ jobs for you to explore</p>
      </div>
      <div className="search-bar">
        <div className="search-field">
          <span className="icon"></span>
          <input type="text" placeholder="Enter skills / designations / companies" />
        </div>
        <div className="divider" />
        <select className="experience-dropdown">
          <option>Select experience</option>
          <option>Fresher</option>
          <option>1-3 years</option>
          <option>4-6 years</option>
          <option>7+ years</option>
        </select>
        <div className="divider" />
        <input type="text" className="location-input" placeholder="Enter location" />
        <button className="search-btn">Search</button>
      </div>
    </section>
  );
}

export default Hero;
