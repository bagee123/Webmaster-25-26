import React from "react";
import Marquee from "react-fast-marquee";
import { useNavigate } from 'react-router-dom';
import "../css/moving_home_strip.css";

export default function MovingHomeStrip() {
  const navigate = useNavigate();

  const categories = [
    { label: 'Health Support', categoryId: 'Health' },
    { label: 'Education Programs', categoryId: 'Education' },
    { label: 'Volunteer Opportunities', categoryId: 'Volunteering' },
    { label: 'Community Events', categoryId: 'Events' },
    { label: 'Food Assistance', categoryId: 'Support Services' },
    { label: 'Youth Services', categoryId: 'Support Services' },
    { label: 'Mental Wellness', categoryId: 'Health' },
    { label: 'Senior Services', categoryId: 'Support Services' },
    { label: 'Recreation Programs', categoryId: 'Recreation' },
    { label: 'Local Nonprofits', categoryId: 'Nonprofits' },
    { label: 'Housing Help', categoryId: 'Housing' },
  ];

  const handleCategoryClick = (categoryId) => {
    navigate('/resources', { state: { selectedCategory: categoryId } });
  };

  return (
    <div className="ticker">
      <Marquee
        speed={46}
        pauseOnHover={true}
        pauseOnClick={true}
        direction="left"
        autoFill={true}
      >
        {categories.map((item) => (
          <button
            key={`${item.categoryId}-${item.label}`}
            type="button"
            className="ticker-item"
            onClick={() => handleCategoryClick(item.categoryId)}
          >
            {item.label}
          </button>
        ))}
      </Marquee>
    </div>
  );
}