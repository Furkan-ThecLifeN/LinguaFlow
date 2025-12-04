import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Vocabulary from './pages/Vocabulary';
import Listening from './pages/Listening';
import Games from './pages/Games';
import Profile from './pages/Profile';
import { DataProvider } from './context/DataContext';
import { MemoryRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// Wrapper to handle navigation state within the Router context
const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState('dashboard');

  useEffect(() => {
    const path = location.pathname.substring(1) || 'dashboard';
    setCurrentPath(path);
  }, [location]);

  const handleNavigate = (page: string) => {
    setCurrentPath(page);
    navigate(`/${page}`);
  };

  return (
    <Layout currentPage={currentPath} onNavigate={handleNavigate}>
      <Routes>
        <Route path="/" element={<Dashboard onNavigate={handleNavigate} />} />
        <Route path="/dashboard" element={<Dashboard onNavigate={handleNavigate} />} />
        <Route path="/vocab" element={<Vocabulary />} />
        <Route path="/listening" element={<Listening />} />
        <Route path="/games" element={<Games />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <MemoryRouter>
        <AppContent />
      </MemoryRouter>
    </DataProvider>
  );
};

export default App;