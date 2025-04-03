import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import NotesLibrary from './pages/NotesLibrary';
import PaymentStatus from './components/PaymentStatus';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/library" element={<NotesLibrary />} />
          <Route path="/payment/success" element={<PaymentStatus status="success" />} />
          <Route path="/payment/failure" element={<PaymentStatus status="failure" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;