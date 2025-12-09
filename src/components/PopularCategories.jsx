import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, GraduationCap, HandHeart, Calendar, Users, Leaf, Building2, Home } from 'lucide-react';
import '../css/categories.css';

const categories = [
  { id: 1, name: 'Health', categoryId: 'health', icon: Heart, color: 'rose-pink' },
  { id: 2, name: 'Education', categoryId: 'education', icon: GraduationCap, color: 'blue-cyan' },
  { id: 3, name: 'Volunteering', categoryId: 'volunteering', icon: HandHeart, color: 'orange-amber' },
  { id: 4, name: 'Events', categoryId: 'events', icon: Calendar, color: 'purple-pink' },
  { id: 5, name: 'Support', categoryId: 'support', icon: Users, color: 'green-emerald' },
  { id: 6, name: 'Recreation', categoryId: 'recreation', icon: Leaf, color: 'teal-cyan' },
  { id: 7, name: 'Nonprofits', categoryId: 'nonprofits', icon: Building2, color: 'indigo-blue' },
  { id: 8, name: 'Housing', categoryId: 'housing', icon: Home, color: 'red-orange' },
];

export default function PopularCategories() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    // Navigate to resources page with state
    navigate('/resources', { state: { selectedCategory: categoryId } });
  };

  return (
    <section id="categories" className="popular-categories-section">
      <div className="categories-container">
        <div className="categories-header">
          <h3>Popular Categories</h3>
          <p>Quick access to the most sought-after community services</p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.categoryId)}
                className={`category-button category-${category.color}`}
              >
                <div className="category-icon-wrapper">
                  <Icon size={28} strokeWidth={2} />
                </div>
                <span className="category-name">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
