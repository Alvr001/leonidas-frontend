import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import GroupsPage from './pages/GroupsPage';
import ChatPage from './pages/ChatPage';
import './App.css';

function App() {
  const userId = localStorage.getItem('userId');
  return (
    <Router>
      <Routes>
        <Route path="/" element={userId ? <Navigate to="/groups" /> : <LoginPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/chat/:groupId" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;