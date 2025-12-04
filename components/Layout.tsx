import React, { useState } from 'react';
import { Menu, X, Book, Headphones, Gamepad2, User, LayoutDashboard, Settings } from 'lucide-react';
import { useData } from '../context/DataContext';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useData();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vocab', label: 'Vocabulary', icon: Book },
    { id: 'listening', label: 'Listening', icon: Headphones },
    { id: 'games', label: 'Games & Practice', icon: Gamepad2 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-slate-800 font-sans overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-6 flex items-center gap-2 border-b border-gray-100">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <span className="text-xl font-bold text-gray-800">LinguaFlow</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentPage === item.id
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
           <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg">
             <div className="flex-1">
               <p className="text-xs font-medium opacity-80">Weekly Goal</p>
               <div className="w-full bg-white/30 h-1.5 rounded-full mt-1">
                 <div className="bg-white h-1.5 rounded-full w-3/5"></div>
               </div>
             </div>
             <span className="text-sm font-bold">60%</span>
           </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 flex justify-between items-center border-b">
          <span className="text-xl font-bold text-gray-800">LinguaFlow</span>
          <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-2">
           {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                currentPage === item.id
                  ? 'bg-indigo-50 text-indigo-600 font-medium'
                  : 'text-gray-600'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 capitalize hidden sm:block">
              {navItems.find(n => n.id === currentPage)?.label}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-sm font-medium border border-orange-100 hidden sm:flex">
               <span>🔥</span>
               <span>12 Day Streak</span>
             </div>
             <button onClick={() => onNavigate('profile')} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
               <Settings size={20} />
             </button>
             <div onClick={() => onNavigate('profile')} className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden border border-gray-300 cursor-pointer">
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
             </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;