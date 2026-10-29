import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { LayoutDashboard, Link as LinkIcon, Briefcase, FileText, Activity, Settings, LogOut, Sun, Moon, Menu, X } from 'lucide-react';

export default function DashboardLayout() {
  const [profile, setProfile] = useState(null);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') !== 'light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate('/auth');

      const { data } = await supabase.from('agencies').select('*').eq('id', user.id).single();
      if (data) setProfile(data);
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Intake Links', path: '/dashboard/links', icon: LinkIcon },
    { name: 'Leads & Projects', path: '/dashboard/leads', icon: Briefcase },
    { name: 'Blueprints', path: '/dashboard/blueprints', icon: FileText },
    { name: 'Activity', path: '/dashboard/activity', icon: Activity },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0B0F19]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#111827] border-r border-slate-200 dark:border-slate-800/60 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800/60 justify-between">
          <Link to="/dashboard" className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500">
            Archivox
          </Link>
          <button className="md:hidden text-slate-500" onClick={() => setSidebarOpen(false)}><X size={20}/></button>
        </div>

        <div className="p-4">
          <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Workspace</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.name} to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${isActive ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'}`}>
                  <item.icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-200 dark:border-slate-800/60">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-lg transition-colors font-medium text-sm text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400">
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white/50 dark:bg-[#111827]/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/60">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-500" onClick={() => setSidebarOpen(true)}><Menu size={24}/></button>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 hidden md:block">
              {profile?.company_name || 'Loading Workspace...'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {profile?.company_name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <Outlet context={{ profile }} />
        </div>
      </main>
    </div>
  );
}