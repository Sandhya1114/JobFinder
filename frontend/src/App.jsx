
// // // src/App.jsx
// // import React, { useEffect, useState } from "react";
// // import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// // import Header from "./components/Header";
// // import Hero from "./components/Hero";
// // import Main from "./components/Main";
// // import Footer from "./components/Footer";
// // import JobList from "./components/JobList";
// // import Dashboard from "./components/dashboard/Dashboard";
// // import AboutUs from "./components/aboutUs/AboutUs";
// // import ContactUs from "./components/contactUs/ContactUs";
// // import AuthForm from "./components/AuthForm";
// // import { supabase } from "./supabaseClient";
// // import { useDataLoader } from "./hooks/useDataLoader";
// // // import { useDataLoader } from "./hooks/useDataLoader";

// // function App() {
// //   const [user, setUser] = useState(null);
// //   const { loadAllData } = useDataLoader();

// //   useEffect(() => {
// //     // Load data from Express backend
// //     loadAllData();

// //     // Handle Supabase auth
// //     supabase.auth.getSession().then(({ data: { session } }) => {
// //       setUser(session?.user || null);
// //     });

// //     const {
// //       data: { subscription },
// //     } = supabase.auth.onAuthStateChange((_event, session) => {
// //       setUser(session?.user || null);
// //     });

// //     return () => {
// //       subscription.unsubscribe();
// //     };
// //   }, []);

// //   return (
// //     <Router>
// //       <div className="root">
// //         <Header user={user} />
// //         <Routes>
// //           <Route path="/" element={<><Hero /><Main /><Footer /></>} />
// //           <Route path="/jobs" element={<><JobList /></>} />
// //           <Route path="/auth" element={<AuthForm onAuthSuccess={() => setUser(true)} />} />
// //           <Route path="/about" element={<><AboutUs/><Footer /></>}/>
// //           <Route path="/contact" element={<><ContactUs/><Footer /></>}/>
// //           <Route path="/dashboard" element={<><Dashboard/><Footer /></>} />
// //           <Route path="/footer" element={<><Footer /></>} />
// //         </Routes>
// //       </div>
// //     </Router>
// //   );
// // }

// // export default App;
// // import React, { useEffect, useState } from "react";
// // import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// // import Header from "./components/Header";
// // import Hero from "./components/Hero";
// // import Main from "./components/Main";
// // import Footer from "./components/Footer";
// // import JobList from "./components/JobList";
// // import Dashboard from "./components/dashboard/Dashboard";
// // import AboutUs from "./components/aboutUs/AboutUs";
// // import ContactUs from "./components/contactUs/ContactUs";
// // import AuthForm from "./components/AuthForm";
// // import { supabase } from "./supabaseClient";
// // import { useDataLoader } from "./hooks/useDataLoader";

// // function App() {
// //   const [user, setUser ] = useState(null);
// //   const { loadAllData } = useDataLoader();

// //   useEffect(() => {
// //     loadAllData();

// //     supabase.auth.getSession().then(({ data: { session } }) => {
// //       setUser (session?.user || null);
// //     });

// //     const {
// //       data: { subscription },
// //     } = supabase.auth.onAuthStateChange((_event, session) => {
// //       setUser (session?.user || null);
// //     });

// //     return () => {
// //       subscription.unsubscribe();
// //     };
// //   }, []);

// //   const handleSignOut = async () => {
// //     await supabase.auth.signOut();
// //     setUser (null);
// //   };

// //   return (
// //     <Router>
// //       <div className="root">
// //         <Header user={user} />
// //         <Routes>
// //           <Route path="/" element={<><Hero /><Main /><Footer /></>} />
// //           <Route path="/jobs" element={<><JobList /></>} />
// //           <Route path="/auth" element={<AuthForm onAuthSuccess={() => setUser (true)} />} />
// //           <Route path="/about" element={<><AboutUs/><Footer /></>}/>
// //           <Route path="/contact" element={<><ContactUs/><Footer /></>}/>
          
// //           <Route path="/dashboard" element={<Dashboard user={user} onSignOut={handleSignOut} />} />
// //           <Route path="/footer" element={<><Footer /></>} />
// //         </Routes>
// //       </div>
// //     </Router>
// //   );
// // }

// // export default App;
// // src/App.jsx
// import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Header from "./components/Header";
// import Hero from "./components/Hero";
// import Main from "./components/Main";
// import Footer from "./components/Footer";
// import JobList from "./components/JobList";
// import Dashboard from "./components/dashboard/Dashboard";
// import AboutUs from "./components/aboutUs/AboutUs";
// import ContactUs from "./components/contactUs/ContactUs";
// import AuthForm from "./components/AuthForm";
// import { supabase } from "./supabaseClient";
// import { useDataLoader } from "./hooks/useDataLoader";
// import AllFilters from "./components/AllFilterOption/AllFilters";
// import ATSResumeAnalyzer from "./components/ATS/AtsAnalyzer";

