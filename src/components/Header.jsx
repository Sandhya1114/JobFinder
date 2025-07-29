import { useState, useEffect } from "react";
import "../styles/Header.css";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Header({ user }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsShrunk(scrollTop > 0); // shrink if NOT at top
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial check on load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={isShrunk ? "shrink" : ""}>
      <div className="header-container">
        <div className="logo">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <h3>
            JOBS<span>FINDER</span>
          </h3>
          </Link>
        </div>

        <div className="header-options">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/jobs">Jobs</a>
          <a href="/footer">Candidates</a>
          <a href="/contact">Contact Us</a>
        </div>

        <div className="accounts-btn">
          {user ? (
            <div className="user-info">
              <div className="user-avatar" onClick={() => setShowMenu(!showMenu)}>
                {user.email.charAt(0).toUpperCase()}
              </div>
              {showMenu && (
                <div className="user-menu">
                  <button onClick={() => navigate("/dashboard")}>Dashboard</button>
                  <button onClick={async () => {
                    await supabase.auth.signOut();
                    setShowMenu(false);
                  }}>
                    Sign Out
                  </button>
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

