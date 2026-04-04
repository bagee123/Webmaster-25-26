import React from 'react';
import { ExternalLink, FileText, Link as LinkIcon } from 'lucide-react';
import PageHero from '../components/PageHero';
import '../css/pages.css';
import '../css/references.css';

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
      filename: 'Webmaster Work Log - Regionals (1).pdf',
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
    <>
      <PageHero 
        title="References"
        subtitle="Sources and documentation for the Coppell Community Hub project."
      />
      
      <div className="references-content">
        <div className="content-wrapper">

          <div className = "team-number">
            <h2>Team Number</h2>
            <h3>2057-1</h3>
          </div>
          
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px', textAlign: 'center' }}>
              <LinkIcon size={24} />
              Information Sources
            </h2>
            <p style={{ marginBottom: '24px' }}>
              The following resources were consulted in creating this community directory:
            </p>
            
            <div>
              {sources.map((source, index) => (
                <div 
                  key={index}
                  className="reference-card"
                >
                  <h3>
                    {source.name}
                  </h3>
                  <p>
                    {source.description}
                  </p>
                  <a 
                    href={source.url}
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

          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px', textAlign: 'center' }}>
              <FileText size={24} />
              Project Documentation
            </h2>
            <p style={{ marginBottom: '24px' }}>
              Competition submission documents and project records:
            </p>
            
            <div>
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
            <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px', textAlign: 'center' }}>
              <LinkIcon size={24} />
              Citations
            </h2>

            <div>
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
      </div>
    </>
  );
}