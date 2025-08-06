// import React from "react";
// import Header from "./components/Header";
// import Hero from "./components/Hero";
// import Main from "./components/Main";
// import Footer from "./components/Footer";

// import { makeServer } from "./services/mirage/server";
// import JobList from "./components/JobList";


// // Start MirageJS server
// if (process.env.NODE_ENV === 'development') {
//   makeServer();
// }
// function App() {
//   return (
//     <div className="root">
//       <Header />
//       <Hero />
//       <Main />
//       <JobList/>
//       <Footer />

//     </div>
//   );
// }

// export default App;
// src/App.jsx
// import React, { useEffect, useState } from "react";
// import Header from "./components/Header";
// import Hero from "./components/Hero";
// import Main from "./components/Main";
// import Footer from "./components/Footer";
// import JobList from "./components/JobList";
// import { supabase } from "./supabaseClient";
// import { makeServer } from "./services/mirage/server";

// if (process.env.NODE_ENV === "development") {
//   makeServer();
// }

// function App() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setUser(session?.user || null);
//     });

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user || null);
//     });

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, []);

//   return (
//     <div className="root">
//       <Header user={user} />
//       <Hero />
//       <Main />
//       <JobList />
//       <Footer />
//     </div>
//   );
// }

// export default App;
// src/App.jsx
// import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Router
// import Header from "./components/Header";
// import Hero from "./components/Hero";
// import Main from "./components/Main";
// import Footer from "./components/Footer";
// import JobList from "./components/JobList"; // Import JobList
// import Dashboard from "./components/dashboard/Dashboard"; // Import your Dashboard component
// import AboutUs from "./components/aboutUs/AboutUs"
// import ContactUs from "./components/contactUs/ContactUs"
// import AuthForm from "./components/AuthForm"; // Import AuthForm
// import { supabase } from "./supabaseClient";
// import { makeServer } from "./services/mirage/server";

// if (process.env.NODE_ENV === "development") {
//   makeServer();
// }

// function App() {
//   const [user, setUser ] = useState(null);

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setUser (session?.user || null);
//     });

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser (session?.user || null);
//     });

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, []);

//   return (
//     <Router> {/* Wrap the entire app in Router */}
//       <div className="root">
//         <Header user={user} />
//         <Routes>
//           <Route path="/" element={<><Hero /><Main /><Footer /></>} />
//           <Route path="/jobs" element={<><JobList /><Footer /></>} />
//           <Route path="/auth" element={<AuthForm onAuthSuccess={() => setUser (true)} />} />
//             <Route path="/about" element={<><AboutUs/><Footer /></>}/>
//             <Route path="/contact" element={<><ContactUs/><Footer /></>}/>
//           <Route path="/dashboard" element={<><Dashboard/><Footer /></>} />
//           <Route path="/footer" element={<><Footer /></>} />
//         </Routes>
        
//       </div>
//     </Router>
//   );
// }

// export default App;
// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Main from "./components/Main";
import Footer from "./components/Footer";
import JobList from "./components/JobList";
import Dashboard from "./components/dashboard/Dashboard";
import AboutUs from "./components/aboutUs/AboutUs";
import ContactUs from "./components/contactUs/ContactUs";
import AuthForm from "./components/AuthForm";
import { supabase } from "./supabaseClient";
import { useDataLoader } from "./hooks/useDataLoader";
// import { useDataLoader } from "./hooks/useDataLoader";

function App() {
  const [user, setUser] = useState(null);
  const { loadAllData } = useDataLoader();

  useEffect(() => {
    // Load data from Express backend
    loadAllData();

    // Handle Supabase auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <div className="root">
        <Header user={user} />
        <Routes>
          <Route path="/" element={<><Hero /><Main /><Footer /></>} />
          <Route path="/jobs" element={<><JobList /></>} />
          <Route path="/auth" element={<AuthForm onAuthSuccess={() => setUser(true)} />} />
          <Route path="/about" element={<><AboutUs/><Footer /></>}/>
          <Route path="/contact" element={<><ContactUs/><Footer /></>}/>
          <Route path="/dashboard" element={<><Dashboard/><Footer /></>} />
          <Route path="/footer" element={<><Footer /></>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;