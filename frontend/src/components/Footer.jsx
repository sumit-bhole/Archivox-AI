
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const goToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-[#E8E4DC] bg-[#F4F2EC] dark:border-[#252D3A] dark:bg-[#0D1117]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="grid gap-10 py-12 sm:grid-cols-2 sm:items-start">
          <div>
            <button
              onClick={() => {
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5"
              aria-label="Archivox home"
            >
              <img src="/archivox.svg" alt="" className="h-9 w-9" />
              <span className="text-lg font-bold tracking-tight text-[#242321] dark:text-slate-100">
                Archivox
              </span>
            </button>

            <p className="mt-4 max-w-sm text-sm leading-6 text-[#68665F] dark:text-slate-400">
              Turn client conversations into clearer project briefs.
            </p>
          </div>

          <div className="sm:justify-self-end">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#8A867D] dark:text-slate-500">
              Explore
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#55534D] dark:text-slate-400">
              <button
                onClick={() => goToSection('demo')}
                className="transition hover:text-indigo-600 dark:hover:text-indigo-300"
              >
                Product
              </button>
              <button
                onClick={() => goToSection('how-it-works')}
                className="transition hover:text-indigo-600 dark:hover:text-indigo-300"
              >
                Workflow
              </button>
              <button
                onClick={() => goToSection('features')}
                className="transition hover:text-indigo-600 dark:hover:text-indigo-300"
              >
                Capabilities
              </button>
              // Find the "Sign in" button in your Footer.jsx and update its onClick:
  <button
    onClick={() => navigate('/auth?mode=signin')}
    className="inline-flex items-center gap-1 transition hover:text-indigo-600 dark:hover:text-indigo-300"
  >
    Sign in <ArrowUpRight size={14} />
  </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#E2DED5] py-5 text-xs text-[#858177] sm:flex-row sm:items-center sm:justify-between dark:border-[#252D3A] dark:text-slate-500">
          <span>© {new Date().getFullYear()} Archivox</span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex w-fit items-center gap-2 transition hover:text-indigo-600 dark:hover:text-indigo-300"
          >
            Back to top <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
