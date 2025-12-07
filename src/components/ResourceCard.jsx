import React from 'react';
import '../css/card.css';


export default function ResourceCard({ item }) {
    return (
    <div className="card">
        <span className="badge">{item.category}</span>
        <h4>{item.title}</h4>
        <p>{item.desc}</p>
        <button className="learn">Learn More →</button>
    </div>
    );
}