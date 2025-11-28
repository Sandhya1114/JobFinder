import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from '@tanstack/react-query';
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
import { useDataLoader } from "./hooks/useDataLoader";
import AllFilters from "./components/AllFilterOption/AllFilters";
import ATSResumeAnalyzer from "./components/ATS/AtsAnalyzer";
import LinkedInProfileChecker from "./components/LinkedInProfileChecker/LinkedInProfileChecker";
// import LinkedInProfileChecker from './components/LinkedInProfileChecker';

// ✅ SOLUTION: Create a separate component that uses useDataLoader
function AppContent() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { loadAllData } = useDataLoader(); // ✅ Now this is INSIDE QueryClientProvider

  useEffect(() => {
    // Load categories and companies only (not jobs yet)
    loadAllData();

    // Restore Supabase session on app start
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setAuthLoading(false);
    });

    // Listen for login/logout changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    // Cleanup listener on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [loadAllData]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Prevent flicker/redirect while Supabase restores session
  if (authLoading) {
    return <div>Loading session...</div>;
  }

  return (
    <Router>
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
          {/* <Route 
            path="/likedln" 
            element={
              <>
                <Header user={user} />
                <LinkedInProfileChecker/>
              </>
            }
          /> */}
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
          <Route path="/filters/:filterType" element={<> <Header user={user} /><AllFilters /> <Footer /></>} />
          <Route
            path="/auth"
            element={
              <><Header user={user} />
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
          <Route path="/score" element={<> <Header user={user} /><ATSResumeAnalyzer/><Footer /></>}/>
          <Route path="/footer" element={<Footer />} />
        </Routes>
      </div>
    </Router>
  );
}

// ✅ Main App component - wraps everything with QueryClientProvider FIRST
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;