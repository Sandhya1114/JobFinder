import React from "react";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-logo-section">
          <h2 className="footer-logo">JobFinder</h2>
        </div>
        <div className="footer-links">
          <div>
            <h4>JobFinder</h4>
            <ul>
              <li>About / Press</li>
              <li>Blog</li>
              <li>Contact Us</li>
              <li>Grievance Officer – India</li>
            </ul>
          </div>
          <div>
            <h4>Employers</h4>
            <ul>
              <li>Get a FREE Employer Account</li>
              <li>Employer Centre</li>
            </ul>
          </div>
          <div>
            <h4>Information</h4>
            <ul>
              <li>Help</li>
              <li>Guidelines</li>
              <li>Terms of Use</li>
              <li>Privacy and Ad Choices</li>
              <li>Do Not Sell Or Share My Information</li>
              <li>Cookie Consent Tool</li>
            </ul>
          </div>
          <div>
            <h4>Work With Us</h4>
            <ul>
              <li>Advertisers</li>
              <li>Careers</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-middle">
        <div className="app-links">
          <span>Download the App</span>
          
           <a href="#" class="fa fa-android"></a>
          <img src="https://cdn-icons-png.flaticon.com/512/888/888841.png" alt="ios" />
        </div>
        <div className="social-icons">
         <a href="#" class="fa fa-linkedin"></a>
        <a href="#" class="fa fa-pinterest"></a>
        <a href="#" class="fa fa-reddit"></a>
         <a href="#" class="fa fa-youtube"></a>
          <a href="#" class="fa fa-twitter"></a>
           <a href="#" class="fa fa-instagram"></a>
          
        </div>
        <div className="country-select">
          <select>
            <option>India</option>
            <option>USA</option>
            <option>UK</option>
          </select>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          Browse by: <strong>Companies, Jobs, Locations, Communities, Recent posts</strong>
        </p>
        <p className="copyright">
            © {new Date().getFullYear()}  All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