// function App() {
//   const [user, setUser] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true);
//   const { loadAllData } = useDataLoader();

//   useEffect(() => {
//     // Load any backend data you need
//     loadAllData();

//     // Restore Supabase session on app start
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setUser(session?.user || null);
//       setAuthLoading(false);
//     });

//     // Listen for login/logout changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         setUser(session?.user || null);
//       }
//     );

//     // Cleanup listener on unmount
//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [loadAllData]);

//   const handleSignOut = async () => {
//     await supabase.auth.signOut();
//     setUser(null);
//   };

//   // Prevent flicker/redirect while Supabase restores session
//   if (authLoading) {
//     return <div>Loading session...</div>;
//   }

//   return (
//     <Router>
//       <div className="root">
//         <Routes>
//           <Route 
//             path="/" 
//             element={
//               <>
//                 <Header user={user} />
//                 <Hero />
//                 <Main />
//                 <Footer />
//               </>
//             } 
//           />
          
//           {/* Updated jobs route - now supports search parameters */}
//           <Route 
//             path="/jobs" 
//             element={
//               <>
//                 <Header user={user} />
//                 <JobList />
//               </>
//             } 
//           />
          
//           {/* Optional: Legacy route support for URL-based search */}
//           <Route 
//             path="/jobs/:searchTerm" 
//             element={
//               <>
//                 <Header user={user} />
//                 <JobList />
//               </>
//             } 
//           />
//            <Route path="/filters/:filterType" element={  <> <Header user={user} /><AllFilters />  <Footer /></>} />
//           <Route
//             path="/auth"
//             element={
//               <><Header user={user} />
//               <AuthForm
//                 onAuthSuccess={async () => {
//                   const { data: { session } } = await supabase.auth.getSession();
//                   setUser(session?.user || null);
//                 }}
//               />
//               </>
//             }
//           />
          
//           <Route 
//             path="/about" 
//             element={
//               <>
//                 <Header user={user} />
//                 <AboutUs />
//                 <Footer />
//               </>
//             } 
//           />
          
//           <Route 
//             path="/contact" 
//             element={
//               <>
//                 <Header user={user} />
//                 <ContactUs />
//                 <Footer />
//               </>
//             } 
//           />
          
//           <Route
//             path="/dashboard"
//             element={<Dashboard user={user} onSignOut={handleSignOut} />}
//           />
//           <Route path="/score" element={<> <Header user={user} /><ATSResumeAnalyzer/><Footer /></>}/>
//           <Route path="/footer" element={<Footer />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
// src/App.jsx - Updated version with ScrollToTop

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './queryClient';
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
import AllFilters from "./components/AllFilterOption/AllFilters";
import ATSResumeAnalyzer from "./components/ATS/AtsAnalyzer";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (authLoading) {
    return <div>Loading session...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ScrollToTop />
        <div className="root">
          <Routes>
            <Route 
              path="/" 
              element={
                <>
                  <Header user={user} />
                  <Hero />
                  <Main />
                  <Footer />
                </>
              } 
            />
            
            <Route 
              path="/jobs" 
              element={
                <>
                  <Header user={user} />
                  <JobList />
                </>
              } 
            />
            
            <Route 
              path="/jobs/:searchTerm" 
              element={
                <>
                  <Header user={user} />
                  <JobList />
                </>
              } 
            />
            
            <Route 
              path="/filters/:filterType" 
              element={
                <> 
                  <Header user={user} />
                  <AllFilters />  
                  <Footer />
                </>
              } 
            />
            
            <Route
              path="/auth"
              element={
                <>
                  <Header user={user} />
                  <AuthForm
                    onAuthSuccess={async () => {
                      const { data: { session } } = await supabase.auth.getSession();
                      setUser(session?.user || null);
                    }}
                  />
                </>
              }
            />
            
            <Route 
              path="/about" 
              element={
                <>
                  <Header user={user} />
                  <AboutUs />
                  <Footer />
                </>
              } 
            />
            
            <Route 
              path="/contact" 
              element={
                <>
                  <Header user={user} />
                  <ContactUs />
                  <Footer />
                </>
              } 
            />
            
            <Route
              path="/dashboard"
              element={<Dashboard user={user} onSignOut={handleSignOut} />}
            />
            
            <Route 
              path="/score" 
              element={
                <> 
                  <Header user={user} />
                  <ATSResumeAnalyzer/>
                  <Footer />
                </>
              }
            />
            
            <Route path="/footer" element={<Footer />} />
          </Routes>
        </div>
      </Router>
      {/* React Query DevTools - only in development */}
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}

export default App;
