/**
 * TicketList component for displaying all tickets with filters
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ticketAPI } from '../services/api';
import './TicketList.css';

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    search: ''
  });

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;

      const response = await ticketAPI.getAllTickets(params);
      setTickets(response.data.results || response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load tickets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      category: '',
      search: ''
    });
  };

  const getPriorityBadgeClass = (priority) => {
    return `badge badge-priority-${priority}`;
  };

  const getStatusBadgeClass = (status) => {
    return `badge badge-status-${status}`;
  };

  return (
    <div className="ticket-list">
      <div className="flex justify-between align-center mb-20">
        <h2>All Tickets</h2>
        <Link to="/tickets/new" className="btn btn-primary">+ Create New Ticket</Link>
      </div>

      {/* Filters */}
      <div className="card filters-card">
        <h3>Filters</h3>
        <div className="filters-grid">
          <div className="form-group">
            <label>Search</label>
            <input
              type="text"
              name="search"
              className="form-control"
              placeholder="Search by title or description..."
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              className="form-control"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select
              name="priority"
              className="form-control"
              value={filters.priority}
              onChange={handleFilterChange}
            >
              <option value="">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              className="form-control"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="general">General</option>
              <option value="feature_request">Feature Request</option>
              <option value="bug_report">Bug Report</option>
            </select>
          </div>
        </div>
        
        <button onClick={clearFilters} className="btn btn-secondary btn-sm mt-20">
          Clear Filters
        </button>
      </div>

      {/* Tickets Table */}
      <div className="card mt-20">
        {loading ? (
          <div className="loading">Loading tickets...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : tickets.length === 0 ? (
          <div className="text-center">
            <p>No tickets found</p>
            <Link to="/tickets/new" className="btn btn-primary mt-20">Create First Ticket</Link>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Category</th>
                <th>Created By</th>
                <th>Created At</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id}>
                  <td>#{ticket.id}</td>
                  <td>
                    <Link to={`/tickets/${ticket.id}`} className="ticket-link">
                      {ticket.title}
                    </Link>
                  </td>
                  <td>
                    <span className={getPriorityBadgeClass(ticket.priority)}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(ticket.status)}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{ticket.category.replace('_', ' ')}</td>
                  <td>{ticket.created_by?.username || 'Unknown'}</td>
                  <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className="comment-count">{ticket.comment_count || 0}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default TicketList;
