
// src/components/AuthForm.jsx
import { useState } from "react";
import { supabase } from "../supabaseClient";
import "../styles//AuthForm.css"; // Import the CSS file

export default function AuthForm({ onAuthSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const { user, error } = isSignUp
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setError(error.message);
      } else {
        onAuthSuccess?.();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err); // Log the error for debugging
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h3>{isSignUp ? "Sign Up" : "Sign In"}</h3>
      <input
        type="email"
        placeholder="Email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>
      <p
        onClick={() => setIsSignUp(!isSignUp)}
        style={{ cursor: "pointer", color: "#2d3033ff" }}
      >
        {isSignUp
          ? "Already have an account? Sign in"
          : "Don't have an account? Sign up"}
      </p>
    </form>
  );
}
