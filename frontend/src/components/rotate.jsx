// export default Categories3DSlider;
import  { useState, useEffect } from 'react';
import './Categories3DSlider.css';
import { useNavigate } from "react-router-dom";
const Categories3DSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [startTranslateX, setStartTranslateX] = useState(0);
  const navigate = useNavigate();

  const categories = [
    {
      name: "Technology",
      description: "Explore jobs in software, AI, and tech innovation.",
      color: "#79B4B7"
    },
    {
      name: "Design",
      description: "Careers in graphic, UI/UX, and visual design.",
      color: "#79B4B7"
    },
    {
      name: "Marketing",
      description: "Digital marketing, branding, and social media roles.",
      color: "#79B4B7"
    },
    {
      name: "Finance",
      description: "Jobs in banking, accounting, and fintech.",
      color: "#79B4B7"
    },
    {
      name: "Healthcare",
      description: "Opportunities in hospitals, clinics, and biotech.",
      color: "#79B4B7"
    },
    {
      name: "Education",
      description: "Teaching, tutoring, and edtech positions.",
      color: "#79B4B7"
    },
    {
      name: "Engineering",
      description: "Roles in mechanical, civil, and electrical engineering.",
      color: "#79B4B7"
    },
    {
      name: "Sales",
      description: "Inside/outside sales and business development jobs.",
      color: "#79B4B7"
    },
    {
      name: "Research",
      description: "Academic, clinical, and market research careers.",
      color: "#79B4B7"
    },
    {
      name: "Writing",
      description: "Creative, technical, and content writing roles.",
      color: "#79B4B7"
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
                <button className='categoriesbtn' onClick={() => navigate("/jobs")}>Explore</button>
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
