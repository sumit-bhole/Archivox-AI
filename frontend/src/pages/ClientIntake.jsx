import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { CheckCircle2, Loader2, Target, Calendar, DollarSign, Briefcase, Mail, Building } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ClientIntake() {
  const { slug } = useParams();
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    company_name: '',
    project_summary: '',
    core_features: '',
    budget: '',
    timeline: ''
  });

  useEffect(() => {
    const fetchAgency = async () => {
      const { data } = await supabase.from('agencies').select('*');
      if (data) {
        const matchedAgency = data.find(a => 
          a.company_name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
        );
        if (matchedAgency) setAgency(matchedAgency);
      }
      setLoading(false);
    };
    fetchAgency();
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${API_BASE_URL}/api/leads/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agency_id: agency.id,
          ...formData
        })
      });
      if (!response.ok) throw new Error("Submission failed");
      setSuccess(true);
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-slate-400" size={32}/></div>;
  if (!agency) return <div className="min-h-screen flex items-center justify-center text-xl font-bold">404 - Workspace Not Found</div>;

  const brandColor = agency.brand_color || '#4F46E5';

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-2xl text-center border border-slate-100 dark:border-slate-800">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${brandColor}20`, color: brandColor }}>
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Request Received</h2>
          <p className="text-slate-500">The engineering team at <strong>{agency.company_name}</strong> is reviewing your requirements and generating a technical blueprint.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-slate-950 selection:bg-slate-200 dark:selection:bg-slate-800">
      
      {/* Left Side: Agency Branding (Dynamic Color) */}
      <div className="md:w-5/12 p-12 md:p-20 flex flex-col justify-between text-white relative overflow-hidden" style={{ backgroundColor: brandColor }}>
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent mix-blend-overlay"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-12 tracking-tight">{agency.company_name}</h2>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] mb-6">
            Project <br/>Discovery
          </h1>
          <p className="text-lg md:text-xl font-medium text-white/80 max-w-sm">
            {agency.welcome_message || "Let's build something amazing together. Share your vision, and we'll architect the solution."}
          </p>
        </div>
        <div className="relative z-10 mt-12 pt-12 border-t border-white/20 text-sm font-medium text-white/70">
          Secure Intake Portal powered by Archivox
        </div>
      </div>

      {/* Right Side: Detailed Intake Form */}
      <div className="md:w-7/12 p-8 md:p-20 overflow-y-auto bg-slate-50 dark:bg-slate-950">
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-8">
          
          {/* Section 1: Client Details */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b border-slate-200 dark:border-slate-800 pb-2">1. Your Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2"><Briefcase size={16}/> Full Name</label>
                <input type="text" required value={formData.client_name} onChange={e => setFormData({...formData, client_name: e.target.value})} className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none transition-all" style={{ focusBorderColor: brandColor }} placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2"><Building size={16}/> Company</label>
                <input type="text" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none transition-all" placeholder="Acme Corp" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2"><Mail size={16}/> Work Email</label>
              <input type="email" required value={formData.client_email} onChange={e => setFormData({...formData, client_email: e.target.value})} className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none transition-all" placeholder="jane@acme.com" />
            </div>
          </div>

          {/* Section 2: Project Scope */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b border-slate-200 dark:border-slate-800 pb-2">2. Project Scope</h3>
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2"><Target size={16}/> Project Goal</label>
              <textarea required rows="3" value={formData.project_summary} onChange={e => setFormData({...formData, project_summary: e.target.value})} className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none resize-none transition-all" placeholder="What is the main problem this software solves?" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Key Features Needed</label>
              <textarea required rows="4" value={formData.core_features} onChange={e => setFormData({...formData, core_features: e.target.value})} className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none resize-none transition-all" placeholder="List the non-negotiable features..." />
            </div>
          </div>

          {/* Section 3: Logistics */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b border-slate-200 dark:border-slate-800 pb-2">3. Logistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2"><DollarSign size={16}/> Estimated Budget</label>
                <select value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none appearance-none">
                  <option value="">Select range...</option>
                  <option>&lt; $10k</option>
                  <option>$10k - $25k</option>
                  <option>$25k - $50k</option>
                  <option>$50k+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2"><Calendar size={16}/> Target Timeline</label>
                <select value={formData.timeline} onChange={e => setFormData({...formData, timeline: e.target.value})} className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none appearance-none">
                  <option value="">Select timeline...</option>
                  <option>ASAP (1-2 months)</option>
                  <option>3-4 months</option>
                  <option>Flexible (6+ months)</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="w-full py-5 text-white font-bold rounded-xl transition-all shadow-lg hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 flex justify-center items-center gap-2" style={{ backgroundColor: brandColor }}>
            {submitting ? <Loader2 className="animate-spin" size={20}/> : 'Submit Requirements for Review'}
          </button>
        </form>
      </div>
    </div>
  );
}