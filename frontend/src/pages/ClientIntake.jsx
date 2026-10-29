import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { Briefcase, FileText, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

export default function ClientIntake() {
  const { slug } = useParams();
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    client_name: '',
    project_summary: '',
    core_features: ''
  });

  // Find the agency in the DB using the URL slug
  useEffect(() => {
    const fetchAgency = async () => {
      const { data, error } = await supabase
        .from('agencies')
        .select('*');
        
      if (data) {
        // Find the agency whose formatted name matches the URL slug
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
          client_name: formData.client_name,
          project_summary: formData.project_summary,
          core_features: formData.core_features
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to submit project");
      }
      
      setSuccess(true);
    } catch (error) {
      alert("Error submitting project: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500"><Loader2 className="animate-spin" size={32}/></div>;

  if (!agency) return <div className="min-h-screen flex items-center justify-center text-xl font-bold">404 - Agency Link Not Found</div>;

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B0F19] p-4">
        <div className="max-w-md w-full bg-white dark:bg-[#111827] p-8 rounded-3xl border border-slate-200 dark:border-slate-800/60 shadow-xl text-center">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-3">Project Submitted!</h2>
          <p className="text-slate-500 dark:text-slate-400">
            The team at <strong>{agency.company_name}</strong> has received your requirements and will generate a technical blueprint shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] py-12 px-4 selection:bg-indigo-500/30">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-sm font-bold mb-6">
            <Sparkles size={16} /> Powered by Archivox
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Project Discovery</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Submit your requirements to <strong>{agency.company_name}</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#111827] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800/60 shadow-xl space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2 flex items-center gap-2"><Briefcase size={16}/> Your Name / Company</label>
            <input 
              type="text" required
              value={formData.client_name}
              onChange={e => setFormData({...formData, client_name: e.target.value})}
              className="w-full p-4 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="e.g. Acme Corp"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 flex items-center gap-2"><FileText size={16}/> Project Summary</label>
            <textarea 
              required rows="3"
              value={formData.project_summary}
              onChange={e => setFormData({...formData, project_summary: e.target.value})}
              className="w-full p-4 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
              placeholder="Describe the software you want to build in a few sentences..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Key Features Needed</label>
            <textarea 
              required rows="4"
              value={formData.core_features}
              onChange={e => setFormData({...formData, core_features: e.target.value})}
              className="w-full p-4 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
              placeholder="e.g. User Login, Payment Gateway, Admin Dashboard..."
            />
          </div>

          <button type="submit" disabled={submitting} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-70 flex justify-center items-center gap-2">
            {submitting ? <Loader2 className="animate-spin" size={20}/> : 'Submit Requirements'}
          </button>
        </form>
      </div>
    </div>
  );
}