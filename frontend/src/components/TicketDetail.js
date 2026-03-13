/**
 * TicketDetail component for viewing and managing individual tickets
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketAPI, commentAPI, historyAPI, userAPI } from '../services/api';
import './TicketDetail.css';

function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchTicketDetails();
    fetchAgents();
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const [ticketRes, commentsRes, historyRes] = await Promise.all([
        ticketAPI.getTicket(id),
        commentAPI.getComments(id),
        historyAPI.getHistory(id)
      ]);

      setTicket(ticketRes.data);
      setComments(commentsRes.data.results || commentsRes.data);
      setHistory(historyRes.data.results || historyRes.data);
      setEditData({
        status: ticketRes.data.status,
        priority: ticketRes.data.priority,
        assigned_to_id: ticketRes.data.assigned_to?.id || ''
      });
      setError(null);
    } catch (err) {
      setError('Failed to load ticket details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await userAPI.getAgents();
      setAgents(response.data);
    } catch (err) {
      console.error('Failed to load agents:', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await commentAPI.createComment({
        ticket: id,
        content: newComment
      });
      setNewComment('');
      fetchTicketDetails();
    } catch (err) {
      alert('Failed to add comment');
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    try {
      await ticketAPI.updateTicket(id, editData);
      setIsEditing(false);
      fetchTicketDetails();
    } catch (err) {
      alert('Failed to update ticket');
      console.error(err);
    }
  };

  const handleAutoRoute = async () => {
    try {
      await ticketAPI.autoRoute(id);
      fetchTicketDetails();
      alert('Ticket auto-routed successfully!');
    } catch (err) {
      alert('Failed to auto-route ticket');
      console.error(err);
    }
  };

  const handleReanalyze = async () => {
    try {
      const response = await ticketAPI.reanalyzeTicket(id);
      alert(`AI Analysis Results:\n
Sentiment Score: ${response.data.sentiment_score.toFixed(2)}
Suggested Priority: ${response.data.auto_priority}
Suggested Category: ${response.data.suggested_category}`);
      fetchTicketDetails();
    } catch (err) {
      alert('Failed to reanalyze ticket');
      console.error(err);
    }
  };

  const getPriorityBadgeClass = (priority) => `badge badge-priority-${priority}`;
  const getStatusBadgeClass = (status) => `badge badge-status-${status}`;

  if (loading) return <div className="loading">Loading ticket...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!ticket) return <div className="error">Ticket not found</div>;

  return (
    <div className="ticket-detail">
      <button onClick={() => navigate('/tickets')} className="btn btn-secondary btn-sm mb-20">
        ← Back to Tickets
      </button>

      <div className="ticket-header card">
        <div className="flex justify-between align-center">
          <div>
            <h2>{ticket.title}</h2>
            <p className="ticket-meta">
              Created by {ticket.created_by?.username} on {new Date(ticket.created_at).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-10">
            <button onClick={handleReanalyze} className="btn btn-secondary btn-sm">
              🤖 Re-Analyze
            </button>
            <button onClick={handleAutoRoute} className="btn btn-primary btn-sm">
              🎯 Auto-Route
            </button>
          </div>
        </div>
      </div>

      <div className="ticket-content-grid">
        <div className="main-content">
          <div className="card">
            <h3>Description</h3>
            <p className="ticket-description">{ticket.description}</p>
          </div>

          <div className="card">
            <h3>AI Analysis</h3>
            <div className="ai-analysis">
              <div className="analysis-item">
                <span className="analysis-label">Sentiment Score:</span>
                <span className="analysis-value">
                  {ticket.sentiment_score !== null ? ticket.sentiment_score.toFixed(2) : 'N/A'}
                  {ticket.sentiment_score < -0.3 && ' 😟'}
                  {ticket.sentiment_score >= -0.3 && ticket.sentiment_score < 0.3 && ' 😐'}
                  {ticket.sentiment_score >= 0.3 && ' 😊'}
                </span>
              </div>
              <div className="analysis-item">
                <span className="analysis-label">AI Suggested Priority:</span>
                <span className={getPriorityBadgeClass(ticket.auto_priority || 'medium')}>
                  {ticket.auto_priority || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Comments ({comments.length})</h3>
            <div className="comments-list">
              {comments.length === 0 ? (
                <p className="no-comments">No comments yet</p>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className="comment">
                    <div className="comment-header">
                      <strong>{comment.user?.username}</strong>
                      <span className="comment-date">
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="comment-content">{comment.content}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="add-comment-form">
              <textarea
                className="form-control"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows="3"
              />
              <button type="submit" className="btn btn-primary btn-sm mt-20">
                Add Comment
              </button>
            </form>
          </div>

          <div className="card">
            <h3>History</h3>
            <div className="history-list">
              {history.length === 0 ? (
                <p className="no-history">No history yet</p>
              ) : (
                history.map(item => (
                  <div key={item.id} className="history-item">
                    <span className="history-icon">📝</span>
                    <div className="history-content">
                      <p>
                        <strong>{item.user?.username || 'System'}</strong> changed{' '}
                        <strong>{item.field_changed.replace('_', ' ')}</strong>{' '}
                        from <em>{item.old_value || 'none'}</em> to{' '}
                        <em>{item.new_value}</em>
                      </p>
                      <span className="history-date">
                        {new Date(item.changed_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="card">
            <h3>Details</h3>
            
            {!isEditing ? (
              <div className="details-view">
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <span className={getStatusBadgeClass(ticket.status)}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Priority:</span>
                  <span className={getPriorityBadgeClass(ticket.priority)}>
                    {ticket.priority}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Category:</span>
                  <span>{ticket.category.replace('_', ' ')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Assigned To:</span>
                  <span>{ticket.assigned_to?.username || 'Unassigned'}</span>
                </div>
                
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', marginTop: '16px' }}
                >
                  Edit Details
                </button>
              </div>
            ) : (
              <div className="details-edit">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    className="form-control"
                    value={editData.status}
                    onChange={(e) => setEditData({...editData, status: e.target.value})}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select
                    className="form-control"
                    value={editData.priority}
                    onChange={(e) => setEditData({...editData, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Assigned To</label>
                  <select
                    className="form-control"
                    value={editData.assigned_to_id}
                    onChange={(e) => setEditData({...editData, assigned_to_id: e.target.value})}
                  >
                    <option value="">Unassigned</option>
                    {agents.map(agent => (
                      <option key={agent.id} value={agent.id}>
                        {agent.username}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-10" style={{ marginTop: '16px' }}>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="btn btn-success btn-sm"
                    style={{ flex: 1 }}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetail;
