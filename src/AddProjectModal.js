import React, { useState } from 'react';
import './AddProjectModal.css'; // Optional CSS for styling

const AddProjectModal = ({ isOpen, onClose, onAddProject }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Active'); // Default type
  const [lead, setLead] = useState('');
  const [category, setCategory] = useState('Code'); // Default category
  const [url, setUrl] = useState(''); // URL is optional
  const [error, setError] = useState(''); // State for error message

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !lead) {
      setError('Please fill out all required fields.');
      return;
    }
    setError(''); // Clear error message if validation passes
    
    // Call the function to add the project
    onAddProject({ 
      name, 
      type, 
      lead, 
      category, 
      url: url || null // Set URL to null if empty
    });

    // Close the modal
    onClose(); 
  };

  if (!isOpen) return null; // Don't render anything if the modal is not open

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add a New Project</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="project-name">Project Name*</label>
            <input
              id="project-name"
              type="text"
              placeholder="Enter project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="project-type">Project Status*</label>
            <select
              id="project-status"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="project-lead">Project Lead*</label>
            <input
              id="project-lead"
              type="text"
              placeholder="Enter project lead's name"
              value={lead}
              onChange={(e) => setLead(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="project-category">Project Category*</label>
            <select
              id="project-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Code">Code</option>
              <option value="Business">Business</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="project-url">Project URL (optional)</label>
            <input
              id="project-url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="button-group">
            <button type="submit">Create Project</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
