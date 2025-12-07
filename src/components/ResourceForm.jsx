import { useState } from 'react';

export default function ResourceForm() {
  return (
    <div>
      <h2>Submit a Resource</h2>
      <form>
        <div>
          <label>First Name</label>
          <input type="text" placeholder="Enter your first name" />
        </div>

        <div>
          <label>Last Name</label>
          <input type="text" placeholder="Enter your last name" />
        </div>

        <div>
          <label>Resource Name</label>
          <input type="text" placeholder="Enter the resource name" />
        </div>

        <div>
          <label>Website or Contact Info</label>
          <input type="text" placeholder="Enter the website URL or contact information" />
        </div>

        <div>
          <label>Resource Category</label>
          <select>
            <option>Select a category</option>
          </select>
        </div>

        <div>
          <label>Short Description</label>
          <textarea placeholder = "Enter a brief description"></textarea>
        </div>

        <button type="submit">Submit Resource</button>
      </form>
    </div>
  );
}