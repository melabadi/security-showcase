import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import App from './App.jsx';
import Login from './pages/Login.jsx';
import Search from './pages/Search.jsx';
import Profile from './pages/Profile.jsx';
import Admin from './pages/Admin.jsx';
import './App.css';

// VULN: secret hardcoded in client bundle (will leak to every browser).
// These match the repo's custom secret-scanning patterns, not real
// provider formats, so they can live in source for the scanner demo
// without being blocked by push protection on commit.
export const DEMO_INTERNAL_TOKEN = 'DEMO_0123456789ABCDEFGHIJKL';
export const DEMO_SIGNING_KEY = 'SIGN-00112233445566778899AABBCCDDEEFF';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <nav className="nav">
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/search">Search</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/admin">Admin</Link>
    </nav>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/search" element={<Search />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  </BrowserRouter>
);
