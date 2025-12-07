import React from 'react';
import PropTypes from 'prop-types';
import '../css/card.css';


export default function ResourceCard({ item }) {
    return (
    <div className="card">
        {item.icon && <div className="icon">{item.icon}</div>}
        <span className="badge">{item.category}</span>
        <h4>{item.title}</h4>
        <p>{item.desc}</p>
        <button className="learn">Learn More →</button>
    </div>
    );
}

ResourceCard.propTypes = {
    item: PropTypes.shape({
        category: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        desc: PropTypes.string.isRequired,
        icon: PropTypes.string,
    }).isRequired,
};