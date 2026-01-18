import React from 'react';
import PropTypes from 'prop-types';
import { Heart } from 'lucide-react';
import { useResources } from '../context/ResourceContext';
import { useAuth } from '../context/AuthContext';
import '../css/card.css';


export default function ResourceCard({ item }) {
    const { savedItems, toggleSavedItem } = useResources();
    const { isAuthenticated } = useAuth();
    const isSaved = savedItems.includes(item.id);

    const handleSave = (e) => {
        e.preventDefault();
        if (isAuthenticated) {
            toggleSavedItem(item.id);
        }
    };

    return (
    <div className="card">
        {item.icon && <div className="icon">{item.icon}</div>}
        <span className="badge">{item.category}</span>
        <h4>{item.title}</h4>
        <p>{item.desc}</p>
        <div className="card-actions">
            <button className="learn">Learn More →</button>
            {isAuthenticated && (
                <button 
                    onClick={handleSave}
                    className={`save-btn ${isSaved ? 'saved' : ''}`}
                    title={isSaved ? 'Remove from saved' : 'Save item'}
                >
                    <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
                </button>
            )}
        </div>
    </div>
    );
}

ResourceCard.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        category: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        desc: PropTypes.string.isRequired,
        icon: PropTypes.string,
    }).isRequired,
};