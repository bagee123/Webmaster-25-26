import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Heart, X, ExternalLink, MapPin, Phone, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useResources } from '../context/ResourceContext';
import { useAuth } from '../context/AuthContext';
import '../css/card.css';


export default function ResourceCard({ item }) {
    const { savedItems, toggleSavedItem } = useResources();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const isSaved = savedItems.includes(Number(item.id));

    const handleSave = (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            toggleSavedItem(Number(item.id));
        }
    };

    const handleLearnMore = (e) => {
        e.preventDefault();
        setShowModal(true);
    };

    return (
    <>
    <div className="card">
        {item.icon && <div className="icon">{item.icon}</div>}
        <span className="badge">{item.category}</span>
        <h4>{item.title || item.name}</h4>
        <p>{item.desc || item.description}</p>
        <div className="card-actions">
            <button className="learn" onClick={handleLearnMore}>Learn More →</button>
            <button 
                onClick={handleSave}
                className={`save-btn ${isSaved ? 'saved' : ''}`}
                title={isSaved ? 'Remove from saved' : isAuthenticated ? 'Save item' : 'Sign in to save'}
            >
                <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
        </div>
    </div>

    {/* Resource Detail Modal */}
    {showModal && (
        <div className="resource-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="resource-modal" onClick={(e) => e.stopPropagation()}>
                <button className="resource-modal-close" onClick={() => setShowModal(false)}>
                    <X size={20} />
                </button>
                <div className="resource-modal-header">
                    {item.icon && <div className="resource-modal-icon">{item.icon}</div>}
                    <span className="resource-modal-category">{item.category}</span>
                </div>
                <h2 className="resource-modal-title">{item.title || item.name}</h2>
                <p className="resource-modal-description">{item.desc || item.description}</p>
                
                <div className="resource-modal-details">
                    {item.address && (
                        <div className="resource-detail-item">
                            <MapPin size={16} />
                            <span>{item.address}</span>
                        </div>
                    )}
                    {item.phone && (
                        <div className="resource-detail-item">
                            <Phone size={16} />
                            <a href={`tel:${item.phone}`}>{item.phone}</a>
                        </div>
                    )}
                    {item.website && (
                        <div className="resource-detail-item">
                            <Globe size={16} />
                            <a href={item.website} target="_blank" rel="noopener noreferrer">
                                Visit Website <ExternalLink size={12} />
                            </a>
                        </div>
                    )}
                </div>

                <div className="resource-modal-actions">
                    {item.website && (
                        <a 
                            href={item.website} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="resource-modal-btn primary"
                        >
                            Visit Website <ExternalLink size={14} />
                        </a>
                    )}
                    <button 
                        onClick={handleSave}
                        className={`resource-modal-btn ${isSaved ? 'saved' : 'secondary'}`}
                    >
                        <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
                        {isSaved ? 'Saved' : isAuthenticated ? 'Save Resource' : 'Sign in to save'}
                    </button>
                </div>
            </div>
        </div>
    )}
    </>
    );
}

ResourceCard.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        category: PropTypes.string.isRequired,
        title: PropTypes.string,
        name: PropTypes.string,
        desc: PropTypes.string,
        description: PropTypes.string,
        icon: PropTypes.string,
        address: PropTypes.string,
        phone: PropTypes.string,
        website: PropTypes.string,
    }).isRequired,
};