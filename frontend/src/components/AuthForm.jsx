
// // // // src/components/AuthForm.jsx
// // // import { useState } from "react";
// // // import { supabase } from "../supabaseClient";
// // // import "../styles//AuthForm.css"; // Import the CSS file

// // // export default function AuthForm({ onAuthSuccess }) {
// // //   const [email, setEmail] = useState("");
// // //   const [password, setPassword] = useState("");
// // //   const [isSignUp, setIsSignUp] = useState(false);
// // //   const [error, setError] = useState(null);

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setError(null);

// // //     if (!email || !password) {
// // //       setError("Email and password are required.");
// // //       return;
// // //     }

// // //     try {
// // //       const { user, error } = isSignUp
// // //         ? await supabase.auth.signUp({ email, password })
// // //         : await supabase.auth.signInWithPassword({ email, password });

// // //       if (error) {
// // //         setError(error.message);
// // //       } else {
// // //         onAuthSuccess?.();
// // //       }
// // //     } catch (err) {
// // //       setError("An unexpected error occurred. Please try again.");
// // //       console.error(err); // Log the error for debugging
// // //     }
// // //   };

// // //   return (
// // //     <form onSubmit={handleSubmit} className="auth-form">
// // //       <h3>{isSignUp ? "Sign Up" : "Sign In"}</h3>
// // //       <input
// // //         type="email"
// // //         placeholder="Email"
// // //         value={email}
// // //         required
// // //         onChange={(e) => setEmail(e.target.value)}
// // //       />
// // //       <input
// // //         type="password"
// // //         placeholder="Password"
// // //         value={password}
// // //         required
// // //         onChange={(e) => setPassword(e.target.value)}
// // //       />
// // //       {error && <p className="error">{error}</p>}
// // //       <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>
// // //       <p
// // //         onClick={() => setIsSignUp(!isSignUp)}
// // //         style={{ cursor: "pointer", color: "#2d3033ff" }}
// // //       >
// // //         {isSignUp
// // //           ? "Already have an account? Sign in"
// // //           : "Don't have an account? Sign up"}
// // //       </p>
// // //     </form>
// // //   );
// // // }
// // // src/components/AuthForm.jsx
// // import { useState } from "react";
// // import { supabase } from "../supabaseClient";
// // import "../styles/AuthForm.css";

// // export default function AuthForm({ onAuthSuccess }) {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [fullName, setFullName] = useState(""); // 👈 new state
// //   const [isSignUp, setIsSignUp] = useState(false);
// //   const [error, setError] = useState(null);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError(null);

// //     if (!email || !password || (isSignUp && !fullName)) {
// //       setError("All fields are required.");
// //       return;
// //     }

// //     try {
// //       const { error } = isSignUp
// //         ? await supabase.auth.signUp({
// //             email,
// //             password,
// //             options: {
// //               data: { full_name: fullName }, // 👈 save name in user_metadata
// //             },
// //           })
// //         : await supabase.auth.signInWithPassword({ email, password });

// //       if (error) {
// //         setError(error.message);
// //       } else {
// //         onAuthSuccess?.();
// //       }
// //     } catch (err) {
// //       setError("An unexpected error occurred. Please try again.");
// //       console.error(err);
// //     }
// //   };

// //   return (
// //     <form onSubmit={handleSubmit} className="auth-form">
// //       <h3>{isSignUp ? "Sign Up" : "Sign In"}</h3>

// //       {isSignUp && (
// //         <input
// //           type="text"
// //           placeholder="Full Name"
// //           value={fullName}
// //           required
// //           onChange={(e) => setFullName(e.target.value)}
// //         />
// //       )}

// //       <input
// //         type="email"
// //         placeholder="Email"
// //         value={email}
// //         required
// //         onChange={(e) => setEmail(e.target.value)}
// //       />
// //       <input
// //         type="password"
// //         placeholder="Password"
// //         value={password}
// //         required
// //         onChange={(e) => setPassword(e.target.value)}
// //       />

// //       {error && <p className="error">{error}</p>}

// //       <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>

// //       <p
// //         onClick={() => setIsSignUp(!isSignUp)}
// //         style={{ cursor: "pointer", color: "#2d3033ff" }}
// //       >
// //         {isSignUp
// //           ? "Already have an account? Sign in"
// //           : "Don't have an account? Sign up"}
// //       </p>
// //     </form>
// //   );
// // }
// // src/components/AuthForm.jsx
// import { useState } from "react";
// import { supabase } from "../supabaseClient";
// import { useNavigate } from "react-router-dom";
// import "../styles/AuthForm.css";

// export default function AuthForm({ onAuthSuccess }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [fullName, setFullName] = useState("");
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [error, setError] = useState(null);
//   const [message, setMessage] = useState(null);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setMessage(null);

//     if (!email || !password || (isSignUp && !fullName)) {
//       setError("All fields are required.");
//       return;
//     }

//     try {
//       if (isSignUp) {
//         // ✅ Sign Up
//         const { error } = await supabase.auth.signUp({
//           email,
//           password,
//           options: {
//             data: { full_name: fullName },
//           },
//         });

//         if (error) {
//           setError(error.message);
//           return;
//         }

//         // If email confirmation is enabled, Supabase won’t log them in immediately
//         setMessage("Check your email to confirm your account before signing in.");
//       } else {
//         // ✅ Sign In
//         const { data, error } = await supabase.auth.signInWithPassword({
//           email,
//           password,
//         });

//         if (error) {
//           setError(error.message);
//           return;
//         }

//         if (data?.session) {
//           onAuthSuccess?.();
//           navigate("/"); // redirect to home
//         }
//       }
//     } catch (err) {
//       console.error(err);
//       setError("An unexpected error occurred. Please try again.");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="auth-form">
//       <h3>{isSignUp ? "Sign Up" : "Sign In"}</h3>

//       {isSignUp && (
//         <input
//           type="text"
//           placeholder="Full Name"
//           value={fullName}
//           required
//           onChange={(e) => setFullName(e.target.value)}
//         />
//       )}

//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         required
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         required
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       {error && <p className="error">{error}</p>}
//       {message && <p className="success">{message}</p>}

//       <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>

//       <p
//         onClick={() => setIsSignUp(!isSignUp)}
//         style={{ cursor: "pointer", color: "#2d3033ff" }}
//       >
//         {isSignUp
//           ? "Already have an account? Sign in"
//           : "Don't have an account? Sign up"}
//       </p>
//     </form>
//   );
// }
// src/components/AuthForm.jsx
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../styles/AuthForm.css";

export default function AuthForm({ onAuthSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    if (!email || !password || (isSignUp && !fullName)) {
      setError("All fields are required.");
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // ✅ Sign Up
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });

        if (error) {
          setError(error.message);
          return;
        }

        // If email confirmation is enabled, Supabase won't log them in immediately
        setMessage("Check your email to confirm your account before signing in.");
      } else {
        // ✅ Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(error.message);
          return;
        }

        if (data?.session) {
          onAuthSuccess?.();
          navigate("/"); // redirect to home
        }
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h3>{isSignUp ? "Sign Up" : "Sign In"}</h3>

      {isSignUp && (
        <div className="input-container">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            required
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
      )}

      <div className="input-container">
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="input-container">
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
      </button>

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