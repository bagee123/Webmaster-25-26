import React from 'react';
import PageHero from '../components/PageHero';
import ResourceForm from '../components/ResourceForm';
import '../css/pages.css';

export default function SubmitResource() {
    return (
        <div className="page-container">
            <PageHero 
                title="Submit a Resource" 
                subtitle="Help us grow our community resource directory by sharing resources that benefit Coppell residents"
                className="submit-resource-hero"
            />
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
                <ResourceForm />
            </div>
        </div>
    );
}
