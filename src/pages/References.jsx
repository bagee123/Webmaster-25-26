import React from 'react';
import { ExternalLink, FileText, Link as LinkIcon } from 'lucide-react';
import '../css/pages.css';

export default function References() {
  const sources = [
    {
      name: 'City of Coppell Official Website',
      url: 'https://www.coppelltx.gov',
      description: 'Official city government website with services and information'
    },
    {
      name: 'Coppell Parks and Recreation',
      url: 'https://www.coppelltx.gov/771/Parks',
      description: 'Information about parks, facilities, and recreational programs'
    },
    {
      name: 'Coppell Independent School District',
      url: 'https://www.coppellisd.com',
      description: 'School district information and educational resources'
    },
    {
      name: 'Coppell Public Library',
      url: 'https://www.coppelltx.gov/1183/Cozby-Library-Community-Commons',
      description: 'Library services, programs, and community events'
    },
    {
      name: 'Coppell Chamber of Commerce',
      url: 'https://www.coppellchamber.org',
      description: 'Local business directory and community events'
    }
  ];

  const documents = [
    {
      name: 'Student Copyright Checklist',
      filename: '1086-10 Student Copyright Checklist.pdf',
      description: 'Guidelines for ensuring proper attribution and copyright compliance'
    },
    {
      name: 'Project Work Log',
      filename: '1086-10 Work Log.pdf',
      description: 'Detailed log of project development and team contributions'
    }
  ];

  const citations = [
    {
      name: 'Lucide React',
      description: 'An open-source icon library used for UI elements',
      url: 'https://lucide.dev/license'
    },

    {
      name: 'Unsplash Images',
      description: 'Source of high-quality, royalty-free images used in the project',
      url: 'https://unsplash.com/license'
    }
  ];

  return (
    <div className="references-background">
      <div className="page-container">
        <section className="page-hero">
          <h1>References</h1>
          <p>Sources and documentation for the Coppell Community Hub project.</p>
        </section>
        
        <section className="page-content">
          <div className="content-wrapper">
          
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <LinkIcon size={24} />
              Information Sources
            </h2>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              The following resources were consulted in creating this community directory:
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {sources.map((source, index) => (
                <div 
                  key={index}
                  style={{
                    padding: '20px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: '#fafafa',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#007bff';
                    e.currentTarget.style.backgroundColor = '#f0f8ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e0e0e0';
                    e.currentTarget.style.backgroundColor = '#fafafa';
                  }}
                >
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#333' }}>
                    {source.name}
                  </h3>
                  <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: '14px' }}>
                    {source.description}
                  </p>
                  <a 
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#007bff',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    Visit Website
                    <ExternalLink size={14} />
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <FileText size={24} />
              Project Documentation
            </h2>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              Competition submission documents and project records:
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {documents.map((doc, index) => (
                <div 
                  key={index}
                  className="reference-card"
                >
                  <h3>
                    {doc.name}
                  </h3>
                  <p>
                    {doc.description}
                  </p>
                  <a 
                    href={`/${doc.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText size={14} />
                    View PDF
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <LinkIcon size={24} />
              Citations
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {citations.map((cite, index) => (
                <div 
                  key={index}
                  className="reference-card"
                >
                  <h3>
                    {cite.name}
                  </h3>
                  <p>
                    {cite.description}
                  </p>
                  <a 
                    href={cite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Website
                    <ExternalLink size={14} />
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
    </div>
  );
}