import React, { useState, useEffect, Component } from 'react';
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

// Error Boundary to prevent any blank page crashes
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl max-w-md w-full text-center space-y-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <h2 className="text-lg font-bold text-slate-900">Application Notice</h2>
            <p className="text-xs text-slate-500">
              An unexpected render issue occurred while loading this view. Click below to safely restore default state.
            </p>
            <button
              onClick={this.handleReset}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-xs"
            >
              Reset Session & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('sc_user');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && parsed.role) return parsed;
      }
    } catch {}
    return {
      id: 1,
      name: 'Canteen Administrator',
      email: 'admin@smartcanteen.com',
      role: 'ADMIN'
    };
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    // Attempt to verify session from token if present and backend is online
    const checkSession = async () => {
      const token = localStorage.getItem('smartcanteen_token');
      if (token && !token.startsWith('demo-jwt-')) {
        try {
          const res = await api.get('/auth/me');
          if (res.data && typeof res.data === 'object' && res.data.role) {
            setCurrentUser(res.data);
            localStorage.setItem('sc_user', JSON.stringify(res.data));
          }
        } catch (e) {
          console.warn('Backend session verification skipped, retaining active user', e);
        }
      }
    };
    checkSession();
  }, []);

  const handleSwitchRole = (newRole) => {
    let userObj;
    if (newRole === 'ADMIN') {
      userObj = { id: 1, name: 'Canteen Administrator', email: 'admin@smartcanteen.com', role: 'ADMIN' };
      setCurrentTab('dashboard');
    } else if (newRole === 'STAFF') {
      userObj = { id: 2, name: 'Head Chef Ramesh', email: 'chef@smartcanteen.com', role: 'STAFF' };
      setCurrentTab('kitchen');
    } else if (newRole === 'STUDENT') {
      userObj = { id: 3, name: 'Aarav Sharma (Student)', email: 'student@smartcanteen.com', role: 'STUDENT' };
      setCurrentTab('student_order');
    }
    if (userObj) {
      setCurrentUser(userObj);
      localStorage.setItem('sc_user', JSON.stringify(userObj));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('smartcanteen_token');
    localStorage.removeItem('sc_user');
    setCurrentUser(null);
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (user) => {
    if (user && typeof user === 'object') {
      setCurrentUser(user);
      localStorage.setItem('sc_user', JSON.stringify(user));
      if (user.role === 'STUDENT') {
        setCurrentTab('student_order');
      } else {
        setCurrentTab('dashboard');
      }
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <Header
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          currentUser={currentUser}
          onSwitchRole={handleSwitchRole}
          onLogout={handleLogout}
          onOpenLogin={() => setIsLoginModalOpen(true)}
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
    </ErrorBoundary>
  );
}
