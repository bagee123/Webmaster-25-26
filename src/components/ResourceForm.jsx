import React, { useState } from 'react';
import '../css/resourceForm.css';
import { db } from '../config/firebase';
import { collection, addDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

// Validation helper functions
const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(url); // Phone pattern
  }
};

const sanitizeInput = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, 500); // Limit length and trim
};

export default function ResourceForm(){
  const [formData, setFormData] = useState({firstName: '', lastName: '', resourceName: '', website: '', category: '', description: ''});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on new input
  }

  const validateForm = () => {
    const { firstName, lastName, resourceName, website, category, description } = formData;
    
    if (!firstName.trim() || firstName.length > 100) {
      setError('First name is required and must be less than 100 characters');
      return false;
    }
    
    if (!lastName.trim() || lastName.length > 100) {
      setError('Last name is required and must be less than 100 characters');
      return false;
    }
    
    if (!resourceName.trim() || resourceName.length > 200) {
      setError('Resource name is required and must be less than 200 characters');
      return false;
    }
    
    if (!website.trim() || !validateUrl(website)) {
      setError('Please enter a valid website URL or phone number');
      return false;
    }
    
    if (!category) {
      setError('Please select a category');
      return false;
    }
    
    if (!description.trim() || description.length < 10 || description.length > 5000) {
      setError('Description must be between 10 and 5000 characters');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "submissions"), {
        firstName: sanitizeInput(formData.firstName),
        lastName: sanitizeInput(formData.lastName),
        resourceName: sanitizeInput(formData.resourceName),
        website: sanitizeInput(formData.website),
        category: formData.category,
        description: sanitizeInput(formData.description),
        timestamp: Timestamp.now()
      });
      setFormData({firstName: '', lastName: '', resourceName: '', website: '', category: '', description: ''});
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error){
      if(error.code == 'permission-denied'){
        setError("Please login to submit a resource.")
      }

      else{
        setError('Failed to submit resource. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return(
    <div className="resource-form-container">
      <div className={`resource-form ${isSubmitting ? 'resource-form--submitted' : ''}`}>
        <h2 className="resource-form__title">Share a Resource</h2>
        {error && <div className="resource-form__error" style={{color: '#dc2626', padding: '12px', marginBottom: '16px', backgroundColor: '#fee2e2', borderRadius: '8px'}}>{error}</div>}
        {success && <div className="resource-form__success" style={{color: '#059669', padding: '12px', marginBottom: '16px', backgroundColor: '#d1fae5', borderRadius: '8px'}}>Resource submitted successfully!</div>}
        <form className="resource-form__form" onSubmit={handleSubmit}>
          <div className="resource-form__row">
            <div className="resource-form__field">
              <label className="resource-form__label">First Name</label>
              <input
                className="resource-form__input"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                required
                maxLength={100}
                disabled={isSubmitting}
              />
            </div>

            <div className="resource-form__field">
              <label className="resource-form__label">Last Name</label>
              <input
                className="resource-form__input"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
                maxLength={100}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="resource-form__field">
            <label className="resource-form__label">Resource Name</label>
            <input
              className="resource-form__input"
              type="text"
              name="resourceName"
              value={formData.resourceName}
              onChange={handleChange}
              placeholder="e.g., Community Garden Initiative"
              required
              maxLength={200}
              disabled={isSubmitting}
            />
          </div>

          <div className="resource-form__field">
            <label className="resource-form__label">Website or Contact Info</label>
            <input
              className="resource-form__input"
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com or (555) 000-0000"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="resource-form__field">
            <label className="resource-form__label">Resource Category</label>
            <select
              className="resource-form__input"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            >
              <option value="">Select a category</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Volunteering">Volunteering</option>
              <option value="Events">Events</option>
              <option value="Support Services">Support Services</option>
              <option value="Recreation">Recreation</option>
              <option value="Nonprofits">Nonprofits</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="resource-form__field">
            <label className="resource-form__label">Short Description</label>
            <textarea
              className="resource-form__textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about this resource and how it helps the community..."
              required
              maxLength={5000}
              disabled={isSubmitting}
            ></textarea>
            <div className="char-count">{formData.description.length}/5000</div>
          </div>
          <button type="submit" className="resource-form__submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Resource'}
          </button>
          </form>
      </div>
    </div>
  );
}