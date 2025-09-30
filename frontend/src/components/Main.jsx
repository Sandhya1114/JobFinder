import React from "react";
import "../styles/Main.css";
import Categories3DRing from "./rotate";
import JobCards from "./jobCard/JobCard";
   import JobPlatformServices from './JobPlatformServices';
import AdvancedJobFilter from "./AdvancedJobFilter/AdvancedJobFilter";
import QuickFilters from "./QuickFilters";
// import './JobPlatformServices.css';

function Main() {
  const categories = ["IT Jobs", "Marketing", "Finance", "Engineering", "Remote Jobs"];

  return (
    <>
    <main className="main">
      {/* <section className="categories">
        <h2>Browse Jobs by Category</h2>
        <div className="category-list">
          {categories.map((cat, index) => (
            <div className="category-card" key={index}>
              {cat}
            </div>
          ))}
        </div>
      </section> */}
      <Categories3DRing/>
       <QuickFilters />
{/*       
      <section className="recommended">
        <h2>Recommended Jobs</h2>
        <div className="job-list">
          {[1, 2, 3].map((job) => (
            <div className="job-card" key={job}>
              <h3>Frontend Developer</h3>
              <p>Company Name • Location</p>
              <p>Experience: 2-5 years</p>
              <button className="apply-btn">Apply Now</button>
            </div>
          ))}
        </div>
      </section> */}
       {/* <JobCards/> */}
       <AdvancedJobFilter/>
    </main>
 


<JobPlatformServices />
    </>
  );
}

export default Main;
