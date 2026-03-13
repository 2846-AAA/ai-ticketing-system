/**
 * Dashboard component showing statistics and overview
 */
import React, { useState, useEffect } from 'react';
import { ticketAPI } from '../services/api';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [statistics, setStatistics] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, ticketsResponse] = await Promise.all([
        ticketAPI.getStatistics(),
        ticketAPI.getAllTickets({ page_size: 5 })
      ]);
      
      setStatistics(statsResponse.data);
      setRecentTickets(ticketsResponse.data.results || ticketsResponse.data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadgeClass = (priority) => {
    return `badge badge-priority-${priority}`;
  };

  const getStatusBadgeClass = (status) => {
    return `badge badge-status-${status}`;
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <h2>Dashboard Overview</h2>
      
      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{statistics?.total || 0}</div>
            <div className="stat-label">Total Tickets</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔓</div>
          <div className="stat-content">
            <div className="stat-value">{statistics?.by_status?.open || 0}</div>
            <div className="stat-label">Open Tickets</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-value">
              {(statistics?.by_priority?.critical || 0) + (statistics?.by_priority?.high || 0)}
            </div>
            <div className="stat-label">High Priority</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{statistics?.by_status?.resolved || 0}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="card mt-20">
        <h3>Status Breakdown</h3>
        <div className="breakdown-grid">
          {statistics?.by_status && Object.entries(statistics.by_status).map(([status, count]) => (
            <div key={status} className="breakdown-item">
              <span className={getStatusBadgeClass(status)}>{status.replace('_', ' ')}</span>
              <span className="breakdown-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="card mt-20">
        <div className="flex justify-between align-center mb-20">
          <h3>Recent Tickets</h3>
          <Link to="/tickets" className="btn btn-sm btn-primary">View All</Link>
        </div>
        
        {recentTickets.length === 0 ? (
          <p className="text-center">No tickets found</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Category</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.map(ticket => (
                <tr key={ticket.id}>
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
                  <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
