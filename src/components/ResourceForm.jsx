import React, { useState } from 'react';
import '../css/resourceForm.css';
export default function ResourceForm(){
  const [formData, setFormData] = useState({firstName: '', lastName: '', resourceName: '', website: '', category: '', description: ''});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ firstName: '', lastName: '', resourceName: '', website: '', category: '', description: '' });
  };

  return(
    <div className="resource-form-container">
      <div className="resource-form">
        <h2 className = "resource-form__title">Submit a Resource</h2>
        <form className="resource-form__form" onSubmit={handleSubmit}>
          <div className="resource-form__field">
            <label className="resource-form__label">First Name</label>
            <input
              className="resource-form__input"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              required
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
              placeholder="Enter your last name"
              required
            />
          </div>

          <div className="resource-form__field">
            <label className="resource-form__label">Resource Name</label>
            <input
              className="resource-form__input"
              type="text"
              name="resourceName"
              value={formData.resourceName}
              onChange={handleChange}
              placeholder="Enter the resource name"
              required
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
              placeholder="Enter the website URL or contact information"
              required
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
            >
              <option value="">Select a category</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Volunteering">Volunteering</option>
              <option value="Events">Events</option>
              <option value="Support Services">Support Services</option>
              <option value="Recreation">Recreation</option>
              <option value="Nonprofits">Nonprofits</option>
            </select>
          </div>

          <div className="resource-form__field">
            <label className="resource-form__label">Short Description</label>
            <textarea
              className="resource-form__textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a brief description"
              required
            ></textarea>
          </div>
          <button type="submit" className="resource-form__submit">Submit Resource</button>
          </form>
      </div>
    </div>
  );
}