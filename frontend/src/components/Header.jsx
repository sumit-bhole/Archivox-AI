import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'light' ? false : true;
  });
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Apply theme and save to localStorage
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const scrollTo = (id) => {
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 w-full z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        <div className="flex items-center gap-10">
          <button onClick={() => { navigate('/'); setIsOpen(false); }} className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
            Archivox
          </button>
          
          <nav className="hidden md:flex gap-6 font-medium text-slate-600 dark:text-slate-300">
            <button onClick={() => scrollTo('flow')} className="hover:text-blue-600 transition-colors">How it Works</button>
            <button onClick={() => scrollTo('about')} className="hover:text-blue-600 transition-colors">About</button>
            <button onClick={() => scrollTo('faq')} className="hover:text-blue-600 transition-colors">FAQ</button>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => navigate('/auth')} className="font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 transition">
            Log In
          </button>
          <button onClick={() => navigate('/auth')} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-transform hover:scale-105">
            Get Started
          </button>
        </div>

        <div className="md:hidden flex items-center gap-4">
          <button onClick={() => setIsDark(!isDark)} className="p-2">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4 shadow-xl">
          <button onClick={() => scrollTo('flow')} className="text-left font-bold py-2">How it Works</button>
          <button onClick={() => scrollTo('about')} className="text-left font-bold py-2">About</button>
          <button onClick={() => navigate('/auth')} className="mt-4 py-3 bg-blue-600 text-white font-bold rounded-xl w-full text-center">
            Log In / Get Started
          </button>
        </div>
      )}
    </header>
  );
}