import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { useOutletContext } from 'react-router-dom';
import { Plus, Link as LinkIcon, Settings2, Copy, Loader2 } from 'lucide-react';

export default function IntakeLinks() {
  const { profile } = useOutletContext();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Maps perfectly to the Supabase schema we built
  const [formData, setFormData] = useState({
    agent_name: profile?.agent_name || 'AI Architect',
    agent_tone: profile?.agent_tone || 'Professional',
    tech_stack: profile?.tech_stack || '',
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('agencies')
        .update({
          agent_name: formData.agent_name,
          agent_tone: formData.agent_tone,
          tech_stack: formData.tech_stack
        })
        .eq('id', user.id);

      if (error) throw error;
      alert('Link Settings Updated Successfully');
      setIsEditing(false);
    } catch (error) {
      alert("Error saving: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Dynamically grabs localhost or Vercel domain, and creates a clean URL slug
  const baseUrl = window.location.origin;
  const slug = profile?.company_name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'agency';
  const hostedUrl = `${baseUrl}/talk/${slug}`;
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">Intake Links</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your white-labeled voice agent links.</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">
            <Settings2 size={18} /> Edit Agent Configuration
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white dark:bg-[#111827] p-8 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm space-y-6">
          <h3 className="text-lg font-bold mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">Configure AI Agent</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Agent Name</label>
              <input type="text" value={formData.agent_name} onChange={e => setFormData({...formData, agent_name: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Agent Tone</label>
              <select value={formData.agent_tone} onChange={e => setFormData({...formData, agent_tone: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500 transition-colors">
                <option>Professional & Warm</option>
                <option>Technical & Direct</option>
                <option>Empathetic & Guiding</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Preferred Tech Stack (Instructions for AI)</label>
            <input type="text" value={formData.tech_stack} onChange={e => setFormData({...formData, tech_stack: e.target.value})} placeholder="e.g. React, Python, PostgreSQL" className="w-full p-3 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500 transition-colors" />
            <p className="text-xs text-slate-500 mt-2">The AI will heavily bias its PRD generation toward these technologies.</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2.5 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors flex items-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin" />} Save Configuration
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm overflow-hidden flex flex-col md:flex-row items-center justify-between p-6">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 flex items-center justify-center rounded-xl">
              <LinkIcon size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">{profile?.company_name} Intake Link</h3>
              <a href={hostedUrl} target="_blank" className="text-sm text-indigo-500 hover:underline flex items-center gap-1 mt-1">
                {hostedUrl}
              </a>
            </div>
          </div>
          
          <button onClick={() => navigator.clipboard.writeText(hostedUrl)} className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Copy size={16} /> Copy URL
          </button>
        </div>
      )}
    </div>
  );
}