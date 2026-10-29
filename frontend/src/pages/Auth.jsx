import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { Mail, Lock, Building2, User, ArrowRight, Loader2, Sparkles, ArrowLeft } from 'lucide-react';

export default function Auth() {
  const [searchParams] = useSearchParams();
  // Automatically switch between Sign In and Sign Up based on the URL parameter
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') === 'signin');

  // Update state if the user clicks a different link while already on the auth page
  useEffect(() => {
    setIsLogin(searchParams.get('mode') === 'signin');
  }, [searchParams]);

  const [role, setRole] = useState('organization'); 
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // PRESERVED: Your exact working backend logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        navigate('/dashboard');
      } else {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });
        if (authError) throw authError;

        if (authData?.user) {
          const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
          const response = await fetch(`${API_BASE_URL}/api/agencies/create-profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: authData.user.id,
              agency_name: formData.name,
              email: formData.email
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Backend failed to create profile");
          }
          
          navigate('/dashboard');
        }
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    navigate(`/auth?mode=${isLogin ? 'signup' : 'signin'}`, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F7F5F0] dark:bg-[#0D1117] font-sans selection:bg-indigo-200 dark:selection:bg-indigo-400/30 text-[#292821] dark:text-[#F3F5F9]">
      
      {/* LEFT PANEL: Branding & Visuals (Hidden on Mobile) */}
      <div className="hidden lg:flex w-5/12 bg-[#0D1117] border-r border-[#252D3A] p-12 flex-col justify-between relative overflow-hidden text-white">
        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-500/20 via-[#0D1117]/0 to-[#0D1117]/0"></div>
        
        <div className="relative z-10 flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="9" height="9" className="fill-indigo-500" rx="2" />
            <rect x="13" y="2" width="9" height="20" className="fill-white" rx="2" />
            <rect x="2" y="13" width="9" height="9" className="fill-slate-500" rx="2" />
          </svg>
          <span className="text-2xl font-bold tracking-tight">Archivox</span>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 mb-6">
            <Sparkles size={14} /> AI-Powered Discovery
          </div>
          <h1 className="text-4xl font-bold mb-6 leading-[1.15]">
            Every great build starts with a better brief.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Stop guessing what the client meant. Turn natural conversations into structured technical blueprints instantly.
          </p>
        </div>

        <div className="relative z-10 text-sm font-medium text-slate-500">
          © {new Date().getFullYear()} Archivox Inc.
        </div>
      </div>

      {/* RIGHT PANEL: Form Area */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-12 relative min-h-screen lg:min-h-0">
        
        {/* Mobile Logo & Back Button */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center lg:hidden">
           <button onClick={() => navigate('/')} className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400">
             <ArrowLeft size={24} />
           </button>
           <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="9" height="9" className="fill-indigo-600 dark:fill-indigo-400" rx="2" />
              <rect x="13" y="2" width="9" height="20" className="fill-[#111827] dark:fill-white" rx="2" />
              <rect x="2" y="13" width="9" height="9" className="fill-slate-400 dark:fill-slate-500" rx="2" />
            </svg>
            <span className="text-xl font-bold tracking-tight">Archivox</span>
          </div>
        </div>

        <div className="w-full max-w-md">
          
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2 text-[#111827] dark:text-white">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-[#64748B] dark:text-[#9AA6B8]">
              {isLogin ? 'Enter your details to access your workspace.' : 'Start capturing clearer requirements today.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-[#151B24] p-8 rounded-2xl border border-[#E2E8F0] dark:border-[#252D3A] shadow-xl shadow-slate-200/50 dark:shadow-none">
            
            {/* Split Segmented Control for Sign Up */}
            {!isLogin && (
              <div className="flex p-1 bg-[#F8FAFC] dark:bg-[#0D1117] rounded-xl border border-[#E2E8F0] dark:border-[#252D3A] mb-6">
                <button
                  type="button"
                  onClick={() => setRole('organization')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${role === 'organization' ? 'bg-white dark:bg-[#151B24] shadow-sm text-[#111827] dark:text-white border border-[#E2E8F0] dark:border-[#2A3444]' : 'text-[#64748B] dark:text-[#9AA6B8] hover:text-[#111827] dark:hover:text-white'}`}
                >
                  <Building2 size={16} /> Agency
                </button>
                <button
                  type="button"
                  onClick={() => setRole('freelancer')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${role === 'freelancer' ? 'bg-white dark:bg-[#151B24] shadow-sm text-[#111827] dark:text-white border border-[#E2E8F0] dark:border-[#2A3444]' : 'text-[#64748B] dark:text-[#9AA6B8] hover:text-[#111827] dark:hover:text-white'}`}
                >
                  <User size={16} /> Freelancer
                </button>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-1.5 text-[#111827] dark:text-slate-300">
                  {role === 'organization' ? 'Company Name' : 'Full Name'}
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#2A3444] rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder-slate-400" 
                  placeholder={role === 'organization' ? 'Acme Corp' : 'Jane Doe'}
                  required 
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[#111827] dark:text-slate-300">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#2A3444] rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder-slate-400" 
                  placeholder="you@company.com"
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-[#111827] dark:text-slate-300">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#2A3444] rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder-slate-400" 
                  placeholder="••••••••"
                  required 
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full flex justify-center items-center gap-2 py-3.5 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-sm shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-[#111827]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-[#64748B] dark:text-[#9AA6B8]">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={toggleMode} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline transition-all">
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}