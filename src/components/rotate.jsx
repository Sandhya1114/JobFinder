// import React, { useState, useRef, useEffect } from 'react';
// import './Categories3DSlider.css';

// const Categories3DSlider = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isDragging, setIsDragging] = useState(false);
//   const [startX, setStartX] = useState(0);
//   const [translateX, setTranslateX] = useState(0);
//   const [startTranslateX, setStartTranslateX] = useState(0);
//   const containerRef = useRef(null);

//   const categories = [
//     { name: "Technology", icon: "💻", color: "linear-gradient(135deg, #000000ff, #000000ff)" },
//     { name: "Design", icon: "🎨", color: "linear-gradient(135deg, #0c0f14ff, #585f60ff)" },
//     { name: "Marketing", icon: "📱", color: "linear-gradient(135deg, #0c0f14ff, #585f60ff)" },
//     { name: "Finance", icon: "💰", color: "linear-gradient(135deg, #0c0f14ff, #585f60ff)" },
//     { name: "Healthcare", icon: "🏥", color: "linear-gradient(135deg, #0c0f14ff, #585f60ff)" },
//     { name: "Education", icon: "📚", color: "linear-gradient(135deg, #0c0f14ff, #585f60ff)" },
//     { name: "Engineering", icon: "⚙️", color: "linear-gradient(135deg, #0c0f14ff, #585f60ff)" },
//     { name: "Sales", icon: "📈", color: "linear-gradient(135deg, #0c0f14ff, #585f60ff)" },
//     { name: "Research", icon: "🔬", color: "linear-gradient(135deg, #0c0f14ff, #585f60ff)" },
//     { name: "Writing", icon: "✍️", color: "linear-gradient(135deg, #0c0f14ff, #585f60ff)" }
//   ];

//   const cardWidth = 200;
//   const cardSpacing = 80;
//   const totalCardWidth = cardWidth + cardSpacing;

//   const handleMouseDown = (e) => {
//     setIsDragging(true);
//     setStartX(e.clientX);
//     setStartTranslateX(translateX);
//   };

//   const handleMouseMove = (e) => {
//     if (!isDragging) return;
//     const deltaX = e.clientX - startX;
//     setTranslateX(startTranslateX + deltaX);
//   };

//   const handleMouseUp = () => {
//     if (isDragging) snapToNearestCard();
//     setIsDragging(false);
//   };

//   const handleTouchStart = (e) => {
//     setIsDragging(true);
//     setStartX(e.touches[0].clientX);
//     setStartTranslateX(translateX);
//   };

//   const handleTouchMove = (e) => {
//     if (!isDragging) return;
//     const deltaX = e.touches[0].clientX - startX;
//     setTranslateX(startTranslateX + deltaX);
//   };

//   const handleTouchEnd = () => {
//     if (isDragging) snapToNearestCard();
//     setIsDragging(false);
//   };

//   const snapToNearestCard = () => {
//     const nearestIndex = Math.round(-translateX / totalCardWidth);
//     const clampedIndex = Math.max(0, Math.min(categories.length - 1, nearestIndex));
//     setCurrentIndex(clampedIndex);
//     setTranslateX(-clampedIndex * totalCardWidth);
//   };

//   const goToSlide = (index) => {
//     setCurrentIndex(index);
//     setTranslateX(-index * totalCardWidth);
//   };

//   const nextSlide = () => {
//     const nextIndex = (currentIndex + 1) % categories.length;
//     goToSlide(nextIndex);
//   };

//   const prevSlide = () => {
//     const prevIndex = currentIndex === 0 ? categories.length - 1 : currentIndex - 1;
//     goToSlide(prevIndex);
//   };

//   const getCardStyle = (index) => {
//     const position = index * totalCardWidth + translateX;
//     const distance = Math.abs(position);
//     const maxDistance = totalCardWidth * 2;

//     const scale = Math.max(0.6, 1 - (distance / maxDistance) * 0.4);
//     const opacity = Math.max(0.3, 1 - (distance / maxDistance) * 0.7);
//     const rotateY = Math.max(-45, Math.min(45, position / 10));
//     const translateZ = Math.max(-200, 100 - (distance / 5));

//     return {
//       transform: `translate3d(${position}px, 0, ${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`,
//       opacity: opacity,
//       zIndex: Math.round(100 - distance)
//     };
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => {
//         const nextIndex = (prevIndex + 1) % categories.length;
//         setTranslateX(-nextIndex * totalCardWidth);
//         return nextIndex;
//       });
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [categories.length, totalCardWidth]);

//   return (
//     <section className="slider-section">
//       <div className="slider-container">
//         <div className="slider-header">
//           <h2 className="slider-title">Browse Jobs by Category</h2>
//           <p className="slider-subtitle">
//             Explore opportunities across diverse industries with our interactive 3D slider
//           </p>
//         </div>

