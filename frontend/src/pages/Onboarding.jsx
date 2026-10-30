import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { Building2, User, ArrowRight, ArrowLeft, Loader2, CheckCircle2, Check } from 'lucide-react';

const SERVICES_LIST = [
  'Web development', 'Mobile app development', 'AI / ML development', 
  'SaaS development', 'UI/UX design', 'E-commerce development', 
  'API / backend development', 'Other'
];

const TEAM_SIZES = ['Just me', '2–5 people', '6–10 people', '11–25 people', '26–50 people', '50+ people'];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userAuth, setUserAuth] = useState(null);

  const [formData, setFormData] = useState({
    workspace_type: '',
    name: '', // Maps to company name or professional name
    title: '', // Only for freelancers
    website: '',
    country: '',
    city: '',
    team_size: '',
    services: [],
    description: ''
  });

  useEffect(() => {
    // Ensure the user is actually authenticated before they can onboard
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
      } else {
        setUserAuth(user);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleNext = () => setStep((s) => Math.min(s + 1, 4));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const toggleService = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      
      const response = await fetch(`${API_BASE_URL}/api/workspaces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userAuth.id,
          ...formData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create workspace");
      }

      navigate('/dashboard');
    } catch (error) {
      alert("Error: " + error.message);
      setLoading(false);
    }
  };

  const isStepValid = () => {
    if (step === 1) return formData.workspace_type !== '';
    if (step === 2) {
      if (!formData.name || !formData.country || !formData.city) return false;
      if (formData.workspace_type === 'freelancer' && !formData.title) return false;
      return true;
    }
    if (step === 3) {
      if (formData.services.length === 0) return false;
      if (formData.workspace_type === 'organization' && !formData.team_size) return false;
      return true;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0D1117] flex flex-col items-center justify-center p-6 selection:bg-[#4F46E5]/20 dark:selection:bg-[#A5B4FC]/30 font-sans text-[#111827] dark:text-[#F3F5F9]">
      
      {/* Top Branding */}
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="9" height="9" className="fill-[#4F46E5] dark:fill-[#A5B4FC]" rx="2" />
          <rect x="13" y="2" width="9" height="20" className="fill-[#111827] dark:fill-[#F3F5F9]" rx="2" />
          <rect x="2" y="13" width="9" height="9" className="fill-[#64748B] dark:fill-[#9AA6B8]" rx="2" />
        </svg>
        <span className="text-xl font-bold tracking-tight text-[#111827] dark:text-[#F3F5F9]">Archivox</span>
      </div>

      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-semibold text-[#64748B] dark:text-[#9AA6B8] mb-3 uppercase tracking-wider">
            <span>Workspace Setup</span>
            <span>Step {step} of 4</span>
          </div>
          <div className="w-full h-1.5 bg-[#E2E8F0] dark:bg-[#252D3A] rounded-full overflow-hidden flex">
            <div className="h-full bg-[#4F46E5] dark:bg-[#A5B4FC] transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }}></div>
          </div>
        </div>

        {/* Wizard Card */}
        <div className="bg-[#FFFFFF] dark:bg-[#151B24] p-8 md:p-12 rounded-3xl border border-[#E2E8F0] dark:border-[#252D3A] shadow-xl shadow-slate-200/50 dark:shadow-none">
          
          {/* STEP 1: Workspace Type */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold tracking-tight mb-2">How will you use Archivox?</h2>
              <p className="text-[#64748B] dark:text-[#9AA6B8] mb-8">Choose the workspace type that best describes your work.</p>
              
              <div className="space-y-4">
                <button 
                  onClick={() => setFormData({...formData, workspace_type: 'organization'})}
                  className={`w-full p-6 flex items-start gap-4 rounded-2xl border-2 text-left transition-all ${formData.workspace_type === 'organization' ? 'border-[#4F46E5] bg-[#4F46E5]/5 dark:border-[#A5B4FC] dark:bg-[#A5B4FC]/10' : 'border-[#E2E8F0] dark:border-[#252D3A] hover:border-[#64748B] dark:hover:border-[#9AA6B8]'}`}
                >
                  <div className={`p-3 rounded-xl ${formData.workspace_type === 'organization' ? 'bg-[#4F46E5] text-white dark:bg-[#A5B4FC] dark:text-[#0D1117]' : 'bg-[#F8FAFC] dark:bg-[#0D1117] text-[#64748B] dark:text-[#9AA6B8]'}`}>
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">Agency / Organization</h3>
                    <p className="text-sm text-[#64748B] dark:text-[#9AA6B8]">Manage client discovery for a software agency or development team.</p>
                  </div>
                </button>

                <button 
                  onClick={() => setFormData({...formData, workspace_type: 'freelancer'})}
                  className={`w-full p-6 flex items-start gap-4 rounded-2xl border-2 text-left transition-all ${formData.workspace_type === 'freelancer' ? 'border-[#4F46E5] bg-[#4F46E5]/5 dark:border-[#A5B4FC] dark:bg-[#A5B4FC]/10' : 'border-[#E2E8F0] dark:border-[#252D3A] hover:border-[#64748B] dark:hover:border-[#9AA6B8]'}`}
                >
                  <div className={`p-3 rounded-xl ${formData.workspace_type === 'freelancer' ? 'bg-[#4F46E5] text-white dark:bg-[#A5B4FC] dark:text-[#0D1117]' : 'bg-[#F8FAFC] dark:bg-[#0D1117] text-[#64748B] dark:text-[#9AA6B8]'}`}>
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">Independent Freelancer</h3>
                    <p className="text-sm text-[#64748B] dark:text-[#9AA6B8]">Manage your own client projects and requirements.</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Basic Info */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Basic information</h2>
              <p className="text-[#64748B] dark:text-[#9AA6B8] mb-8">Tell us about {formData.workspace_type === 'organization' ? 'your agency' : 'yourself'}.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{formData.workspace_type === 'organization' ? 'Company Name *' : 'Display Name *'}</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3.5 bg-[#F8FAFC] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#252D3A] rounded-xl outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] dark:focus:border-[#A5B4FC] transition-all" required />
                </div>

                {formData.workspace_type === 'freelancer' && (
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Professional Title *</label>
                    <input type="text" placeholder="e.g. Full Stack Developer" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3.5 bg-[#F8FAFC] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#252D3A] rounded-xl outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] dark:focus:border-[#A5B4FC] transition-all" required />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Country *</label>
                    <input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full p-3.5 bg-[#F8FAFC] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#252D3A] rounded-xl outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] dark:focus:border-[#A5B4FC] transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">City *</label>
                    <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-3.5 bg-[#F8FAFC] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#252D3A] rounded-xl outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] dark:focus:border-[#A5B4FC] transition-all" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5">{formData.workspace_type === 'organization' ? 'Website' : 'Portfolio / Website'}</label>
                  <input type="url" placeholder="https://" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full p-3.5 bg-[#F8FAFC] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#252D3A] rounded-xl outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] dark:focus:border-[#A5B4FC] transition-all" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Services */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Services & expertise</h2>
              <p className="text-[#64748B] dark:text-[#9AA6B8] mb-8">What type of work do you specialize in?</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-3">Select your core services *</label>
                  <div className="flex flex-wrap gap-2">
                    {SERVICES_LIST.map(service => (
                      <button
                        key={service}
                        onClick={() => toggleService(service)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${formData.services.includes(service) ? 'bg-[#111827] border-[#111827] text-white dark:bg-[#F3F5F9] dark:border-[#F3F5F9] dark:text-[#111827]' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:border-[#64748B] dark:bg-[#0D1117] dark:border-[#252D3A] dark:text-[#9AA6B8] dark:hover:border-[#9AA6B8]'}`}
                      >
                        {formData.services.includes(service) && <Check size={14} className="inline mr-1.5 -mt-0.5" />}
                        {service}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.workspace_type === 'organization' && (
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Team Size *</label>
                    <select value={formData.team_size} onChange={e => setFormData({...formData, team_size: e.target.value})} className="w-full p-3.5 bg-[#F8FAFC] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#252D3A] rounded-xl outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] dark:focus:border-[#A5B4FC] transition-all appearance-none">
                      <option value="">Select team size...</option>
                      {TEAM_SIZES.map(size => <option key={size} value={size}>{size}</option>)}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold mb-1.5">Short description</label>
                  <textarea rows="3" placeholder="Tell clients a bit about your expertise..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3.5 bg-[#F8FAFC] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#252D3A] rounded-xl outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] dark:focus:border-[#A5B4FC] transition-all resize-none"></textarea>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-6">
              <div className="w-20 h-20 bg-[#4F46E5]/10 dark:bg-[#A5B4FC]/10 text-[#4F46E5] dark:text-[#A5B4FC] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-3">You're all set!</h2>
              <p className="text-[#64748B] dark:text-[#9AA6B8] mb-8 max-w-md mx-auto">
                Your workspace for <strong>{formData.name}</strong> is ready. Let's head to your dashboard and create your first AI intake link.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-10 pt-6 border-t border-[#E2E8F0] dark:border-[#252D3A] flex justify-between items-center">
            {step > 1 ? (
              <button onClick={handleBack} className="flex items-center gap-2 text-sm font-semibold text-[#64748B] dark:text-[#9AA6B8] hover:text-[#111827] dark:hover:text-white transition-colors">
                <ArrowLeft size={16} /> Back
              </button>
            ) : <div></div>}

            {step < 4 ? (
              <button 
                onClick={handleNext} 
                disabled={!isStepValid()}
                className="flex items-center gap-2 px-6 py-3 bg-[#111827] dark:bg-[#F3F5F9] text-[#FFFFFF] dark:text-[#111827] text-sm font-semibold rounded-xl transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-[#4F46E5] dark:bg-[#A5B4FC] text-white dark:text-[#0D1117] text-sm font-semibold rounded-xl transition-all shadow-lg shadow-[#4F46E5]/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Enter Dashboard'}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}