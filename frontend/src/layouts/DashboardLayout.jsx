import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { LayoutDashboard, Link as LinkIcon, Briefcase, FileText, Activity, Settings, LogOut, Menu, X, Sun, Moon } from 'lucide-react';

export default function DashboardLayout() {
  const [workspace, setWorkspace] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') !== 'light');
  const profileRef = useRef();
  
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
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchWorkspace = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate('/auth');

      const { data: membership } = await supabase.from('workspace_members').select('workspace_id').eq('user_id', user.id).single();
      if (!membership) return navigate('/onboarding');

      const { data: wsData } = await supabase.from('workspaces').select('*').eq('id', membership.workspace_id).single();
      if (wsData) setWorkspace(wsData);
    };
    fetchWorkspace();
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
  ];

  if (!workspace) return <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#0A0A0A] text-zinc-500">Loading...</div>;

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-[#000000] font-sans text-zinc-900 dark:text-white selection:bg-zinc-200 dark:selection:bg-zinc-800">
      
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-zinc-900/80 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#0A0A0A] border-r border-zinc-200 dark:border-zinc-900 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-900 justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src="/archivox.svg" alt="Archivox Logo" className="w-6 h-6" />
            <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">Archivox</span>
          </Link>
          <button className="md:hidden text-zinc-500 dark:text-zinc-400" onClick={() => setSidebarOpen(false)}><X size={20}/></button>
        </div>

        <div className="p-4 flex flex-col h-[calc(100vh-64px)] justify-between">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.name} to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${isActive ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-white' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-white'}`}>
                  <item.icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 flex items-center justify-between px-6 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-900 z-30">
          <div className="flex items-center">
             <button className="md:hidden text-zinc-500 dark:text-zinc-400 mr-4" onClick={() => setSidebarOpen(true)}><Menu size={20}/></button>
          </div>
          
          <div className="flex items-center gap-4 relative" ref={profileRef}>
            <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-md text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900 transition-colors">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button onClick={() => setProfileOpen(!profileOpen)} className="w-8 h-8 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black border border-zinc-200 dark:border-zinc-800 flex items-center justify-center font-semibold text-xs transition hover:opacity-90">
              {workspace.name.charAt(0).toUpperCase()}
            </button>
            
            {profileOpen && (
              <div className="absolute right-0 top-12 mt-1 w-56 bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl py-1 z-50">
                <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{workspace.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">{workspace.workspace_type}</p>
                </div>
                <div className="py-1">
                  <Link to="/dashboard/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white transition-colors">
                    <Settings size={16}/> Workspace Settings
                  </Link>
                </div>
                <div className="border-t border-zinc-200 dark:border-zinc-800 py-1">
                  <button onClick={handleLogout} className="flex items-center w-full gap-2 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white transition-colors">
                    <LogOut size={16}/> Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet context={{ workspace }} />
        </div>
      </main>
    </div>
  );
}