//         <div className="slider-wrapper">
//           <div
//             ref={containerRef}
//             className="slider"
//             onMouseDown={handleMouseDown}
//             onMouseMove={handleMouseMove}
//             onMouseUp={handleMouseUp}
//             onMouseLeave={handleMouseUp}
//             onTouchStart={handleTouchStart}
//             onTouchMove={handleTouchMove}
//             onTouchEnd={handleTouchEnd}
//             style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
//           >
//             <div className="slider-track">
//               {categories.map((category, index) => {
//                 const cardStyle = getCardStyle(index);
//                 return (
//                   <div
//                     key={index}
//                     className="category-card"
//                     style={{ ...cardStyle, background: category.color }}
//                     onClick={() => goToSlide(index)}
//                     onMouseEnter={(e) => {
//                       const icon = e.currentTarget.querySelector('.card-icon');
//                       const glow = e.currentTarget.querySelector('.card-glow');
//                       if (icon) icon.style.transform = 'scale(1.2)';
//                       if (glow) glow.style.opacity = '1';
//                     }}
//                     onMouseLeave={(e) => {
//                       const icon = e.currentTarget.querySelector('.card-icon');
//                       const glow = e.currentTarget.querySelector('.card-glow');
//                       if (icon) icon.style.transform = 'scale(1)';
//                       if (glow) glow.style.opacity = '0';
//                     }}
//                   >
//                     <div className="card-overlay"></div>
//                     <div className="card-content">
//                       <div className="card-icon">{category.icon}</div>
//                       <h3 className="card-title">{category.name}</h3>
//                     </div>
//                     <div className="card-glow"></div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         <div className="slider-controls">
//           <button
//             className="nav-button"
//             onClick={prevSlide}
//             style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
//             disabled={currentIndex === 0}
//           >
//             ◀
//           </button>

//           <div className="indicators">
//             {categories.map((_, index) => (
//               <div
//                 key={index}
//                 className={`indicator ${index === currentIndex ? 'active' : ''}`}
//                 onClick={() => goToSlide(index)}
//               />
//             ))}
//           </div>

//           <button
//             className="nav-button"
//             onClick={nextSlide}
//             style={{ opacity: currentIndex === categories.length - 1 ? 0.5 : 1 }}
//             disabled={currentIndex === categories.length - 1}
//           >
//             ▶
//           </button>
//         </div>

//         <div className="instructions">
//           <p className="instruction-text">
//             Drag to slide • Click arrows or dots to navigate • Click cards to select
//           </p>
//         </div>

//         <div className="particles">
//           {[...Array(30)].map((_, i) => (
//             <div
//               key={i}
//               className="particle"
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 animationDelay: `${Math.random() * 2}s`,
//                 animationDuration: `${2 + Math.random() * 2}s`
//               }}
//             ></div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Categories3DSlider;
import React, { useState, useEffect } from 'react';
import './Categories3DSlider.css';

const Categories3DSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [startTranslateX, setStartTranslateX] = useState(0);

  const categories = [
    {
      name: "Technology",
      description: "Explore jobs in software, AI, and tech innovation.",
      color: "#000"
    },
    {
      name: "Design",
      description: "Careers in graphic, UI/UX, and visual design.",
      color: "#000"
    },
    {
      name: "Marketing",
      description: "Digital marketing, branding, and social media roles.",
      color: "#000"
    },
    {
      name: "Finance",
      description: "Jobs in banking, accounting, and fintech.",
      color: "#000"
    },
    {
      name: "Healthcare",
      description: "Opportunities in hospitals, clinics, and biotech.",
      color: "#000"
    },
    {
      name: "Education",
      description: "Teaching, tutoring, and edtech positions.",
      color: "#000"
    },
    {
      name: "Engineering",
      description: "Roles in mechanical, civil, and electrical engineering.",
      color: "#000"
    },
    {
      name: "Sales",
      description: "Inside/outside sales and business development jobs.",
      color: "#000"
    },
    {
      name: "Research",
      description: "Academic, clinical, and market research careers.",
      color: "#000"
    },
    {
      name: "Writing",
      description: "Creative, technical, and content writing roles.",
      color: "#000"
    }
  ];

  const cardWidth = 200;
  const cardSpacing = 80;
  const totalCardWidth = cardWidth + cardSpacing;

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartTranslateX(translateX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    setTranslateX(startTranslateX + deltaX);
  };

  const handleMouseUp = () => {
    if (isDragging) snapToNearestCard();
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setStartTranslateX(translateX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX;
    setTranslateX(startTranslateX + deltaX);
  };

  const handleTouchEnd = () => {
    if (isDragging) snapToNearestCard();
    setIsDragging(false);
  };

  const snapToNearestCard = () => {
    const nearestIndex = Math.round(-translateX / totalCardWidth);
    const clampedIndex = Math.max(0, Math.min(categories.length - 1, nearestIndex));
    setCurrentIndex(clampedIndex);
    setTranslateX(-clampedIndex * totalCardWidth);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setTranslateX(-index * totalCardWidth);
  };

  const getCardStyle = (index) => {
    const position = index * totalCardWidth + translateX;
    const distance = Math.abs(position);
    const maxDistance = totalCardWidth * 2;

    const scale = Math.max(0.6, 1 - (distance / maxDistance) * 0.4);
    const opacity = Math.max(0.3, 1 - (distance / maxDistance) * 0.7);
    const rotateY = Math.max(-45, Math.min(45, position / 10));
    const translateZ = Math.max(-200, 100 - (distance / 5));

    return {
      transform: `translate3d(${position}px, 0, ${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`,
      opacity: opacity,
      zIndex: Math.round(100 - distance)
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (currentIndex + 1) % categories.length;
      goToSlide(next);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex, categories.length]);

  return (
    <>
    <div className='categories'>
          <h1>Browse By Category</h1>
              <p>More than 7 million JobHuntr turn to our website each month.</p>
    </div>
            
    <div
      className="slider"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div className="slider-track">
        {categories.map((category, index) => {
          const cardStyle = getCardStyle(index);
          return (
            
            
            <div
              key={index}
              className="category-card"
              style={{ ...cardStyle, background: category.color }}
              onClick={() => goToSlide(index)}
            >
              <div className="card-content">
                <h3 className="card-title">{category.name}</h3>
                <p className="card-description">{category.description}</p>
                <button className='categoriesbtn'>Explore</button>
              </div>
            </div>
            
          );
        })}
      </div>
    </div>
    </>
  );
};

export default Categories3DSlider;
