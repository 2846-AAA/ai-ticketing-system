/**
 * CreateTicket component for creating new tickets
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketAPI } from '../services/api';
import './CreateTicket.css';

function CreateTicket() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'general'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Note: created_by_id will be set automatically by the backend
      const response = await ticketAPI.createTicket(formData);
      
      // Redirect to the newly created ticket
      navigate(`/tickets/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create ticket');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-ticket">
      <div className="card">
        <h2>Create New Ticket</h2>
        <p className="subtitle">
          🤖 Our AI will automatically analyze your ticket and assign the appropriate priority
        </p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="Brief summary of the issue"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              className="form-control"
              placeholder="Detailed description of the issue. Be specific to help our AI understand the urgency..."
              value={formData.description}
              onChange={handleChange}
              required
              rows="8"
            />
            <small className="form-hint">
              💡 Tip: Use words like "urgent", "critical", "not working" to help our AI prioritize correctly
            </small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority (Optional)</label>
              <select
                name="priority"
                className="form-control"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              <small className="form-hint">Leave as Medium to let AI decide</small>
            </div>

            <div className="form-group">
              <label>Category (Optional)</label>
              <select
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="general">General</option>
                <option value="technical">Technical</option>
                <option value="billing">Billing</option>
                <option value="feature_request">Feature Request</option>
                <option value="bug_report">Bug Report</option>
              </select>
              <small className="form-hint">AI will suggest if left as General</small>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/tickets')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTicket;
