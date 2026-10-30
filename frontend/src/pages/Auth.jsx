import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') === 'signin');

  useEffect(() => {
    setIsLogin(searchParams.get('mode') === 'signin');
  }, [searchParams]);

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false); // For Supabase email verification
  
  const navigate = useNavigate();

  // Force strict dark theme for auth page
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (signInError) throw signInError;
        navigate('/dashboard'); 
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { data: { full_name: formData.name } }
        });
        if (signUpError) throw signUpError;

        // If Supabase requires email confirmation, session will be null
        if (!data.session) {
          setCheckEmail(true);
        } else {
          navigate('/onboarding');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setError('');
    navigate(`/auth?mode=${isLogin ? 'signup' : 'signin'}`, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#000000] text-white font-sans selection:bg-zinc-800">
      
      {/* LEFT PANEL: Branding & Visuals (Hidden on Mobile) */}
      <div className="hidden lg:flex w-5/12 bg-[#0A0A0A] border-r border-zinc-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-zinc-800/20 via-transparent to-transparent opacity-50"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="9" height="9" className="fill-white" rx="2" />
            <rect x="13" y="2" width="9" height="20" className="fill-zinc-400" rx="2" />
            <rect x="2" y="13" width="9" height="9" className="fill-zinc-700" rx="2" />
          </svg>
          <span className="text-xl font-semibold tracking-tight">Archivox</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-semibold mb-6 tracking-tight text-white leading-tight">
            Structure your project discovery seamlessly.
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed font-light">
            Automate requirements gathering with conversational AI. Let your clients talk; we'll write the blueprint.
          </p>
        </div>

        <div className="relative z-10 text-xs text-zinc-500 font-medium">
          © {new Date().getFullYear()} Archivox. All rights reserved.
        </div>
      </div>

      {/* RIGHT PANEL: Form Area */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-12 relative min-h-screen lg:min-h-0 bg-[#000000]">
        
        {/* Mobile Logo & Back */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center lg:hidden z-10">
           <button onClick={() => navigate('/')} className="text-zinc-400 hover:text-white transition-colors">
             <ArrowLeft size={20} />
           </button>
           <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="9" height="9" className="fill-white" rx="2" />
              <rect x="13" y="2" width="9" height="20" className="fill-zinc-400" rx="2" />
              <rect x="2" y="13" width="9" height="9" className="fill-zinc-700" rx="2" />
            </svg>
          </div>
        </div>

        <div className="w-full max-w-[400px]">
          
          <AnimatePresence mode="wait">
            {checkEmail ? (
              <motion.div key="checkEmail" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-white">
                  <Mail size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">Check your email</h2>
                  <p className="text-zinc-400 text-sm">We sent a verification link to <strong>{formData.email}</strong>. Please click the link to activate your account.</p>
                </div>
                <button onClick={() => setCheckEmail(false)} className="text-sm font-medium text-zinc-300 hover:text-white">
                  Back to Sign In
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="mb-8 mt-8 lg:mt-0 text-center lg:text-left">
                  <h2 className="text-2xl font-semibold tracking-tight mb-2 text-white">
                    {isLogin ? 'Welcome back' : 'Create an account'}
                  </h2>
                  <p className="text-zinc-400 text-sm">
                    {isLogin ? 'Enter your credentials to access your workspace.' : 'Sign up to start automating discovery.'}
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-lg bg-red-950/30 border border-red-900/50 flex items-start gap-3 text-red-400 text-sm font-medium">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className="block text-xs font-medium mb-1.5 text-zinc-300">Full Name</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-zinc-800 rounded-lg outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all text-sm placeholder-zinc-600 text-white" 
                        placeholder="Jane Doe"
                        required={!isLogin} 
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-zinc-300">Email</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-zinc-800 rounded-lg outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all text-sm placeholder-zinc-600 text-white" 
                      placeholder="you@example.com"
                      required 
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-medium text-zinc-300">Password</label>
                      {isLogin && (
                        <button type="button" className="text-xs font-medium text-zinc-400 hover:text-white transition-colors">
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full pl-3.5 pr-10 py-2.5 bg-[#0A0A0A] border border-zinc-800 rounded-lg outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all text-sm placeholder-zinc-600 text-white" 
                        placeholder="••••••••"
                        required 
                        minLength={6}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {!isLogin && <p className="text-[11px] text-zinc-500 mt-2">Minimum 6 characters required.</p>}
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full flex justify-center items-center gap-2 py-2.5 mt-2 bg-white text-black font-medium text-sm rounded-lg transition-all hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : (isLogin ? 'Sign In' : 'Create Account')}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-sm font-medium text-zinc-500">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={toggleMode} className="text-white hover:text-zinc-300 transition-all">
                      {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}