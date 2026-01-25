import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Save, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import PageHero from '../components/PageHero';
import '../css/admin.css';

export default function AdminResources() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'health',
    description: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    hours: '',
  });

  const categories = [
    'health',
    'education',
    'volunteering',
    'events',
    'support',
    'recreation',
    'nonprofits',
    'housing',
  ];

  // Check if user is admin
  useEffect(() => {
    if (!authLoading && user) {
      user.getIdTokenResult().then((idTokenResult) => {
        setIsAdmin(idTokenResult.claims.admin === true);
      }).catch(() => {
        setIsAdmin(false);
      });
    }
  }, [user, authLoading]);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !isAdmin && !user) {
      navigate('/login');
    }
  }, [authLoading, isAdmin, user, navigate]);

  // Load resources from Firestore
  useEffect(() => {
    if (!isAdmin) return;

    setLoading(true);
    try {
      const resourcesCollection = collection(db, 'resources');
      const q = query(resourcesCollection, orderBy('id', 'asc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const resourcesData = snapshot.docs.map(doc => ({
          docId: doc.id,
          ...doc.data(),
        }));
        setResources(resourcesData);
        setLoading(false);
      }, (error) => {
        console.error('Error loading resources:', error);
        setError('Failed to load resources');
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up listener:', err);
      setError('Failed to set up resources listener');
      setLoading(false);
    }
  }, [isAdmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.category || !formData.description.trim()) {
      setError('Name, category, and description are required');
      return;
    }

    try {
      if (editingId) {
        // Update existing resource
        const resourceRef = doc(db, 'resources', editingId);
        await updateDoc(resourceRef, {
          ...formData,
          updatedAt: new Date(),
        });
        setSuccess('Resource updated successfully!');
      } else {
        // Add new resource
        const newId = resources.length > 0 
          ? Math.max(...resources.map(r => r.id || 0)) + 1 
          : 1;

        await addDoc(collection(db, 'resources'), {
          id: newId,
          ...formData,
          createdAt: new Date(),
        });
        setSuccess('Resource created successfully!');
      }

      // Reset form
      setFormData({
        name: '',
        category: 'health',
        description: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        hours: '',
      });
      setEditingId(null);
      setShowForm(false);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving resource:', err);
      setError('Failed to save resource');
    }
  };

  const handleEdit = (resource) => {
    setFormData({
      name: resource.name,
      category: resource.category,
      description: resource.description,
      phone: resource.phone || '',
      email: resource.email || '',
      website: resource.website || '',
      address: resource.address || '',
      hours: resource.hours || '',
    });
    setEditingId(resource.docId);
    setShowForm(true);
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'resources', docId));
      setSuccess('Resource deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting resource:', err);
      setError('Failed to delete resource');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      category: 'health',
      description: '',
      phone: '',
      email: '',
      website: '',
      address: '',
      hours: '',
    });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  // Show loading while checking admin status
  if (authLoading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Show not admin
  if (!isAdmin) {
    return (
      <>
        <PageHero
          title="Admin Dashboard"
          subtitle="Manage community resources"
          className="admin-hero"
        />
        <div className="admin-container">
          <div className="admin-unauthorized">
            <AlertCircle size={48} className="admin-icon" />
            <h2>Access Denied</h2>
            <p>You do not have permission to access this page.</p>
            <button onClick={() => navigate('/')} className="admin-btn-primary">
              Return to Home
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHero
        title="Admin Dashboard"
        subtitle="Manage community resources and keep data updated"
        className="admin-hero"
      />

      <div className="admin-container">
        {/* Alerts */}
        {error && (
          <div className="admin-alert error">
            <AlertCircle size={18} />
            <span>{error}</span>
            <button onClick={() => setError('')} className="alert-close">
              <X size={16} />
            </button>
          </div>
        )}

        {success && (
          <div className="admin-alert success">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        {/* Header */}
        <div className="admin-header">
          <h1>Resource Manager</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="admin-btn-primary"
          >
            <Plus size={18} />
            {showForm ? 'Cancel' : 'Add Resource'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="admin-form-container">
            <h2>{editingId ? 'Edit Resource' : 'Create New Resource'}</h2>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Resource name"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detailed description of the resource"
                  rows="4"
                  disabled={loading}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(123) 456-7890"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="info@example.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="www.example.com"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main St, Coppell, TX"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="hours">Hours</label>
                <input
                  id="hours"
                  type="text"
                  name="hours"
                  value={formData.hours}
                  onChange={handleChange}
                  placeholder="Mon-Fri 9AM-5PM"
                  disabled={loading}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="admin-btn-secondary"
                  disabled={loading}
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary"
                  disabled={loading}
                >
                  <Save size={16} />
                  {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Resources List */}
        <div className="admin-resources">
          {loading ? (
            <div className="admin-loading-state">
              <div className="admin-spinner"></div>
              <p>Loading resources...</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="admin-empty-state">
              <AlertCircle size={48} />
              <p>No resources yet. Create one to get started!</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map(resource => (
                  <tr key={resource.docId}>
                    <td className="name-cell">
                      <strong>{resource.name}</strong>
                      <p className="description-preview">{resource.description.substring(0, 50)}...</p>
                    </td>
                    <td>
                      <span className="category-badge" data-category={resource.category}>
                        {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="contact-cell">
                        {resource.phone && <div>{resource.phone}</div>}
                        {resource.email && <div>{resource.email}</div>}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(resource)}
                          className="admin-btn-edit"
                          title="Edit"
                          disabled={loading}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(resource.docId)}
                          className="admin-btn-delete"
                          title="Delete"
                          disabled={loading}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && resources.length > 0 && (
            <div className="admin-stats">
              <p>Total resources: <strong>{resources.length}</strong></p>
              <div className="category-breakdown">
                {categories.map(cat => {
                  const count = resources.filter(r => r.category === cat).length;
                  return count > 0 && (
                    <span key={cat} className="stat-item">
                      {cat}: <strong>{count}</strong>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
