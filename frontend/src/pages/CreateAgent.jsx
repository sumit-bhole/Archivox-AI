import { useState } from 'react';
import { supabase } from '../utils/supabase';

export default function CreateAgent() {
  const [formData, setFormData] = useState({
    companyName: '',
    agentName: '',
    tone: 'Professional & Warm',
    techStack: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [hostedLink, setHostedLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // 1. Get current logged in agency
      const { data: { user } } = await supabase.auth.getUser();
      
      const slug = formData.companyName.toLowerCase().replace(/\s+/g, '-');

      // 2. Here, we would normally make a call to our FastAPI backend 
      // which then calls the Bolna API to create the custom agent.
      // For now, we simulate saving this config to our Supabase DB.
      
      const { error } = await supabase
        .from('agencies')
        .update({
          company_name: formData.companyName,
          agent_name: formData.agentName,
          agent_tone: formData.tone,
          tech_stack: formData.techStack,
          hosted_page_slug: slug
          // bolna_agent_id: "We will get this from Bolna API"
        })
        .eq('id', user.id);

      if (error) throw error;

      setHostedLink(`https://archivox.ai/talk/${slug}`);
      alert("Agent Created Successfully!");
      
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Build Your AI Architect</h1>
      <p className="text-slate-500 mb-8">Customize how your agent interacts with your clients.</p>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Your Company Name</label>
            <input type="text" required
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border rounded-lg"
              placeholder="e.g. Darvanta Tech"
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Agent's Name</label>
            <input type="text" required
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border rounded-lg"
              placeholder="e.g. Sarah"
              onChange={(e) => setFormData({...formData, agentName: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Your Primary Tech Stack</label>
          <input type="text" required
            className="w-full p-3 bg-slate-50 dark:bg-slate-950 border rounded-lg"
            placeholder="e.g. React, Python, PostgreSQL"
            onChange={(e) => setFormData({...formData, techStack: e.target.value})}
          />
          <p className="text-xs text-slate-500 mt-1">The AI will prioritize these technologies in the final PRD.</p>
        </div>

        <button type="submit" disabled={isCreating}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">
          {isCreating ? 'Provisioning AI Agent...' : 'Deploy My Agent'}
        </button>
      </form>

      {hostedLink && (
        <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <h3 className="text-lg font-bold text-green-800 dark:text-green-400">Agent Deployed!</h3>
          <p className="text-slate-600 dark:text-slate-300 mt-2">Here is your custom hosted link. Put this on your website:</p>
          <div className="mt-4 flex gap-4">
            <input type="text" readOnly value={hostedLink} className="flex-1 p-3 bg-white dark:bg-slate-950 border rounded-lg font-mono text-sm" />
            <button className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-lg">Copy Link</button>
          </div>
        </div>
      )}
    </div>
  );
}