/**
 * Header component with navigation
 */
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <h1>🎫 AI Ticketing System</h1>
        </div>
        <nav className="header-nav">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/tickets" className="nav-link">All Tickets</Link>
          <Link to="/tickets/new" className="nav-link btn-create">+ New Ticket</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
