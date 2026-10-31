import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { useOutletContext } from 'react-router-dom';
import { Loader2, Search, Filter, Clock, X, User, Building, FileText, Mic, RefreshCw, Activity, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Leads() {
  const { workspace } = useOutletContext();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [selectedLead, setSelectedLead] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, calls, history
  
  // Detailed data states
  const [projectCalls, setProjectCalls] = useState([]);
  const [projectChanges, setProjectChanges] = useState([]);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      if (!workspace) return;
      const { data } = await supabase
        .from('leads_prds')
        .select('*')
        .eq('agency_id', workspace.id)
        .order('last_activity_date', { ascending: false });
      if (data) setLeads(data);
      setLoading(false);
    };
    fetchLeads();
  }, [workspace]);

  // Fetch Calls & History when a lead is selected
  useEffect(() => {
    if (!selectedLead) return;
    const fetchDetails = async () => {
      setFetchingDetails(true);
      const [callsRes, changesRes] = await Promise.all([
        supabase.from('project_calls').select('*').eq('project_id', selectedLead.id).order('created_at', { ascending: false }),
        supabase.from('requirement_changes').select('*').eq('project_id', selectedLead.id).order('created_at', { ascending: false })
      ]);
      if (callsRes.data) setProjectCalls(callsRes.data);
      if (changesRes.data) setProjectChanges(changesRes.data);
      setFetchingDetails(false);
    };
    fetchDetails();
  }, [selectedLead]);

  const handleRetryGeneration = async (callId) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      await fetch(`${API_URL}/api/webhooks/retry-generation/${callId}`, { method: 'POST' });
      alert("AI Generation queued for retry. Please refresh in a moment.");
    } catch (err) {
      alert("Failed to retry generation.");
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.client_name?.toLowerCase().includes(search.toLowerCase()) || 
    lead.company_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Projects & Leads</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">Manage project scopes, call histories, and requirements.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input type="text" placeholder="Search clients or projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-900 rounded-xl outline-none focus:border-zinc-400 dark:focus:border-zinc-700 transition-colors text-sm text-zinc-900 dark:text-white" />
        </div>
      </div>

      <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-900 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 dark:bg-black/50 border-b border-zinc-200 dark:border-zinc-900 text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              <th className="p-5">Client / Company</th>
              <th className="p-5">Project Summary</th>
              <th className="p-5">Last Activity</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900">
            {loading ? <tr><td colSpan="4" className="p-8 text-center text-zinc-500 text-sm">Loading...</td></tr> : 
             filteredLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                <td className="p-5">
                  <p className="font-bold text-zinc-900 dark:text-white">{lead.client_name}</p>
                  <p className="text-xs text-zinc-500">{lead.company_name}</p>
                </td>
                <td className="p-5 max-w-xs"><p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-1">{lead.project_summary || lead.project_name}</p></td>
                <td className="p-5 text-sm text-zinc-500">{new Date(lead.last_activity_date || lead.created_at).toLocaleDateString()}</td>
                <td className="p-5 text-right">
                  <button onClick={() => { setSelectedLead(lead); setActiveTab('overview'); }} className="px-4 py-2 bg-zinc-900 text-white dark:bg-white dark:text-black text-xs font-bold rounded-lg hover:opacity-90">Open CRM</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETAILED PROJECT CRM SLIDE-OUT PANEL */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedLead(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="relative w-full max-w-3xl h-full bg-white dark:bg-[#0A0A0A] shadow-2xl border-l border-zinc-200 dark:border-zinc-800 flex flex-col">
              
              <div className="h-16 px-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 shrink-0">
                <h2 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2"><Building size={18} className="text-indigo-500"/> {selectedLead.project_name || 'Project Workspace'}</h2>
                <button onClick={() => setSelectedLead(null)} className="p-2 text-zinc-500 hover:text-white rounded-lg transition-colors"><X size={20} /></button>
              </div>

              {/* CRM Tabs */}
              <div className="flex border-b border-zinc-200 dark:border-zinc-800 px-6 shrink-0 pt-4">
                <button onClick={() => setActiveTab('overview')} className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'overview' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>Requirements</button>
                <button onClick={() => setActiveTab('calls')} className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'calls' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>Call History <span className="bg-zinc-800 text-[10px] text-white px-1.5 rounded-full">{projectCalls.length}</span></button>
                <button onClick={() => setActiveTab('history')} className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'history' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>Change Ledger</button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {fetchingDetails ? (
                  <div className="flex justify-center py-20"><Loader2 className="animate-spin text-zinc-500" /></div>
                ) : (
                  <>
                    {/* TAB 1: OVERVIEW & MASTER REQUIREMENTS */}
{activeTab === 'overview' && (
  <div className="space-y-6 animate-in fade-in">
    <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30">
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Client Contact</p>
        <p className="font-medium text-sm text-zinc-900 dark:text-white">
          {selectedLead.client_name}<br/>{selectedLead.client_email}
        </p>
      </div>
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Total Call Time</p>
        <p className="font-medium text-sm text-zinc-900 dark:text-white">
          {projectCalls.reduce((acc, call) => acc + (call.duration_seconds || 0), 0)} Seconds
        </p>
      </div>
    </div>
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
        <FileText size={16}/> Consolidated Blueprint (PRD)
      </h3>
      <div className="p-5 rounded-xl border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/50 dark:bg-indigo-900/10 text-sm whitespace-pre-wrap leading-relaxed">
        
        {/* SAFELY RENDER EITHER A STRING OR A JSON ARRAY */}
        {!selectedLead.core_features ? (
          "Blueprint will be generated after the first call."
        ) : typeof selectedLead.core_features === 'string' ? (
          selectedLead.core_features
        ) : Array.isArray(selectedLead.core_features) ? (
          <ul className="space-y-4">
            {selectedLead.core_features.map((feature, idx) => (
              <li key={idx} className="p-4 bg-white dark:bg-[#151B24] rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h4 className="font-bold text-zinc-900 dark:text-white text-base mb-1">{feature.title || 'Feature'}</h4>
                <p className="text-zinc-600 dark:text-zinc-400 mb-2">{feature.description}</p>
                {feature.user_story && (
                  <p className="text-xs italic font-medium text-zinc-500 border-l-2 border-indigo-500 pl-2">
                    "{feature.user_story}"
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          "Invalid blueprint format detected."
        )}

      </div>
    </div>
  </div>
)}
                    {/* TAB 2: CALL HISTORY & TRANSCRIPTS */}
                    {activeTab === 'calls' && (
                      <div className="space-y-6 animate-in fade-in">
                        {projectCalls.length === 0 ? <p className="text-zinc-500 text-sm">No calls recorded yet.</p> : projectCalls.map((call, i) => (
                          <div key={call.id} className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-sm">Discovery Session #{projectCalls.length - i}</h4>
                                <p className="text-xs text-zinc-500 flex items-center gap-2 mt-1"><Clock size={12}/> {new Date(call.created_at).toLocaleString()} • {call.duration_seconds}s</p>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${call.status === 'completed' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/30 text-red-400'}`}>{call.status}</span>
                                {call.generation_status === 'failed' && (
                                  <button onClick={() => handleRetryGeneration(call.id)} className="text-[10px] bg-indigo-600 text-white px-2 py-1 rounded flex items-center gap-1"><RefreshCw size={10}/> Retry AI Gen</button>
                                )}
                              </div>
                            </div>
                            <div className="bg-black/20 p-4 rounded-lg font-mono text-xs text-zinc-300 max-h-48 overflow-y-auto whitespace-pre-wrap">
                              {call.transcript || "No transcript captured."}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* TAB 3: REQUIREMENT CHANGE LEDGER */}
                    {activeTab === 'history' && (
                      <div className="space-y-4 animate-in fade-in relative border-l border-zinc-800 ml-4 pl-6">
                        {projectChanges.length === 0 ? <p className="text-zinc-500 text-sm">No history recorded yet.</p> : projectChanges.map(change => (
                          <div key={change.id} className="relative">
                            <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-4 border-[#0A0A0A] ${change.change_type === 'added' ? 'bg-emerald-500' : change.change_type === 'modified' ? 'bg-blue-500' : change.change_type === 'removed' ? 'bg-red-500' : 'bg-purple-500'}`} />
                            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{change.change_type}</span>
                                <span className="text-[10px] text-zinc-500">{new Date(change.created_at).toLocaleDateString()}</span>
                              </div>
                              <p className="text-sm font-semibold mb-2">{change.description}</p>
                              {change.previous_value && <p className="text-xs line-through text-red-400/70 bg-red-900/10 p-1.5 rounded mb-1">{change.previous_value}</p>}
                              {change.new_value && <p className="text-xs text-emerald-400/90 bg-emerald-900/10 p-1.5 rounded">{change.new_value}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}