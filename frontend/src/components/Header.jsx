import React from 'react';
import { 
  Sparkles, 
  UtensilsCrossed, 
  TrendingUp, 
  Package, 
  Trash2, 
  ShoppingBag, 
  ShieldCheck, 
  ChefHat, 
  GraduationCap, 
  LogOut,
  LogIn,
  SlidersHorizontal
} from 'lucide-react';

export default function Header({ 
  currentTab, 
  setCurrentTab, 
  currentUser, 
  onSwitchRole, 
  onLogout,
  onOpenLogin
}) {
  const tabs = [
    { id: 'dashboard', label: 'Executive Insights', icon: TrendingUp, roles: ['ADMIN', 'STAFF'] },
    { id: 'prediction', label: 'AI Demand Forecast', icon: Sparkles, roles: ['ADMIN', 'STAFF'] },
    { id: 'kitchen', label: 'Kitchen Prep', icon: ChefHat, roles: ['ADMIN', 'STAFF'] },
    { id: 'inventory', label: 'Inventory & Stock', icon: Package, roles: ['ADMIN', 'STAFF'] },
    { id: 'waste', label: 'Food Waste Audit', icon: Trash2, roles: ['ADMIN', 'STAFF'] },
    { id: 'menu_manage', label: 'Menu Catalog', icon: SlidersHorizontal, roles: ['ADMIN', 'STAFF'] },
    { id: 'student_order', label: 'Pre-Order & RSVP', icon: ShoppingBag, roles: ['STUDENT', 'ADMIN', 'STAFF'] },
  ];

  const userRole = (currentUser && typeof currentUser === 'object' && currentUser.role) ? currentUser.role : 'ADMIN';
  const visibleTabs = tabs.filter(t => !currentUser || t.roles.includes(userRole));

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">SmartCanteen</span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-500" /> AI Demand Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Demand Prediction • Inventory Optimization • Zero Food Waste</p>
            </div>
          </div>

          {/* User profile & Demo Quick Switcher */}
          <div className="flex items-center gap-3">
            {currentUser && typeof currentUser === 'object' && currentUser.name ? (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1.5 px-3">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  {userRole === 'ADMIN' && <ShieldCheck className="w-4 h-4 text-purple-600" />}
                  {userRole === 'STAFF' && <ChefHat className="w-4 h-4 text-amber-600" />}
                  {userRole === 'STUDENT' && <GraduationCap className="w-4 h-4 text-blue-600" />}
                  <span>{currentUser.name}</span>
                  <span className="text-slate-400">|</span>
                  <span className="font-bold uppercase tracking-wider text-[10px] bg-slate-200 px-1.5 py-0.5 rounded">
                    {userRole}
                  </span>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition"
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In
              </button>
            )}

            {/* Quick Demo Switcher */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <span className="text-[11px] font-semibold text-slate-400 px-1.5">Demo:</span>
              <button 
                onClick={() => onSwitchRole('ADMIN')}
                className={`px-2 py-1 rounded font-medium transition ${userRole === 'ADMIN' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Admin
              </button>
              <button 
                onClick={() => onSwitchRole('STAFF')}
                className={`px-2 py-1 rounded font-medium transition ${userRole === 'STAFF' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Chef/Staff
              </button>
              <button 
                onClick={() => onSwitchRole('STUDENT')}
                className={`px-2 py-1 rounded font-medium transition ${userRole === 'STUDENT' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Student
              </button>
            </div>

            {currentUser && (
              <button 
                onClick={onLogout}
                title="Logout"
                className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto space-x-1 pb-2 scrollbar-none border-t border-slate-100 pt-1">
          {visibleTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
