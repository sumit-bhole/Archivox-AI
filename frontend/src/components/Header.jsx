
import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const links = [
  { label: 'Product', id: 'demo' },
  { label: 'Workflow', id: 'how-it-works' },
  { label: 'Capabilities', id: 'features' },
];

export default function Header() {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem('theme') !== 'light'
  );
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const goToSection = (id) => {
    setIsOpen(false);

    if (location.pathname !== '/') {
      navigate('/');
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToHome = () => {
    setIsOpen(false);
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Replace your existing goToAuth with these two functions:
  const goToSignIn = () => {
    setIsOpen(false);
    navigate('/auth?mode=signin');
  };

  const goToSignUp = () => {
    setIsOpen(false);
    navigate('/auth?mode=signup');
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#E8E4DC]/90 bg-[#FAF9F6]/90 backdrop-blur-xl dark:border-[#252D3A] dark:bg-[#0D1117]/85">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-6">
        <button
          onClick={goToHome}
          aria-label="Archivox home"
          className="flex items-center gap-2.5"
        >
          <img
            src="/archivox.svg"
            alt=""
            className="h-9 w-9"
          />
          <span className="text-xl font-bold tracking-tight text-[#242321] dark:text-[#F3F5F9]">
            Archivox
          </span>
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => goToSection(link.id)}
              className="text-sm font-medium text-[#68665F] transition-colors hover:text-indigo-600 dark:text-[#9AA6B8] dark:hover:text-indigo-300"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => setIsDark((value) => !value)}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="rounded-lg p-2.5 text-[#68665F] transition hover:bg-[#EFEEE8] dark:text-[#9AA6B8] dark:hover:bg-[#151B24]"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
    onClick={goToSignIn}
    className="px-3 py-2 text-sm font-semibold text-[#34332F] transition hover:text-indigo-600 dark:text-[#F3F5F9] dark:hover:text-indigo-300"
  >
    Sign in
  </button>
  <button
    onClick={goToSignUp}
    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 dark:bg-indigo-400 dark:text-[#111827] dark:hover:bg-indigo-300"
  >
    Get started <ArrowUpRight size={16} />
  </button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <button
            onClick={() => setIsDark((value) => !value)}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="rounded-lg p-2.5 text-[#68665F] hover:bg-[#EFEEE8] dark:text-[#9AA6B8] dark:hover:bg-[#151B24]"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => setIsOpen((value) => !value)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            className="rounded-lg p-2.5 text-[#34332F] dark:text-[#F3F5F9]"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-[#E8E4DC] bg-[#FAF9F6] px-5 py-4 dark:border-[#252D3A] dark:bg-[#0D1117] md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => goToSection(link.id)}
                className="rounded-lg px-3 py-3 text-left text-sm font-medium text-[#34332F] hover:bg-[#EFEEE8] dark:text-slate-300 dark:hover:bg-[#151B24]"
              >
                {link.label}
              </button>
            ))}

            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-[#E8E4DC] pt-4 dark:border-[#252D3A]">
              <button
    onClick={goToSignIn}
    className="rounded-lg border border-[#DEDAD1] px-4 py-3 text-sm font-semibold dark:border-[#252D3A]"
  >
    Sign in
  </button>
  <button
    onClick={goToSignUp}
    className="rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white dark:bg-indigo-400 dark:text-[#111827]"
  >
    Get started
  </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
