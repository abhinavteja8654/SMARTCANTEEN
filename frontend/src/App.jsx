import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import PredictionView from './components/PredictionView';
import KitchenScheduleView from './components/KitchenScheduleView';
import InventoryView from './components/InventoryView';
import WasteAnalyticsView from './components/WasteAnalyticsView';
import StudentMenuView from './components/StudentMenuView';
import MenuManagementView from './components/MenuManagementView';
import LoginModal from './components/LoginModal';
import api from './api';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: 'Canteen Administrator',
    email: 'admin@smartcanteen.com',
    role: 'ADMIN'
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    // Attempt to verify session from token if present
    const checkSession = async () => {
      const token = localStorage.getItem('smartcanteen_token');
      if (token && token !== 'demo-jwt-token') {
        try {
          const res = await api.get('/auth/me');
          setCurrentUser(res.data);
        } catch (e) {
          console.warn('Session verification failed, retaining active demo user', e);
        }
      }
    };
    checkSession();
  }, []);

  const handleSwitchRole = (newRole) => {
    if (newRole === 'ADMIN') {
      setCurrentUser({ id: 1, name: 'Canteen Administrator', email: 'admin@smartcanteen.com', role: 'ADMIN' });
      setCurrentTab('dashboard');
    } else if (newRole === 'STAFF') {
      setCurrentUser({ id: 2, name: 'Head Chef Ramesh', email: 'chef@smartcanteen.com', role: 'STAFF' });
      setCurrentTab('kitchen');
    } else if (newRole === 'STUDENT') {
      setCurrentUser({ id: 3, name: 'Aarav Sharma (Student)', email: 'student@smartcanteen.com', role: 'STUDENT' });
      setCurrentTab('student_order');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('smartcanteen_token');
    setCurrentUser(null);
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'STUDENT') {
      setCurrentTab('student_order');
    } else {
      setCurrentTab('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {currentTab === 'dashboard' && <DashboardView onNavigateTo={setCurrentTab} />}
        {currentTab === 'prediction' && <PredictionView onNavigateTo={setCurrentTab} />}
        {currentTab === 'kitchen' && <KitchenScheduleView />}
        {currentTab === 'inventory' && <InventoryView />}
        {currentTab === 'waste' && <WasteAnalyticsView />}
        {currentTab === 'menu_manage' && <MenuManagementView />}
        {currentTab === 'student_order' && <StudentMenuView currentUser={currentUser} />}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Smart Canteen System — Powered by AI Demand Prediction & Waste Minimization.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Spring Boot 3.3.4 (Java 17)</span>
            <span>•</span>
            <span>React + Vite + Tailwind CSS</span>
            <span>•</span>
            <span>MySQL 8.0</span>
          </div>
        </div>
      </footer>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
