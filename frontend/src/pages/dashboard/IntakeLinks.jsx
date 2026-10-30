import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { useOutletContext } from 'react-router-dom';
import { Settings2, Copy, Loader2, Link as LinkIcon, Palette, MessageSquare, Globe } from 'lucide-react';

export default function IntakeLinks() {
  const { workspace } = useOutletContext();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Fallback for older workspaces that don't have a slug yet
  const defaultSlug = workspace?.url_slug || workspace?.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'workspace';

  const [formData, setFormData] = useState({
    url_slug: defaultSlug,
    agent_name: workspace?.agent_name || 'AI Architect',
    agent_tone: workspace?.agent_tone || 'Professional',
    tech_stack: workspace?.tech_stack || '',
    brand_color: workspace?.brand_color || '#4F46E5',
    welcome_message: workspace?.welcome_message || "Let's build something amazing together."
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Ensure the user didn't type spaces or weird characters in the URL slug
    const cleanSlug = formData.url_slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    try {
      const { error } = await supabase
        .from('workspaces')
        .update({
          url_slug: cleanSlug,
          agent_name: formData.agent_name,
          agent_tone: formData.agent_tone,
          tech_stack: formData.tech_stack,
          brand_color: formData.brand_color,
          welcome_message: formData.welcome_message
        })
        .eq('id', workspace.id);

      // If the slug is already taken by another user, Supabase will throw a unique constraint error
      if (error) {
        if (error.code === '23505') throw new Error("That custom URL is already taken by another agency. Please choose another.");
        throw error;
      }
      
      alert('Intake Link Configuration Saved! Please refresh to see changes.');
      setIsEditing(false);
    } catch (error) {
      alert("Error saving: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const baseUrl = window.location.origin;
  const hostedUrl = `${baseUrl}/talk/${defaultSlug}`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827] dark:text-[#F3F5F9]">Intake Links</h1>
          <p className="text-[#64748B] dark:text-[#9AA6B8] mt-1">Manage your white-labeled client discovery portal.</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-[#111827] dark:bg-[#F3F5F9] text-[#FFFFFF] dark:text-[#111827] font-medium rounded-lg transition-colors hover:opacity-90">
            <Settings2 size={18} /> Configure Portal
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-[#FFFFFF] dark:bg-[#151B24] p-8 rounded-3xl border border-[#E2E8F0] dark:border-[#252D3A] shadow-sm space-y-8">
          
          {/* Custom URL Routing */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-[#E2E8F0] dark:border-[#252D3A] pb-2 text-[#111827] dark:text-[#F3F5F9]">
              <Globe size={18} className="text-[#4F46E5] dark:text-[#A5B4FC]"/> Custom Link URL
            </h3>
            <div className="flex items-center bg-[#F8FAFC] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#252D3A] rounded-xl overflow-hidden focus-within:border-[#4F46E5] dark:focus-within:border-[#A5B4FC] transition-colors">
              <span className="px-4 py-3 text-[#64748B] dark:text-[#9AA6B8] font-medium border-r border-[#E2E8F0] dark:border-[#252D3A]">
                {baseUrl}/talk/
              </span>
              <input 
                type="text" 
                required
                value={formData.url_slug} 
                onChange={e => setFormData({...formData, url_slug: e.target.value})} 
                className="flex-1 p-3 bg-transparent outline-none text-[#111827] dark:text-[#F3F5F9] font-mono" 
                placeholder="my-agency-name"
              />
            </div>
            <p className="text-xs text-[#64748B] dark:text-[#9AA6B8] mt-2">Use letters, numbers, and dashes only.</p>
          </div>

          {/* AI Agent Config */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-[#E2E8F0] dark:border-[#252D3A] pb-2 text-[#111827] dark:text-[#F3F5F9]">
              <MessageSquare size={18} className="text-[#4F46E5] dark:text-[#A5B4FC]"/> Voice AI Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#111827] dark:text-[#F3F5F9] mb-2">Agent Name</label>
                <input type="text" value={formData.agent_name} onChange={e => setFormData({...formData, agent_name: e.target.value})} className="w-full p-3 bg-[#F8FAFC] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#252D3A] rounded-xl outline-none focus:border-[#4F46E5] dark:focus:border-[#A5B4FC] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111827] dark:text-[#F3F5F9] mb-2">Agent Tone</label>
                <select value={formData.agent_tone} onChange={e => setFormData({...formData, agent_tone: e.target.value})} className="w-full p-3 bg-[#F8FAFC] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#252D3A] rounded-xl outline-none focus:border-[#4F46E5] dark:focus:border-[#A5B4FC] transition-colors">
                  <option>Professional & Warm</option>
                  <option>Technical & Direct</option>
                  <option>Empathetic & Guiding</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold text-[#111827] dark:text-[#F3F5F9] mb-2">Preferred Tech Stack</label>
              <input type="text" value={formData.tech_stack} onChange={e => setFormData({...formData, tech_stack: e.target.value})} placeholder="e.g. React, Python, PostgreSQL" className="w-full p-3 bg-[#F8FAFC] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#252D3A] rounded-xl outline-none focus:border-[#4F46E5] dark:focus:border-[#A5B4FC] transition-colors" />
            </div>
          </div>

          {/* Branding Config */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-[#E2E8F0] dark:border-[#252D3A] pb-2 text-[#111827] dark:text-[#F3F5F9]">
              <Palette size={18} className="text-[#4F46E5] dark:text-[#A5B4FC]"/> Portal Branding
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#111827] dark:text-[#F3F5F9] mb-2">Brand Color (Hex)</label>
                <div className="flex gap-3">
                  <input type="color" value={formData.brand_color} onChange={e => setFormData({...formData, brand_color: e.target.value})} className="h-12 w-12 rounded-xl cursor-pointer bg-transparent border-0 p-0" />
                  <input type="text" value={formData.brand_color} onChange={e => setFormData({...formData, brand_color: e.target.value})} className="flex-1 p-3 bg-[#F8FAFC] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#252D3A] rounded-xl outline-none font-mono uppercase" />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold text-[#111827] dark:text-[#F3F5F9] mb-2">Welcome Message</label>
              <textarea rows="2" value={formData.welcome_message} onChange={e => setFormData({...formData, welcome_message: e.target.value})} className="w-full p-3 bg-[#F8FAFC] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#252D3A] rounded-xl outline-none focus:border-[#4F46E5] dark:focus:border-[#A5B4FC] transition-colors resize-none"></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0] dark:border-[#252D3A]">
            <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2.5 text-[#64748B] dark:text-[#9AA6B8] font-medium hover:bg-[#F8FAFC] dark:hover:bg-[#0D1117] rounded-xl transition-colors border border-transparent hover:border-[#E2E8F0] dark:hover:border-[#252D3A]">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-[#111827] dark:bg-[#F3F5F9] text-[#FFFFFF] dark:text-[#111827] font-medium rounded-xl transition-colors flex items-center gap-2 hover:opacity-90">
              {loading && <Loader2 size={16} className="animate-spin" />} Save Configuration
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-[#FFFFFF] dark:bg-[#151B24] rounded-3xl border border-[#E2E8F0] dark:border-[#252D3A] shadow-sm overflow-hidden flex flex-col md:flex-row items-center justify-between p-8">
          <div className="flex items-center gap-5 mb-4 md:mb-0">
            <div className="w-14 h-14 bg-[#4F46E5]/10 dark:bg-[#A5B4FC]/10 text-[#4F46E5] dark:text-[#A5B4FC] flex items-center justify-center rounded-2xl">
              <LinkIcon size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#111827] dark:text-[#F3F5F9]">{workspace.name} Intake Link</h3>
              <a href={hostedUrl} target="_blank" rel="noreferrer" className="text-sm text-[#4F46E5] dark:text-[#A5B4FC] hover:underline flex items-center gap-1 mt-1 font-medium">
                {hostedUrl}
              </a>
            </div>
          </div>
          
          <button onClick={() => { navigator.clipboard.writeText(hostedUrl); alert("Copied to clipboard!"); }} className="flex items-center gap-2 px-5 py-2.5 border border-[#E2E8F0] dark:border-[#252D3A] rounded-xl text-sm font-semibold hover:bg-[#F8FAFC] dark:hover:bg-[#0D1117] transition-colors text-[#111827] dark:text-[#F3F5F9]">
            <Copy size={16} /> Copy Link
          </button>
        </div>
      )}
    </div>
  );
}