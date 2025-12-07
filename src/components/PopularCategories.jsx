import React from 'react';
import { Heart, GraduationCap, HandHeart, Calendar, Users, Leaf, Building2, Home } from 'lucide-react';
import '../css/categories.css';

const categories = [
  { id: 1, name: 'Health', icon: Heart, color: 'rose-pink' },
  { id: 2, name: 'Education', icon: GraduationCap, color: 'blue-cyan' },
  { id: 3, name: 'Volunteering', icon: HandHeart, color: 'orange-amber' },
  { id: 4, name: 'Events', icon: Calendar, color: 'purple-pink' },
  { id: 5, name: 'Support', icon: Users, color: 'green-emerald' },
  { id: 6, name: 'Recreation', icon: Leaf, color: 'teal-cyan' },
  { id: 7, name: 'Nonprofits', icon: Building2, color: 'indigo-blue' },
  { id: 8, name: 'Housing', icon: Home, color: 'red-orange' },
];

export default function PopularCategories() {
  return (
    <section className="popular-categories-section">
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
