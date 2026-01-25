import React from 'react';
import PropTypes from 'prop-types';
import { Check, X as XIcon } from 'lucide-react';
import { validatePassword, getPasswordRequirements } from '../utils/validation';
import '../css/passwordStrengthMeter.css';

/**
 * Password Strength Meter Component
 * Displays password requirements and strength indicator
 */
function PasswordStrengthMeter({ password, showRequirements = true }) {
  if (!password) {
    return null;
  }

  const validation = validatePassword(password);
  const requirements = getPasswordRequirements();

  return (
    <div className="password-strength-container">
      {/* Strength Bar */}
      <div className="strength-bar-wrapper">
        <div className="strength-bar-container">
          <div
            className="strength-bar"
            style={{
              width: `${(validation.score / 5) * 100}%`,
              backgroundColor: validation.color,
            }}
          />
        </div>
        <span className="strength-label" style={{ color: validation.color }}>
          {validation.label}
        </span>
      </div>

      {/* Requirements List */}
      {showRequirements && (
        <div className="password-requirements">
          <p className="requirements-title">Password Requirements:</p>
          <div className="requirements-grid">
            {requirements.map((requirement) => (
              <div
                key={requirement.key}
                className={`requirement ${
                  validation.checks[requirement.key] ? 'met' : 'unmet'
                }`}
                title={requirement.description}
              >
                <span className="requirement-icon">
                  {validation.checks[requirement.key] ? (
                    <Check size={14} />
                  ) : (
                    <XIcon size={14} />
                  )}
                </span>
                <span className="requirement-text">{requirement.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Validation Message */}
      {!validation.isValid && (
        <div className="validation-message error">
          {validation.message}
        </div>
      )}
      {validation.isValid && (
        <div className="validation-message success">
          {validation.message}
        </div>
      )}
    </div>
  );
}

PasswordStrengthMeter.propTypes = {
  password: PropTypes.string.isRequired,
  showRequirements: PropTypes.bool,
};

export default PasswordStrengthMeter;
