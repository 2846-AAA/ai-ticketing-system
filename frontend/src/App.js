/**
 * Main App component with routing
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Dashboard from './components/Dashboard';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import CreateTicket from './components/CreateTicket';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tickets" element={<TicketList />} />
            <Route path="/tickets/new" element={<CreateTicket />} />
            <Route path="/tickets/:id" element={<TicketDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
