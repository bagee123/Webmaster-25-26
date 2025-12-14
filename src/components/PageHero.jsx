/**
 * Reusable Page Hero Component
 * Used across ResourceDirectory, Blog, and Events pages
 * Accepts title, subtitle, and optional className for page-specific styling
 */

import PropTypes from 'prop-types';

const PageHero = ({ title, subtitle, className = '' }) => {
  return (
    <div className={`page-hero ${className}`}>
      <div className="page-hero-content">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
};

PageHero.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  className: PropTypes.string,
};

export default PageHero;
