import React, { useState } from 'react';
import '../css/resourceForm.css';
export default function ResourceForm(){
  const [formData, setFormData] = useState({firstName: '', lastName: '', resourceName: '', website: '', category: '', description: ''});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("https://script.google.com/macros/s/AKfycbwMLj97yo1CJB9If_hLUsTUvrTpadBnDhwjAI51dGsVUiwCGFbNrA23maTF8y9LUy8tSg/exec", {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "text/plain"
        }
      });

      // Animation plays, then reset form after 2.5 seconds
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          resourceName: '',
          website: '',
          category: '',
          description: '',
        });
        setIsSubmitting(false);
      }, 2500);

    } catch (err) {
      console.error("Error submitting form:", err);
      setIsSubmitting(false);
    }
  };

  return(
    <div className="resource-form-container">
      <div className={`resource-form ${isSubmitting ? 'resource-form--submitted' : ''}`}>
        <h2 className="resource-form__title">Share a Resource</h2>
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
              disabled={isSubmitting}
            ></textarea>
          </div>
          <button type="submit" className="resource-form__submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Resource'}
          </button>
          </form>
      </div>
    </div>
  );
}