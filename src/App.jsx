import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Main from "./components/Main";
import Footer from "./components/Footer";

import { makeServer } from "./services/mirage/server";
import JobList from "./components/JobList";


// Start MirageJS server
if (process.env.NODE_ENV === 'development') {
  makeServer();
}
function App() {
  return (
    <div className="root">
      <Header />
      <Hero />
      <Main />
      <JobList/>
      <Footer />

    </div>
  );
}

export default App;
